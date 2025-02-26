"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SelectScrollable } from "./ui/select-scrollable"
import { Niche, NicheCategory } from "@/types/Niche";
import { createRef, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Country } from "@/types/Country";
import { VirtualizedCombobox, VirtualizedCommand } from "./ui/virtualized-combobox";
import axios from "axios";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Loader2, X } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { FaPlay } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Option, Options, RankedOption } from "@/types/Option";

interface RegisterFormProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  nicheCategories: NicheCategory[];
  niches: Niche[];
  countries:Country[];
}

export function RegisterForm({
  nicheCategories,
  niches,
  className,
  countries,
  ...props
}: RegisterFormProps) {
  const router=useRouter();
  const countryOptions=countries.sort((a,b)=>a.name.localeCompare(b.name)).map((country)=>({value:country.country_code,label:country.name}));
  const nicheGroup:Options={ungrouped:[],groups:nicheCategories.sort((a,b)=>a.name.localeCompare(b.name)).map((category)=>({label:category.name,options:niches.filter((niche)=>niche.category==category.id).sort((a,b)=>a.name.localeCompare(b.name)).map((niche)=>({value:niche.id.toString(),label:niche.name}))}))};
  const nicheMap:{[key:number]:string}=niches.reduce((acc,cur)=>({...acc,[cur.id]:cur.name}),{});
  const [showNiches, setShowNiches] = useState(false);
  const nicheSearchInputRef=createRef<HTMLInputElement>();
  const scrollableNicheBadges=createRef<HTMLInputElement>();
  const [nicheSearchValue, setNicheSearchValue] = useState("");
  const [nicheSearchBlurring, setNicheSearchBlurring] = useState(false);
  const [nicheSearchKeyEvent,setNicheSearchKeyEvent]=useState<React.KeyboardEvent<HTMLInputElement>|null>(null);
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState<{type:boolean, for:"pincode"|"country"|null,message:string}>({type:false,for:null,message:""});
  const [locatalityMessage, setLocatalityMessage] = useState("");
  const [localities,setLocalities]=useState<{value:number,label:string}[]>([]);
  const [validNiche, setValidNiche] = useState(true);
  const [isSearchingLocalities, setIsSearchingLocalities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pincodeChangedAfterFocus, setPincodeChangedAfterFocus] = useState(true);
  const [formData,setFormData]=useState<{selectedNiches:number[],address:string,locality:number}>({selectedNiches:[],address:"",locality:0});

  const searchLocalities=()=>{
    if(!pincodeChangedAfterFocus) return;
    setPincodeChangedAfterFocus(false);
    setLocalities([]);
    if(pincode!="" && country!=""){
      setIsSearchingLocalities(true);
      axios.get(`/api/get-localities?country_code=${country}&pincode=${pincode}`).then((res)=>{
        if(res.status===200){
          setLocalities(res.data.localities.sort((a:{id:number,name:string}, b:{id:number,name:string}) => a.name.localeCompare(b.name)).map((locality:{id:number,name:string})=>({value:locality.id,label:locality.name})));
          if(res.data.localities.length==0){
            setPincodeMessage({type:false, for:"pincode",message:"No localities found for this pincode"});
          }else{
            setPincodeMessage({type:true,for:null,message:`${res.data.city_name}, ${res.data.district_name}, ${res.data.state_name}`});
          }
        }
      })
      .catch((error)=>{
        if(error.response.status==404){
          setPincodeMessage({type:false,for:"pincode",message:"No localities found for this pincode"});
        }
        else{
          setPincodeMessage({type:false,for:"pincode",message:"Couldn't Fetch Localities"});
        }
      }).finally(()=>{
        setIsSearchingLocalities(false);
      });
    }
  }

  useEffect(()=>{
    setPincode("");
    setFormData({...formData,locality:0});
    setLocalities([]);
    setPincodeMessage({type:false,for:null,message:""});
  },[country]);
  useEffect(()=>{
    setPincodeMessage({type:false,for:null,message:""});
    setLocatalityMessage("");
    setLocalities([]); 
    setFormData({...formData,locality:0})
    setPincodeChangedAfterFocus(true);
  },[pincode]);
  useEffect(()=>{
    if(formData.locality!=0){
      setLocatalityMessage("");
    }
  },[formData.locality]);

  function handleRegister(event:React.FormEvent){
    event.preventDefault();
    let shouldSubmit:boolean=true;
    if(country==""){
      setPincodeMessage({type:false,for:"country",message:"Please select a country, then a pincode and locality"});
      shouldSubmit=false;
    }
    else if(pincode==""){
      setPincodeMessage({type:false,for:"pincode",message:"Please enter a pincode, and then a locality"});
      shouldSubmit=false;
    }
    else if(formData.locality==0){
      setLocatalityMessage("Please select a locality");
      shouldSubmit=false;
    }
    if(formData.selectedNiches.length==0){
      setValidNiche(false);
      shouldSubmit=false;
    }
    if(!shouldSubmit)
      return;
    
    setIsSubmitting(true);
    axios.post("/api/register",formData).then((res)=>{
      if(res.status==200){
        toast.success("You're Ready to Go! 🎉", {
          description: "Your details have been recorded successfully.",
          closeButton:false,
          duration:5000,
          position:"top-center",
          richColors:true,
          invert:true,
          dismissible:false,
        });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    }
    ).catch((error)=>{
      console.log(error);
      toast.error("Oops! Something went wrong", {
        closeButton:true,
        position:"top-center",
        richColors:true,
        invert:true,
      });
    }).finally(()=>{
      setIsSubmitting(false);
    });
  }

  function filterByMatchingWordsRanked(options: Options, searchWords: string[]): Option[] {
  // Helper function to rank a single option
  const rankOption = (option: Option): RankedOption | null => {
    const valueLower = option.label.toLowerCase();
    const words = valueLower.split(/\s+/);
    
    let rank = 0;
    const matchPositions: number[] = [];
    
    for (let i = 0; i < searchWords.length; i++) {
      const searchWord = searchWords[i];
      
      const index = words.findIndex(
        (word) => word.startsWith(searchWord)
      );
      
      if (index !== -1) {
        matchPositions.push(index);
        rank += 5 - i;
      }
    }
    
    if (matchPositions.length === searchWords.length) {
      return { ...option, rank, matchPositions };
    }
    return null;
  };

  // Process ungrouped options
  const rankedUngrouped = options.ungrouped
    .map(rankOption)
    .filter((option): option is RankedOption => option !== null);

  // Process grouped options
  const rankedGrouped = options.groups
    .flatMap(group => group.options)
    .map(rankOption)
    .filter((option): option is RankedOption => option !== null);

  // Combine and sort all ranked options
  return [...rankedUngrouped, ...rankedGrouped]
    .sort((a, b) => {
      const firstMatchA = a.matchPositions[0] ?? Infinity;
      const firstMatchB = b.matchPositions[0] ?? Infinity;
      if (firstMatchA !== firstMatchB) return firstMatchA - firstMatchB;
      
      return b.rank - a.rank;
    })
    .map(({ value, label }) => ({ value, label }));
}

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Let&apos;s Get Started</CardTitle>
          <CardDescription>
            Please fill in the required details to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid gap-4">
              <div className="grid gap-4">
                <div onClick={(e)=>{
                  if ((e.target as HTMLElement).closest(".no-focus")) {
                    e.preventDefault();
                    return;
                  }
                  nicheSearchInputRef.current?.focus();
                }} className={`border h-auto shadow-sm rounded-md cursor-text flex flex-col px-2 py-1 ${!validNiche ? "border border-destructive" : ""}`}>
                  <div className="flex flex-col justify-end">

                  <ScrollArea ref={scrollableNicheBadges} className={`max-h-32 h-full min-h-0 w-full rounded-t-md`}>
                    {
                        formData.selectedNiches.map((niche) => (
                          <Badge key={niche} className="mx-1 pr-1 my-1 no-focus">
                            <span className="flex gap-1 items-center">
                              {nicheMap[niche]}
                              <X className="w-4 h-4 cursor-pointer" onClick={() => {
                                setFormData({ ...formData, selectedNiches: formData.selectedNiches.filter((n) => n != niche) });
                              }} />
                            </span>
                          </Badge>
                        ))
                      }
                  </ScrollArea>
                  <div className="relative w-full">
                      <input type="text" id="nicheSearch" ref={nicheSearchInputRef} placeholder={formData.selectedNiches.length==0?"Add your niches (atleast one)":"Add more niches"} value={nicheSearchValue} className={`ps-1 my-1 max-w-full w-min bg-transparent outline-none text-sm ${!validNiche ? "placeholder-destructive" : "placeholder-muted-foreground"}`} onInput={(event)=>{setNicheSearchValue(event.currentTarget.value)}} onFocus={()=>{if(!nicheSearchBlurring){setShowNiches(true)}else{nicheSearchInputRef.current?.blur();} }} onBlur={()=>{setNicheSearchBlurring(true);setTimeout(()=>{setShowNiches(false);setNicheSearchBlurring(false)},200)}}
                      onKeyDown={(event)=>{setNicheSearchKeyEvent(event);}}
                      onKeyUp={()=>{setNicheSearchKeyEvent(null);}}
                      />

                  {/* Ensure this is positioned absolutely */}
                  <div className="absolute top-full left-0 w-full z-50">
                    <VirtualizedCommand inlineProps={{isInline:true,shouldShowList:showNiches,searchValue:nicheSearchValue,searchKeyEvent:nicheSearchKeyEvent}} options={nicheGroup} filterOptions={filterByMatchingWordsRanked} selectedOption={"0"} height="300px" placeholder={`Add your niches ${formData.selectedNiches.length>0?"(At least one)":""}`} onSelectOption={(option)=>{
                      const selectedOption=parseInt(option);
                      if(!formData.selectedNiches.includes(selectedOption))
                      setFormData({...formData,selectedNiches:[...formData.selectedNiches,selectedOption]});
                      else{
                        toast.info("Niche Already Added", {
                          closeButton:true,
                          position:"top-center",
                          richColors:true,
                          invert:true,
                          duration:4000,
                          dismissible:true,
                        });
                      }
                      setValidNiche(true);
                      setNicheSearchValue("");
                      nicheSearchInputRef.current?.blur();
                      if(scrollableNicheBadges.current){
                        const scrollDiv=scrollableNicheBadges.current.querySelector("[data-radix-scroll-area-viewport]");
                        console.log(scrollDiv);
                        if(scrollDiv)
                          setTimeout(()=>{scrollDiv.scrollTop=scrollDiv.scrollHeight;},100);
                      }
                    }} />
                  </div>
                </div>
                </div>

                </div>
                <div className="grid gap-4">
                  <Input type="text" placeholder="Address (Optional)" value={formData.address} onInput={(event)=>{setFormData({...formData,address:event.currentTarget.value})}} />
                  <div className="flex flex-col gap-1">
                  <div className="flex">
                    <VirtualizedCombobox options={{ungrouped:countryOptions,groups:[]}} filterOptions={filterByMatchingWordsRanked} title={"Select Country"} searchPlaceholder="Search Country" className={`rounded-r-none border-r-0 ${pincodeMessage.for=="country"?"border-destructive":""}`} selectedOption={country} setSelectedOption={setCountry} />
                  {/* <Combobox searchText="Search Countries..." title={"Select Country"} searchEmptyMessage={"Not Available"} value={country} setValue={setCountry} options={countryOptions} className={"rounded-r-none border-r-0"} /> */}
                  <Input type="text" placeholder="Pincode" className={`rounded-l-none ${!pincodeMessage.type && pincodeMessage.for=="pincode"?"border-destructive":""}`} disabled={country===""} value={pincode} onInput={(event)=>{setPincode(event.currentTarget.value);}} onBlur={searchLocalities} />
                  </div>
                  {
                    isSearchingLocalities && <Skeleton className="h-4 w-full rounded-md" />
                  }
                  {
                    pincodeMessage.message!="" && <span className={`text-[0.8rem] font-medium ${pincodeMessage.type? "text-foreground dark:text-primary":"text-destructive"}`}>{pincodeMessage.message}</span>
                  }
                  </div>
                  <div className="flex flex-col gap-1">
                  <SelectScrollable title={"Select Locality"} options={localities} value={formData.locality==0?"":formData.locality.toString()} className={`w-full ${locatalityMessage!=""?"border-destructive":""}`} onValueChange={(value)=>{setFormData({...formData,locality:parseInt(value)})}} />
                  {
                    locatalityMessage!="" && <span className={`text-[0.8rem] font-medium text-destructive`}>{locatalityMessage}</span>
                  }
                  </div>
                </div>
                <Button type="submit" className={`w-full ${isSubmitting?"[&_svg]:size-5":"[&_svg]:size-3"}`} disabled={isSubmitting}>
                  {isSubmitting? <Loader2 className="w-5 h-5 animate-spin" />:<span className="flex items-center gap-2"><span>Continue</span><FaPlay/></span>}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
