import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const country_code=req.nextUrl.searchParams.get("country_code");
    const pincode=req.nextUrl.searchParams.get("pincode");
    console.log(country_code,pincode);
    if(!country_code || !pincode) return NextResponse.json({message:"Invalid request"},{status:400});
    try{
        const localities=await pool.query(`
            SELECT 
                json_agg(localities) AS localities,
                cities.name AS city_name,
                districts.name AS district_name, 
                states.name AS state_name
            FROM pincodes
            JOIN localities ON localities.pincode_ref_id = pincodes.id
            JOIN cities ON cities.id = pincodes.city_id
            JOIN districts ON districts.id = cities.district_id
            JOIN states ON states.id = districts.state_id
            WHERE pincodes.country_code = $1 AND pincodes.pincode = $2
            GROUP BY districts.name, states.name, cities.name`,[country_code,pincode]);
        if(localities.rowCount==0) return NextResponse.json({message:"No localities found"},{status:404});
        return NextResponse.json(localities.rows[0],{status:200});
    }
    catch(error){
        return NextResponse.json({message:"Internal server error",error},{status:500});
    }
}