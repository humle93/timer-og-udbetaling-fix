
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Clock, Save } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface TimeRegistrationProps {
  onSave: (entry: TimeEntry) => void;
}

const TimeRegistration = ({ onSave }: TimeRegistrationProps) => {
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [rate, setRate] = useState('');
  const { toast } = useToast();

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

    const entry: TimeEntry = {
      id: Date.now(),
      date: date,
      hours: parseFloat(hours),
      rate: parseFloat(rate),
      total: parseFloat(hours) * parseFloat(rate)
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

        <Button type="submit" className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Gem Timer
        </Button>
      </form>
    </div>
  );
};

export default TimeRegistration;
