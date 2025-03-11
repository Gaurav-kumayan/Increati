import { pool } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const {userId}=await auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    const payload:{first_name:string|null,last_name:string|null,selectedNiches:number[],address:string|null,locality:number}=await req.json()
    const {selectedNiches,address,locality}=payload;
    const first_name=payload.first_name!==null?payload.first_name?.trim()===""?null:payload.first_name:null
    const last_name=payload.last_name!==null?payload.last_name?.trim()===""?null:payload.last_name:null
    if(!first_name) return NextResponse.json({ error: 'Please enter your first name' }, { status: 400 });
    if(!selectedNiches || selectedNiches.length===0) return NextResponse.json({ error: 'Please select at least one niche' }, { status: 400 });
    if(!locality) return NextResponse.json({ error: 'Please select a locality' }, { status: 400 });
    const client = await clerkClient();

    const user = await client.users.getUser(userId);
    if(!user) return NextResponse.json({message:"User not found"},{status:404});
    try{
      await client.users.updateUser(userId, {
        firstName: first_name,
        lastName: last_name===null?"":last_name
      });
      await pool.query("BEGIN");
      await pool.query("INSERT INTO users (id, username, first_name, last_name, address, locality, image_url, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8);",[userId,user.username,first_name,last_name,address==""?null:address,locality,user.imageUrl,user.primaryEmailAddress?.emailAddress]);
      let user_niche_query="INSERT INTO user_niche (user_id, niche_id) VALUES";
      const user_niche_query_params:(string|number)[]=[];
      selectedNiches.forEach((niche_id,index)=>{
        user_niche_query+=`($${index*2+1},$${index*2+2})${index===selectedNiches.length-1?"":" , "}`;
        user_niche_query_params.push(userId,niche_id);
      });
      await pool.query(user_niche_query,user_niche_query_params);
      await pool.query("COMMIT");
    }
    catch(error){
      console.log(error);
      await pool.query("ROLLBACK");
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
      
    return NextResponse.json({ message: 'User registered successfully' }, { status: 200 });
}