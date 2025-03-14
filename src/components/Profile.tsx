import { User } from '@/types/User'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { MapPin } from 'lucide-react';
import { Badge } from './ui/badge';
import EditButton from './ui/edit-button';

const Profile = ({user}:{user:User}) => {
  return (
    <div className='w-full h-auto flex flex-col items-center'>
    <div className="max-w-5xl w-full mt-16 mx-4">
      <Card>
        <div className="w-full sm:h-52 h-36 border-b relative bg-primary rounded-t-xl">
          <EditButton classname='absolute right-4 top-4 h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-blue-700 dark:text-secondary-foreground font-bold hover:text-secondary-foreground dark:hover:text-primary cursor-pointer' profile={user}/>
        <Avatar className='sm:w-48 w-32 h-auto absolute sm:left-14 left-10 sm:-bottom-14 -bottom-11 border-4 border-muted box-border bg-muted' >
        <AvatarImage src={user.image_url} />
      </Avatar>
        </div>
        <div className="p-4">
          <div className="flex justify-end h-12">
            <EditButton classname='h-9 w-9 rounded-full bg-transparent flex items-center justify-center text-secondary-foreground dark:text-secondary-foreground font-bold dark:hover:text-primary hover:bg-secondary cursor-pointer' profile={user}/>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <span className="text-2xl font-bold">{user.first_name} {user.last_name}</span>
              <span className="text-lg font-medium text-muted-foreground">@{user.username}</span>
              <span className="text-sm dark:text-primary mt-1 inline"><MapPin className="w-5 h-5 shrink-0 inline" /> {user.locality}, {user.city}, {user.district}, {user.state}, {user.country}</span>
            </div>
            <div className='flex-1 h-full'>
              {
                user.niches.map((niche,index)=>(
                  <Badge key={index} className="mr-2">{niche}</Badge>
                ))
              }
            </div>
          </div>
        </div>
      </Card>
    </div>
    </div>
  )
}

export default Profile