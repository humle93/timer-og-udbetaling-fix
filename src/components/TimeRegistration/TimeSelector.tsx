
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface TimeSelectorProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

const TimeSelector = ({ 
  startTime, 
  endTime, 
  onStartTimeChange, 
  onEndTimeChange 
}: TimeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="startTime">Fra tidspunkt</Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="endTime">Til tidspunkt</Label>
        <Input
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TimeSelector;
