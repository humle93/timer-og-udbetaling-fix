
import { useState } from 'react';
import { Button } from '../ui/button';
import { Calendar } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { TimeEntry } from '../../types/TimeEntry';
import { format } from 'date-fns';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import RateInput from './RateInput';
import MealAllowanceSelector from './MealAllowanceSelector';
import MealAllowanceInfo from './MealAllowanceInfo';
import { calculateHours, calculateMealAllowance, calculateTaxAmounts } from './calculationUtils';

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
    const mealAllowanceAmount = mealAllowance ? calculateMealAllowance(hoursNum, mealAllowanceType) * dates.length : 0;
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
        <DateSelector dates={dates} onDatesChange={setDates} />
        
        <TimeSelector 
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
        />
        
        <RateInput rate={rate} onRateChange={setRate} />

        <MealAllowanceSelector 
          mealAllowance={mealAllowance}
          mealAllowanceType={mealAllowanceType}
          onMealAllowanceChange={setMealAllowance}
          onMealAllowanceTypeChange={setMealAllowanceType}
        />

        <Button type="submit" className="w-full">
          Gem Timer
        </Button>
      </form>

      {mealAllowance && (
        <MealAllowanceInfo mealAllowanceType={mealAllowanceType} />
      )}
    </div>
  );
};

export default TimeRegistration;
