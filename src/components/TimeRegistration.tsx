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
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface TimeRegistrationProps {
  onSave: (entry: TimeEntry) => void;
}

const TimeRegistration = ({ onSave }: TimeRegistrationProps) => {
  const [dates, setDates] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [rate, setRate] = useState('');
  const [mealAllowance, setMealAllowance] = useState(false);
  const [mealAllowanceType, setMealAllowanceType] = useState<'with_allowance' | 'without_allowance'>('with_allowance');
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
    const fullDayRate = mealAllowanceType === 'with_allowance' ? 569 : 96;
    
    if (hours >= 24) {
      return fullDayRate;
    } else if (hours >= 11) {
      return fullDayRate * 0.75;
    } else if (hours >= 5) {
      return fullDayRate * 0.5;
    }
    return 0;
  };

  const calculateTaxAmounts = (totalAmount: number, mealAllowanceAmount: number) => {
    const taxableAmount = totalAmount;
    const taxFreeAmount = mealAllowanceAmount;
    
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
      mealAllowanceType,
      mealAllowanceAmount,
      taxableAmount,
      taxFreeAmount
    };

    onSave(entry);
    toast({
      title: "Succes",
      description: `Timer registreret for ${dates.length} ${dates.length === 1 ? 'dag' : 'dage'}`,
    });

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

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="mealAllowance" 
              checked={mealAllowance}
              onCheckedChange={(checked) => setMealAllowance(checked as boolean)}
            />
            <Label htmlFor="mealAllowance" className="text-sm">
              Tilføj skattefri kostpenge
            </Label>
          </div>

          {mealAllowance && (
            <div className="space-y-3">
              <Label>Vælg kostpenge type</Label>
              <RadioGroup 
                value={mealAllowanceType} 
                onValueChange={(value: 'with_allowance' | 'without_allowance') => setMealAllowanceType(value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="with_allowance" id="with_allowance" />
                  <Label htmlFor="with_allowance">Med diæt (569 kr. pr. døgn)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="without_allowance" id="without_allowance" />
                  <Label htmlFor="without_allowance">Uden diæt (96 kr. pr. døgn)</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">
          Gem Timer
        </Button>
      </form>

      {mealAllowance && (
        <div className="mt-4 p-4 bg-sky-50 rounded-md">
          <h3 className="font-medium mb-2">Kostpenge satser 2025 ({mealAllowanceType === 'with_allowance' ? 'med' : 'uden'} diæt):</h3>
          <ul className="text-sm space-y-1">
            <li>• 5-11 timer: {mealAllowanceType === 'with_allowance' ? '284,50' : '48'} kr. (50%)</li>
            <li>• 11-24 timer: {mealAllowanceType === 'with_allowance' ? '426,75' : '72'} kr. (75%)</li>
            <li>• Over 24 timer: {mealAllowanceType === 'with_allowance' ? '569' : '96'} kr. (100%)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimeRegistration;
