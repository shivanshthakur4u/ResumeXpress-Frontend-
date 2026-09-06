"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "./dropdown-menu";

type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function Select({ value, onValueChange, options, className, ...props }: SelectProps) {
  const selected = options.find(option => option.value === value);
  return <DropdownMenu onOpenChange={open => {
    if (process.env.NODE_ENV === "development") console.debug("[DEBUG-RESUMEXPRESS-UI]", { control: "select", open, optionCount: options.length });
  }}>
    <DropdownMenuTrigger {...props} type="button" className={cn("rx-select group flex min-h-11 min-w-0 items-center justify-between gap-3 rounded-xl border border-input bg-background/60 px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50", className)}>
      <span className="min-w-0 flex-1 truncate">{selected?.label ?? "Choose an option"}</span>
      <ChevronDown size={16} aria-hidden="true" className="shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"/>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" sideOffset={6} className="rx-select-menu max-h-[min(20rem,var(--radix-dropdown-menu-content-available-height))] w-[var(--radix-dropdown-menu-trigger-width)] min-w-40 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border-border bg-popover p-1.5 shadow-xl">
      <DropdownMenuRadioGroup value={value} onValueChange={onValueChange} aria-label={props["aria-label"]} className="space-y-1">
        {options.map(option => <DropdownMenuRadioItem key={option.value} value={option.value} disabled={option.disabled} textValue={option.label} className="min-h-9 cursor-pointer rounded-md py-2 pr-3 leading-5 focus:bg-muted focus:text-foreground data-[state=checked]:font-medium data-[state=checked]:text-primary">
          <span className="break-words">{option.label}</span>
        </DropdownMenuRadioItem>)}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>;
}
