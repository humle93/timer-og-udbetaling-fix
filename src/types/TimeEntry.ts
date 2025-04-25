
export interface TimeEntry {
  id: number;
  dates: string[]; // Changed from single date to array of dates
  hours: number;
  rate: number;
  total: number;
  mealAllowance: boolean;
  mealAllowanceAmount: number;
  taxableAmount: number;
  taxFreeAmount: number;
}
