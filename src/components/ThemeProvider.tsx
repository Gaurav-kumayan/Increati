"use client";
import { useEffect } from "react";
import axios from "axios";
const ThemeProvider = ({
  theme,
}: {
  theme: "dark"|"light"|undefined;
}) => {

    useEffect(() => {
        const localTheme=localStorage.getItem("theme");
        if(theme!=undefined && localTheme==theme) return;
        if(localTheme==null){
            const isDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.add(isDark?"dark":"");
            localStorage.setItem("theme",isDark?"dark":"light");
            axios.get(`/api/set-theme?theme=${isDark?"dark":"light"}`).then(res=>{}).catch(err=>{});
        }
        else{
            document.documentElement.classList.add(localTheme);
            document.documentElement.classList.remove(localTheme=="dark"?"light":"dark");
            axios.get(`/api/set-theme?theme=${localTheme}`).then(res=>{}).catch(err=>{});
        }
    },[])


  return <></>;
};

export default ThemeProvider;
