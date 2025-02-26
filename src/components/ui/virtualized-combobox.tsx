import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Option, Options } from '@/types/Option';

interface VirtualItem extends Option {
  isHeader?: boolean;
  groupLabel?: string;
}

interface InlineProps {
  isInline: boolean;
  shouldShowList: boolean;
  searchValue: string;
  searchKeyEvent: React.KeyboardEvent | null;
}

interface VirtualizedCommandProps {
  height: string;
  options: Options;
  placeholder: string;
  selectedOption: string;
  onSelectOption?: (option: string) => void;
  filterOptions: (options: Options, searchWords: string[]) => Option[];
  inlineProps?: InlineProps;
}

interface VirtualizedComboboxProps {
  options: Options;
  searchPlaceholder: string;
  title: string;
  width?: string;
  height?: string;
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  filterOptions: (options: Options, searchWords: string[]) => Option[];
}

export const VirtualizedCommand: React.FC<VirtualizedCommandProps> = ({
  height,
  options,
  placeholder,
  selectedOption,
  onSelectOption,
  filterOptions,
  inlineProps = {
    isInline: false,
    shouldShowList: true,
    searchValue: "",
    searchKeyEvent: null
  }
}: VirtualizedCommandProps) => {
  // Transform options into a flat array with headers
  const getFlattenedOptions = (filteredOpts: Option[]): VirtualItem[] => {
    const result: VirtualItem[] = [];
    
    // Keep track of seen options to handle duplicates
    const seenValues = new Set<string>();
    
    // Process filtered options in their original order
    filteredOpts.forEach((opt) => {
      // Check if it's an ungrouped option
      const isUngrouped = options.ungrouped.some(ungrouped => ungrouped.value === opt.value);
      
      if (isUngrouped && !seenValues.has(opt.value)) {
        result.push(opt);
        seenValues.add(opt.value);
      }
    });
  
    // For grouped options, we need to preserve group structure while maintaining order
    options.groups.forEach((group) => {
      const groupOptions = filteredOpts.filter(opt => 
        group.options.some(groupOpt => groupOpt.value === opt.value) &&
        !seenValues.has(opt.value)
      );
      
      if (groupOptions.length > 0) {
        // Add group header
        result.push({
          value: `header-${group.label}`,
          label: group.label,
          isHeader: true,
          groupLabel: group.label
        });
        
        // Add group options in the order they appeared in filteredOpts
        groupOptions.forEach(opt => {
          result.push(opt);
          seenValues.add(opt.value);
        });
      }
    });
  
    return result;
  };

  const [filteredOptions, setFilteredOptions] = React.useState<Option[]>([
    ...options.ungrouped,
    ...options.groups.flatMap(group => group.options)
  ]);
  
  const [virtualItems, setVirtualItems] = React.useState<VirtualItem[]>(
    getFlattenedOptions(filteredOptions)
  );
  
  const [focusedIndex, setFocusedIndex] = React.useState<number>(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = React.useState<boolean>(false);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index: number) => virtualItems[index]?.isHeader ? 25 : 35,
  });

  const handleSearch = (search: string) => {
    setIsKeyboardNavActive(false);
  
    if (!search.trim()) {
      // Keep original order for unfiltered results
      setFilteredOptions([
        ...options.ungrouped,
        ...options.groups.flatMap(group => group.options)
      ]);
      setVirtualItems(getFlattenedOptions([
        ...options.ungrouped,
        ...options.groups.flatMap(group => group.options)
      ]));
      return;
    }
  
    const searchWords = search.toLowerCase().trim().split(/\s+/);
    const filtered = filterOptions(options, searchWords);
  
    setFilteredOptions(filtered);
    setVirtualItems(getFlattenedOptions(filtered));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          let newIndex = prev + 1;
          // Skip headers when navigating
          while (newIndex < virtualItems.length && virtualItems[newIndex].isHeader) {
            newIndex++;
          }
          // Stop at last item instead of cycling
          if (newIndex >= virtualItems.length) {
            newIndex = virtualItems.length - 1;
            // Find last non-header item
            while (newIndex >= 0 && virtualItems[newIndex].isHeader) {
              newIndex--;
            }
          }
          virtualizer.scrollToIndex(newIndex, { align: 'center' });
          return newIndex;
        });
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          let newIndex = prev - 1;
          // Skip headers when navigating
          while (newIndex >= 0 && virtualItems[newIndex].isHeader) {
            newIndex--;
          }
          // Stop at first item instead of cycling
          if (newIndex < 0) {
            newIndex = 0;
            // Find first non-header item
            while (newIndex < virtualItems.length && virtualItems[newIndex].isHeader) {
              newIndex++;
            }
          }
          virtualizer.scrollToIndex(newIndex, { align: 'center' });
          return newIndex;
        });
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (virtualItems[focusedIndex] && !virtualItems[focusedIndex].isHeader) {
          onSelectOption?.(virtualItems[focusedIndex].value);
        }
        break;
      }
      default:
        break;
    }
  };

  React.useEffect(() => {
    if (inlineProps.searchKeyEvent === null) return;
    handleKeyDown(inlineProps.searchKeyEvent);
  }, [inlineProps.searchKeyEvent]);

  React.useEffect(() => {
    if (selectedOption) {
      const index = virtualItems.findIndex(item => item.value === selectedOption);
      if (index !== -1) {
        setFocusedIndex(index);
        virtualizer.scrollToIndex(index, { align: 'center' });
      }
    }
  }, [selectedOption, virtualItems]);

  React.useEffect(() => {
    handleSearch(inlineProps.searchValue);
  }, [inlineProps.searchValue]);

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown} className={inlineProps.isInline? "w-full mt-2" : ""}>
      {!inlineProps.isInline && (
        <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      )}
      <div className={inlineProps.isInline && !inlineProps.shouldShowList ? "hidden" : ""}>
        <CommandList
          ref={parentRef}
          className="min-w-max"
          style={{
            height: height,
            overflow: 'auto',
          }}
          onMouseDown={() => setIsKeyboardNavActive(false)}
          onMouseMove={() => setIsKeyboardNavActive(false)}
        >
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const item = virtualItems[virtualRow.index];
                if (!item) return null;

                if (item.isHeader) {
                  return (
                    <div
                      key={item.value}
                      className="px-2 py-1.5 text-sm font-medium text-muted-foreground"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {item.label}
                    </div>
                  );
                }

                return (
                  <CommandItem
                    key={item.value}
                    className={cn(
                      'absolute left-0 top-0 w-full flex justify-between',
                      focusedIndex === virtualRow.index ? '!bg-primary !text-foreground dark:!text-primary-foreground':'!bg-popover !text-popover-foreground',
                    )}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    value={item.value}
                    onMouseEnter={() => !isKeyboardNavActive && setFocusedIndex(virtualRow.index)}
                    onMouseLeave={() => !isKeyboardNavActive && setFocusedIndex(-1)}
                    onSelect={onSelectOption}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedOption === item.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                );
              })}
            </div>
          </CommandGroup>
        </CommandList>
      </div>
    </Command>
  );
};

export function VirtualizedCombobox({
  options,
  searchPlaceholder,
  selectedOption,
  setSelectedOption,
  title,
  className,
  height = '300px',
  filterOptions
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const getSelectedLabel = () => {
    const ungroupedOption = options.ungrouped.find((opt: Option) => opt.value === selectedOption);
    if (ungroupedOption) return ungroupedOption.label;

    for (const group of options.groups) {
      const groupOption = group.options.find((opt: Option) => opt.value === selectedOption);
      if (groupOption) return groupOption.label;
    }

    return title;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-between flex-1 ${className}`}
        >
          {getSelectedLabel()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: '100%' }}>
        <VirtualizedCommand
          height={height}
          options={options}
          placeholder={searchPlaceholder}
          selectedOption={selectedOption}
          onSelectOption={(currentValue) => {
            setSelectedOption(currentValue === selectedOption ? '' : currentValue);
            setOpen(false);
          }}
          filterOptions={filterOptions}
        />
      </PopoverContent>
    </Popover>
  );
}