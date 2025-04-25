import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { Checkbox } from './ui/checkbox';
import { TimeEntry } from '../types/TimeEntry';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TimeRegistrationProps {
  onSave: (entry: TimeEntry) => void;
}

const TimeRegistration = ({ onSave }: TimeRegistrationProps) => {
  const [dates, setDates] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [rate, setRate] = useState('');
  const [mealAllowance, setMealAllowance] = useState(false);
  const { toast } = useToast();

  const calculateHours = (start: string, end: string): number => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    let hours = endHour - startHour;
    let minutes = endMinute - startMinute;
    
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }
    
    return Number((hours + minutes / 60).toFixed(2));
  };

  const calculateMealAllowance = (hours: number) => {
    // 2024 satser for skattefri kostpenge
    const fullDayRate = 555; // DKK per døgn
    
    if (hours >= 24) {
      return fullDayRate;
    } else if (hours >= 11) {
      return fullDayRate * 0.75; // 75% for 11+ timer
    } else if (hours >= 5) {
      return fullDayRate * 0.5; // 50% for 5-11 timer
    }
    return 0;
  };

  const calculateTaxAmounts = (totalAmount: number, mealAllowanceAmount: number) => {
    // Danish tax rules for 2024
    const taxFreeAmount = mealAllowanceAmount; // Meal allowance is tax-free
    const taxableAmount = totalAmount; // Regular salary is taxable
    
    return {
      taxFreeAmount,
      taxableAmount
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (dates.length === 0 || !startTime || !endTime || !rate) {
      toast({
        title: "Fejl",
        description: "Udfyld venligst alle felter",
        variant: "destructive"
      });
      return;
    }

    const hoursNum = calculateHours(startTime, endTime);
    const rateNum = parseFloat(rate);
    const total = hoursNum * rateNum * dates.length;
    const mealAllowanceAmount = mealAllowance ? calculateMealAllowance(hoursNum) * dates.length : 0;
    const { taxableAmount, taxFreeAmount } = calculateTaxAmounts(total, mealAllowanceAmount);

    const entry: TimeEntry = {
      id: Date.now(),
      dates: dates.map(date => format(date, 'yyyy-MM-dd')),
      startTime,
      endTime,
      hours: hoursNum,
      rate: rateNum,
      total,
      mealAllowance,
      mealAllowanceAmount,
      taxableAmount,
      taxFreeAmount
    };

    onSave(entry);
    toast({
      title: "Succes",
      description: `Timer registreret for ${dates.length} ${dates.length === 1 ? 'dag' : 'dage'}`,
    });

    // Reset form
    setDates([]);
    setStartTime('');
    setEndTime('');
    setRate('');
    setMealAllowance(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-sky-600" />
        <h2 className="text-xl font-semibold text-gray-800">Registrer Timer</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
                <Calendar className="mr-2 h-4 w-4" />
                {dates.length > 0 ? (
                  `${dates.length} ${dates.length === 1 ? 'dato' : 'datoer'} valgt`
                ) : (
                  <span>Vælg datoer</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="multiple"
                selected={dates}
                onSelect={setDates}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Fra tidspunkt</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="endTime">Til tidspunkt</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="rate">Timeløn (DKK)</Label>
          <Input
            id="rate"
            type="number"
            step="0.01"
            placeholder="Timeløn"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="mealAllowance" 
            checked={mealAllowance}
            onCheckedChange={(checked) => setMealAllowance(checked as boolean)}
          />
          <Label htmlFor="mealAllowance" className="text-sm">
            Tilføj skattefri kostpenge (555 kr. pr. døgn i 2024)
          </Label>
        </div>

        <Button type="submit" className="w-full">
          Gem Timer
        </Button>
      </form>

      {mealAllowance && (
        <div className="mt-4 p-4 bg-sky-50 rounded-md">
          <h3 className="font-medium mb-2">Kostpenge satser 2024:</h3>
          <ul className="text-sm space-y-1">
            <li>• 5-11 timer: 277,50 kr. (50%)</li>
            <li>• 11-24 timer: 416,25 kr. (75%)</li>
            <li>• Over 24 timer: 555 kr. (100%)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimeRegistration;
