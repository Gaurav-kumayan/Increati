"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Combobox({options,title,searchText,className, value, setValue, searchEmptyMessage}: {options: Record<string, string>,title:string,searchText:string, value:string,setValue:React.Dispatch<React.SetStateAction<string>>,className?:string,searchEmptyMessage:string}) {
  const [open, setOpen] = React.useState(false);
    const optionKeys=Object.keys(options);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`flex-1 justify-between ${className}`}
        >
          {value
            ? options[value]
            : title}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchText} className="h-9" />
          <CommandList>
            <CommandEmpty>{searchEmptyMessage}</CommandEmpty>
            <CommandGroup>
              {optionKeys.map((key) => (
                <CommandItem
                  key={key}
                  value={key}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {options[key]}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === key ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
