import { Metadata } from 'next';
import React from 'react'
export const metadata: Metadata = {
    title: "Sign Up | Increati",
    description: "Sign up for an Increati account",
  };

const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div className='flex items-center justify-center min-h-screen py-2'>
      {children}
    </div>
  )
}

export default layout