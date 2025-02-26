import React, { SetStateAction } from 'react'
import { Button } from './button'
import { Skeleton } from './skeleton'
import { Moon, Sun } from 'lucide-react'

const ThemeChangeButton = ({theme,setTheme}:{theme:"light"|"dark"|undefined,setTheme: React.Dispatch<SetStateAction<"light" | "dark" | undefined>>}) => {
  return (
    <Button variant={"outline"} className="[&_svg]:size-5 px-2 text-muted-foreground hover:text-foreground dark:hover:text-primary" onClick={()=>{setTheme(theme=="light"?"dark":"light")}}>{theme==undefined? <Skeleton className="h-6 w-6 rounded-full" />:theme=="light"?<Sun size={32}/>:<Moon size={24}/>}</Button>
  )
}

export default ThemeChangeButton