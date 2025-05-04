
interface MealAllowanceInfoProps {
  mealAllowanceType: 'with_allowance' | 'without_allowance';
}

const MealAllowanceInfo = ({ mealAllowanceType }: MealAllowanceInfoProps) => {
  return (
    <div className="mt-4 p-4 bg-sky-50 rounded-md">
      <h3 className="font-medium mb-2">Kostpenge satser 2025 ({mealAllowanceType === 'with_allowance' ? 'med' : 'uden'} diæt):</h3>
      <ul className="text-sm space-y-1">
        <li>• 5-11 timer: {mealAllowanceType === 'with_allowance' ? '284,50' : '48'} kr. (50%)</li>
        <li>• 11-24 timer: {mealAllowanceType === 'with_allowance' ? '426,75' : '72'} kr. (75%)</li>
        <li>• Over 24 timer: {mealAllowanceType === 'with_allowance' ? '569' : '96'} kr. (100%)</li>
      </ul>
    </div>
  );
};

export default MealAllowanceInfo;
