export interface MonthlySummaryResponseDto {
  uid: string;
  year: number;
  month: number;
  mainCategorySummary: CalculatedSummary[];
  subCategorySummary: CalculatedSummary[];
  dailyCount: number[];
  dailyAmount: number[];
}

interface CalculatedSummary {
  categoryName: string;
  count: number;
  amount: number;
  percentage: number;
}
