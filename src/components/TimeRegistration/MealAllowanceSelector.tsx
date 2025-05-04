
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface MealAllowanceSelectorProps {
  mealAllowance: boolean;
  mealAllowanceType: 'with_allowance' | 'without_allowance';
  onMealAllowanceChange: (checked: boolean) => void;
  onMealAllowanceTypeChange: (type: 'with_allowance' | 'without_allowance') => void;
}

const MealAllowanceSelector = ({
  mealAllowance,
  mealAllowanceType,
  onMealAllowanceChange,
  onMealAllowanceTypeChange
}: MealAllowanceSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="mealAllowance" 
          checked={mealAllowance}
          onCheckedChange={(checked) => onMealAllowanceChange(checked as boolean)}
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
            onValueChange={(value: 'with_allowance' | 'without_allowance') => onMealAllowanceTypeChange(value)}
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
  );
};

export default MealAllowanceSelector;
