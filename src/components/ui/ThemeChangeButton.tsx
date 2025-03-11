"use client";
import React, { useEffect, useState } from 'react'
import { Button } from './button'
import { Skeleton } from './skeleton'
import { Moon, Sun } from 'lucide-react'
import axios from 'axios'

const ThemeChangeButton = () => {
  const [theme, setTheme] = useState<"light"|"dark"|undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(()=>{
    setMounted(true);
  },[])

    useEffect(() => {
      if(!mounted) return;
      const localTheme=localStorage.getItem("theme");
    if(theme==undefined){
        if(localTheme==null){
            const isDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(isDark?"dark":"light");
        }
        else{
            setTheme(localTheme as "light"|"dark");
        }
        return;
    }
    if(localTheme==theme) return;
    localStorage.setItem("theme",theme);
    document.documentElement.classList.add(theme);
    document.documentElement.classList.remove(theme=="dark"?"light":"dark");
    axios.get(`/api/set-theme?theme=${theme}`);
    },[theme,mounted]);
  return (
    <Button variant={"outline"} className="[&_svg]:size-5 px-2 text-muted-foreground hover:text-foreground dark:hover:text-primary" onClick={()=>{setTheme(theme=="light"?"dark":"light")}}>{theme==undefined? <Skeleton className="h-6 w-6 rounded-full" />:theme=="light"?<Sun size={32}/>:<Moon size={24}/>}</Button>
  )
}

export default ThemeChangeButton