"use client";

import { useId, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, isValid, parseISO, startOfMonth, addMonths, setMonth as setCalendarMonth, setYear } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Input } from "./input";
import { Select } from "./select";

type DatePickerProps = {
  value: string;
  onValueChange: (value: string) => void;
  "aria-label": string;
  disabled?: boolean;
  partial?: boolean;
};

export function DatePicker({ value, onValueChange, disabled, partial = false, "aria-label": label }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const inputId = useId();
  const [draft, setDraft] = useState(value);
  const parsed = parseISO(value);
  const pattern = partial ? /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/ : /^\d{4}-\d{2}-\d{2}$/;
  const valid = pattern.test(value) && isValid(parsed);
  const draftValid = !draft || (pattern.test(draft) && isValid(parseISO(draft)));
  const selected = valid && value.length === 10 ? parsed : undefined;
  const caption = valid ? format(parsed, value.length === 4 ? "yyyy" : value.length === 7 ? "MMM yyyy" : "dd MMM yyyy") : value;
  const choose = (next: string) => { onValueChange(next); setOpen(false); };
  const year = month.getFullYear();
  const years = Array.from(new Set([...Array.from({ length: new Date().getFullYear() + 21 - 1900 }, (_, i) => 1900 + i), year])).sort((a, b) => b - a);

  return <Popover open={open} onOpenChange={next => {
    if (disabled) return;
    if (next) { setMonth(startOfMonth(valid ? parsed : new Date())); setDraft(value); }
    setOpen(next);
    if (process.env.NODE_ENV === "development") console.debug("[DEBUG-RESUMEXPRESS-UI]", { control: "date-picker", open: next, partial });
  }}>
    <PopoverTrigger asChild>
      <Button type="button" variant="outline" disabled={disabled} aria-label={`${label}: ${caption || "not selected"}`} className="mt-1 h-11 w-full min-w-0 justify-between gap-3 rounded-xl bg-background/60 px-3 font-normal">
        <span className={`truncate ${value ? "" : "text-muted-foreground"}`}>{caption || (partial ? "Select month, year or date" : "Select date")}</span>
        <CalendarDays size={16} className="shrink-0 text-muted-foreground" aria-hidden="true"/>
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" className="w-[300px] max-w-[calc(100vw-2rem)] rounded-xl p-3" aria-label={`Choose ${label.toLowerCase()}`}>
      <div className="mb-3 flex items-center gap-1">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Previous month" onClick={() => setMonth(addMonths(month, -1))}><ChevronLeft size={16}/></Button>
        <Select aria-label="Month" className="min-h-8 flex-1 border-0 px-2 py-1 text-xs" value={String(month.getMonth())} onValueChange={value => setMonth(setCalendarMonth(month, Number(value)))} options={Array.from({ length: 12 }, (_, i) => ({ value: String(i), label: format(new Date(2020, i, 1), "MMMM") }))}/>
        <Select aria-label="Year" className="min-h-8 w-20 border-0 px-2 py-1 text-xs" value={String(year)} onValueChange={value => setMonth(setYear(month, Number(value)))} options={years.map(value => ({ value: String(value), label: String(value) }))}/>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Next month" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight size={16}/></Button>
      </div>
      <DayPicker mode="single" month={month} onMonthChange={setMonth} selected={selected} onSelect={date => date && choose(format(date, "yyyy-MM-dd"))} hideNavigation showOutsideDays fixedWeeks classNames={{
        root: "rx-calendar", months: "w-full", month: "w-full", month_caption: "sr-only", month_grid: "w-full border-collapse", weekdays: "", weekday: "pb-2 text-center text-[11px] font-normal text-muted-foreground", week: "", day: "p-0.5 text-center", day_button: "mx-auto grid h-8 w-8 place-items-center rounded-md text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", selected: "[&>button]:!bg-primary [&>button]:!text-primary-foreground", today: "font-bold underline underline-offset-4", outside: "text-muted-foreground/50", disabled: "opacity-40", hidden: "invisible",
      }}/>
      {partial && <div className="mt-2 grid grid-cols-2 gap-2 border-t pt-2"><Button type="button" variant="secondary" size="sm" className="text-xs" onClick={() => choose(format(month, "yyyy-MM"))}>Use {format(month, "MMM yyyy")}</Button><Button type="button" variant="secondary" size="sm" className="text-xs" onClick={() => choose(format(month, "yyyy"))}>Year only</Button></div>}
      <div className="mt-3 border-t pt-3"><label htmlFor={inputId} className="text-[11px] text-muted-foreground">{partial ? "Or type YYYY, YYYY-MM or YYYY-MM-DD" : "Or type YYYY-MM-DD"}</label><Input id={inputId} className="mt-1 h-9 text-xs" value={draft} maxLength={10} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); if (draftValid) choose(draft); } }} aria-invalid={!draftValid}/>{!draftValid && <p className="mt-1 text-xs text-red-300">Enter a valid {partial ? "year, month or date" : "date"} in the format above.</p>}</div>
      <div className="mt-2 flex justify-between"><Button type="button" size="sm" variant="ghost" disabled={!value} onClick={() => choose("")}>Clear</Button><Button type="button" size="sm" variant="ghost" onClick={() => choose(format(new Date(), "yyyy-MM-dd"))}>Today</Button><Button type="button" size="sm" variant="ghost" disabled={!draftValid} onClick={() => choose(draft)}>Done</Button></div>
    </PopoverContent>
  </Popover>;
}
