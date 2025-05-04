
export const calculateHours = (start: string, end: string): number => {
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

export const calculateMealAllowance = (hours: number, mealAllowanceType: 'with_allowance' | 'without_allowance') => {
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

export const calculateTaxAmounts = (totalAmount: number, mealAllowanceAmount: number) => {
  const taxableAmount = totalAmount;
  const taxFreeAmount = mealAllowanceAmount;
  
  return {
    taxFreeAmount,
    taxableAmount
  };
};
