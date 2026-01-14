"use client";
import { Search, X, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FiltersBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const CATEGORIES = ["All Pilots", "Core", "Growth", "Defensive"];

export function FiltersBar({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  setShowFilters,
}: FiltersBarProps) {
  const handleClearFilters = () => {
    setSelectedCategory("All Pilots");
    setSearchQuery("");
    setShowFilters(false);
  };

  const hasActiveFilters =
    selectedCategory !== "All Pilots" || searchQuery !== "";

  return (
    <div className="border-gray-800 pb-4 pt-6 md:pb-6 md:pt-10 md:px-0">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-white/10 border-white/10 text-gray-300 hover:bg-white/5">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              {CATEGORIES.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-gray-300 focus:bg-white/5 focus:border focus:border-white/10  focus:text-[#0b84ba]"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search name or paste address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border-white/10 text-gray-300 placeholder:text-gray-500 rounded text-sm w-80 focus:ring-1 focus:ring-white/10 "
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        {/* Search Bar - Full Width on Mobile */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="Search pilots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-2.5 bg-white/5 border-white/10 text-gray-300 placeholder:text-gray-500 rounded text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="flex-1 bg-white/5 border-white/10 text-gray-300 hover:bg-[#252633] focus:ring-blue-500 h-10">
              <div className="flex items-center gap-2 w-full">
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              {CATEGORIES.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-gray-300 focus:bg-white/5 rounded focus:border focus:border-white/10 focus:text-[#0b84ba] hover:text-white hover:bg-white/10"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-[#0b84ba] border border-white/10 hover:bg-white/5 transition-all duration-300 rounded text-sm px-3 h-9 font-normal whitespace-nowrap"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters on Mobile */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-800">
            <span className="text-xs text-gray-400">Filters:</span>
            {selectedCategory !== "All Pilots" && (
              <span className="px-2 py-1 bg-blue-900/30 border border-blue-700/50 text-blue-300 rounded-full text-xs font-medium flex items-center gap-1">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("All Pilots")}
                  className="hover:text-blue-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-1 bg-purple-900/30 border border-purple-700/50 text-purple-300 rounded-full text-xs font-medium flex items-center gap-1">
                Search
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-purple-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
