"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { X, Search } from "lucide-react"; // Import search icon

const SearchBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current) return;

      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const clearSearch = () => {
    inputRef.current?.focus(); // Keeps focus after clearing
    setSearchValue("");
  };

  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor="main_search" className="sr-only">
        Search
      </label>

      {/* Search Icon (Left Side) */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

      <Input
        ref={inputRef}
        id="main_search"
        type="search"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        className={`h-9 rounded-md border border-input pl-9 pr-9 text-sm bg-secondary 
          focus:border-foreground dark:focus:border-primary focus:bg-background focus:outline-none
          ${isSearchFocused ? "w-full" : "sm:w-[280px]"} transition-all duration-300 ease-in-out`}
      />

      {/* Clear (X) Button (Right Side) */}
      {searchValue && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 focus:outline-none"
          onClick={clearSearch}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
