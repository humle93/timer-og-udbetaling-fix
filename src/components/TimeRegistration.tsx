
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Clock, Save } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { Checkbox } from './ui/checkbox';
import { TimeEntry } from '../types/TimeEntry';

interface TimeRegistrationProps {
  onSave: (entry: TimeEntry) => void;
}

const TimeRegistration = ({ onSave }: TimeRegistrationProps) => {
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [rate, setRate] = useState('');
  const [mealAllowance, setMealAllowance] = useState(false);
  const { toast } = useToast();

  const calculateMealAllowance = (hours: number) => {
    // 2023 satser: 539 kr. per døgn for kost
    const fullDayRate = 539;
    if (hours >= 24) {
      return fullDayRate;
    } else if (hours >= 11) {
      return fullDayRate * 0.75; // 75% for 11+ timer
    } else if (hours >= 5) {
      return fullDayRate * 0.5; // 50% for 5-11 timer
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !hours || !rate) {
      toast({
        title: "Fejl",
        description: "Udfyld venligst alle felter",
        variant: "destructive"
      });
      return;
    }

    const hoursNum = parseFloat(hours);
    const rateNum = parseFloat(rate);
    const mealAllowanceAmount = mealAllowance ? calculateMealAllowance(hoursNum) : 0;

    const entry: TimeEntry = {
      id: Date.now(),
      date: date,
      hours: hoursNum,
      rate: rateNum,
      total: hoursNum * rateNum,
      mealAllowance: mealAllowance,
      mealAllowanceAmount: mealAllowanceAmount
    };

    onSave(entry);
    toast({
      title: "Succes",
      description: "Timer registreret",
    });

    // Reset form
    setDate('');
    setHours('');
    setRate('');
    setMealAllowance(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-sky-600" />
        <h2 className="text-xl font-semibold text-gray-800">Registrer Timer</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date">Dato</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="hours">Timer</Label>
          <Input
            id="hours"
            type="number"
            step="0.5"
            placeholder="Antal timer"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
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
          <Label htmlFor="mealAllowance">Tilføj skattefri kostpenge</Label>
        </div>

        <Button type="submit" className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Gem Timer
        </Button>
      </form>
    </div>
  );
};

export default TimeRegistration;
