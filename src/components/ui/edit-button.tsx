"use client";
import { User } from '@/types/User';
import { useUser } from '@clerk/nextjs';
import { Edit3 } from 'lucide-react'
import React from 'react'

const EditButton = ({classname,profile}:{classname?:string,profile:User}) => {
    const {isLoaded,user}=useUser();
    if(isLoaded && user && user.id===profile.user_id) return (
        <div className={classname}>
            <Edit3 size={24} />
        </div>
    )
    return null;
}

export default EditButton