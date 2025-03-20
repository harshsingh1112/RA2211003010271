
// Type definitions for the application

export type NumberType = 'p' | 'f' | 'e' | 'r';

export interface NumberResponse {
  numbers: number[];
}

export interface CalculationResult {
  windowPrevState: number[];
  windowCurrState: number[];
  numbers: number[];
  avg: number;
}

export interface ApiEndpoint {
  id: NumberType;
  name: string;
  description: string;
  endpoint: string;
}
