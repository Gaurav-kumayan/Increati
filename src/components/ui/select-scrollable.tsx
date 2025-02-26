import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectScrollable({title,options,onValueChange,value,className}: {title:string,options: {value:string|number,label:string}[],onValueChange?:(value:string)=>void,value?:string,className?:string}) {
  return (
    <Select disabled={Object.keys(options).length === 0} value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        {
            options.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                </SelectItem>
            ))
        }
      </SelectContent>
    </Select>
  )
}
