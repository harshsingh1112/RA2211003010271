
import { NumberType, NumberResponse, CalculationResult } from '@/lib/types';
import { toast } from "sonner";

const API_BASE_URL = 'http://20.244.56.144/test';
const WINDOW_SIZE = 10;
const TIMEOUT_MS = 500;

// In-memory storage for numbers in the window
let numberWindow: number[] = [];

// Map of number types to their API endpoints
const apiEndpoints: Record<NumberType, string> = {
  p: `${API_BASE_URL}/primes`,
  f: `${API_BASE_URL}/fibo`,
  e: `${API_BASE_URL}/even`,
  r: `${API_BASE_URL}/rand`,
};

/**
 * Fetches numbers from the API with a timeout
 */
const fetchWithTimeout = async (url: string): Promise<NumberResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${TIMEOUT_MS}ms`);
    }
    throw error;
  }
};

/**
 * Processes a request for a specific number type
 */
export const processNumberRequest = async (numberType: NumberType): Promise<CalculationResult> => {
  if (!Object.keys(apiEndpoints).includes(numberType)) {
    throw new Error(`Invalid number type: ${numberType}`);
  }

  // Save the previous state of the window
  const windowPrevState = [...numberWindow];
  
  try {
    // Fetch numbers from the API
    const apiUrl = apiEndpoints[numberType];
    const response = await fetchWithTimeout(apiUrl);
    const fetchedNumbers = response.numbers || [];
    
    // Update the window with new unique numbers
    updateNumberWindow(fetchedNumbers);
    
    // Calculate the average
    const avg = calculateAverage(numberWindow);
    
    return {
      windowPrevState,
      windowCurrState: [...numberWindow],
      numbers: fetchedNumbers,
      avg,
    };
  } catch (error) {
    toast.error(`Error fetching numbers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    // Return current state in case of error
    return {
      windowPrevState,
      windowCurrState: [...numberWindow],
      numbers: [],
      avg: calculateAverage(numberWindow),
    };
  }
};

/**
 * Updates the number window with new unique numbers
 */
const updateNumberWindow = (newNumbers: number[]): void => {
  // Filter out numbers that are already in the window
  const uniqueNewNumbers = newNumbers.filter(num => !numberWindow.includes(num));
  
  if (uniqueNewNumbers.length === 0) {
    return;
  }
  
  if (numberWindow.length + uniqueNewNumbers.length <= WINDOW_SIZE) {
    // If we can add all unique new numbers without exceeding window size
    numberWindow = [...numberWindow, ...uniqueNewNumbers];
  } else {
    // If adding all would exceed window size, replace oldest numbers
    const spaceAvailable = WINDOW_SIZE - numberWindow.length;
    
    if (spaceAvailable > 0) {
      // Fill remaining space first
      numberWindow = [...numberWindow, ...uniqueNewNumbers.slice(0, spaceAvailable)];
      
      // Then replace oldest with newest for the rest
      const remaining = uniqueNewNumbers.slice(spaceAvailable);
      numberWindow = [...numberWindow.slice(remaining.length), ...remaining];
    } else {
      // Window is full, replace oldest with newest
      numberWindow = [...numberWindow.slice(uniqueNewNumbers.length), ...uniqueNewNumbers];
    }
  }
};

/**
 * Calculates the average of numbers in the window
 */
const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
};

/**
 * Resets the number window (for testing purposes)
 */
export const resetNumberWindow = (): void => {
  numberWindow = [];
};

/**
 * Gets the current window size
 */
export const getWindowSize = (): number => {
  return WINDOW_SIZE;
};
