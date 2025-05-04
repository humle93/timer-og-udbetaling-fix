
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface RateInputProps {
  rate: string;
  onRateChange: (value: string) => void;
}

const RateInput = ({ rate, onRateChange }: RateInputProps) => {
  return (
    <div>
      <Label htmlFor="rate">Timeløn (DKK)</Label>
      <Input
        id="rate"
        type="number"
        step="0.01"
        placeholder="Timeløn"
        value={rate}
        onChange={(e) => onRateChange(e.target.value)}
      />
    </div>
  );
};

export default RateInput;
