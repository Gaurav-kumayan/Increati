import Navbar from '@/components/Navbar/Navbar';
import Profile from '@/components/Profile';
import { Button } from '@/components/ui/button';
import UserProfile from '@/components/UserProfile';
import { pool } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

async function getUser(username:string) {
  const {rowCount,rows}=await pool.query(`SELECT DISTINCT ON (users.id) 
    users.id AS user_id, 
    username,
    first_name,
    last_name,
    image_url,
    localities.name AS locality, 
    address,
    cities.name AS city,
    districts.name AS district,
    states.name AS state, 
    countries.name AS country,
    COALESCE(
        (SELECT ARRAY_AGG(niche.name) 
         FROM user_niche 
         LEFT JOIN niche ON niche.id = user_niche.niche_id 
         WHERE user_niche.user_id = users.id), '{}'
    ) AS niches
FROM users 
INNER JOIN localities ON users.locality = localities.id 
INNER JOIN pincodes ON pincodes.id = localities.pincode_ref_id 
INNER JOIN cities ON cities.id = pincodes.city_id
INNER JOIN districts ON districts.id = cities.district_id 
INNER JOIN states ON states.id = districts.state_id 
INNER JOIN countries ON countries.country_code = states.country_code 
WHERE username = $1;
`,[username]);
  if(rowCount===0) return null;
  return rows[0];
}

export async function generateMetadata({params}:{
  params:Promise<{
    options:string[]
  }>
}): Promise<Metadata> {
  const [username]=(await params)['options'];
  const user=await getUser(username);

  if(!user){
    return {
      title: 'User not found | Increati',
      description: 'The user you are looking for does not exist.'
    }
  }
  
  return {
    title: `${user.first_name} ${user.last_name} (@${user.username})`,
    description: 'Manage your profile, showcase your expertise, and connect with others.',
  };
}

export default async function ProfilePage({params}:{
  params:Promise<{
    options:string[]
  }>
}){
  const [username]=(await params)['options'];
  const user=await getUser(username);
  const {userId}=await auth();
  if(user){
    if(userId===user.user_id){
      return (
        <>
        <Navbar pathname={`/user/${username}`} />
        <UserProfile userInfo={user}/>
        </>
      )
    }
    else{
      return (
        <>
        <Navbar pathname={`/user/${username}`} />
        <Profile user={user} />
        </>
      )
    }
  }
  else{
    return <>
      <Navbar pathname={`/user/${username}`} />
      <div className="flex flex-col h-full w-full items-center justify-center gap-4">
        <h1 className='text-2xl'>Sorry, this page isn&apos;t available</h1>
        <p className='text-lg'>The link you followed may be broken, or the page may have been removed.
          <Link href='/' passHref>
          <Button variant={"link"} className='text-lg text-blue-600 dark:text-primary px-1'>Go back to Increati</Button>
          </Link>
          </p>
      </div>
    </>
  }
}