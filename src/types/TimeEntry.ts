
export interface TimeEntry {
  id: number;
  dates: string[];
  startTime: string;  // 24-hour format HH:mm
  endTime: string;    // 24-hour format HH:mm
  hours: number;
  rate: number;
  total: number;
  mealAllowance: boolean;
  mealAllowanceType: 'with_allowance' | 'without_allowance';
  mealAllowanceAmount: number;
  taxableAmount: number;
  taxFreeAmount: number;
}
