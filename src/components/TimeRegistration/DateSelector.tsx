
import { useState } from 'react';
import { Label } from '../ui/label';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';

interface DateSelectorProps {
  dates: Date[];
  onDatesChange: (dates: Date[]) => void;
}

const DateSelector = ({ dates, onDatesChange }: DateSelectorProps) => {
  return (
    <div>
      <Label htmlFor="date">Vælg datoer</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              dates.length === 0 && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dates.length > 0 ? (
              `${dates.length} ${dates.length === 1 ? 'dato' : 'datoer'} valgt`
            ) : (
              <span>Vælg datoer</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="multiple"
            selected={dates}
            onSelect={onDatesChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
