
import React, { useState } from 'react';
import { processNumberRequest, resetNumberWindow, getWindowSize } from '@/services/numberService';
import { NumberType, CalculationResult, ApiEndpoint } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import NumberWindow from './NumberWindow';
import { motion } from 'framer-motion';

const apiEndpoints: ApiEndpoint[] = [
  { 
    id: 'p', 
    name: 'Prime', 
    description: 'Fetch prime numbers',
    endpoint: '/numbers/p'
  },
  { 
    id: 'f', 
    name: 'Fibonacci', 
    description: 'Fetch Fibonacci numbers',
    endpoint: '/numbers/f'
  },
  { 
    id: 'e', 
    name: 'Even', 
    description: 'Fetch even numbers',
    endpoint: '/numbers/e'
  },
  { 
    id: 'r', 
    name: 'Random', 
    description: 'Fetch random numbers',
    endpoint: '/numbers/r'
  }
];

const ApiTester: React.FC = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  
  const handleFetchNumbers = async (numberType: NumberType) => {
    const endpoint = apiEndpoints.find(ep => ep.id === numberType);
    if (!endpoint) return;
    
    setSelectedEndpoint(endpoint);
    setIsLoading(true);
    
    try {
      const response = await processNumberRequest(numberType);
      setResult(response);
      toast.success(`Successfully fetched ${endpoint.name.toLowerCase()} numbers`);
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    resetNumberWindow();
    setResult(null);
    setSelectedEndpoint(null);
    toast.info('Window has been reset');
  };
  
  const chartData = result ? [
    {
      name: 'Average',
      value: result.avg,
    }
  ] : [];
  
  const windowSize = getWindowSize();
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
          <span>Window Size: {windowSize}</span>
        </div>
        <h2 className="text-2xl font-medium">Average Calculator API Tester</h2>
        <p className="text-muted-foreground mt-2">
          Select an endpoint to fetch numbers and calculate their average
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {apiEndpoints.map((endpoint) => (
          <motion.div
            key={endpoint.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg border bg-card overflow-hidden transition-colors hover:border-primary/50"
          >
            <div className="p-4">
              <h3 className="font-medium">{endpoint.name} Numbers</h3>
              <p className="text-sm text-muted-foreground mb-4">{endpoint.description}</p>
              <div className="text-xs font-mono bg-secondary p-2 rounded mb-4 overflow-x-auto">
                {endpoint.endpoint}
              </div>
              <Button 
                onClick={() => handleFetchNumbers(endpoint.id)} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && selectedEndpoint?.id === endpoint.id ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Fetch
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Result</h3>
            <Button variant="outline" onClick={handleReset} size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Window
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NumberWindow 
              title="Previous Window State" 
              numbers={result.windowPrevState}
              className="h-full"
            />
            
            <div className="relative h-full">
              <NumberWindow 
                title="Current Window State" 
                numbers={result.windowCurrState} 
                isAnimated={true}
                className="h-full"
              />
              
              {result.windowPrevState.length > 0 && (
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="rounded-full bg-primary p-2 shadow-lg">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Fetched Numbers</h3>
              <div className="h-32 overflow-y-auto grid grid-cols-5 gap-2 p-1">
                {result.numbers.length === 0 ? (
                  <div className="col-span-5 h-full flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">No numbers fetched</p>
                  </div>
                ) : (
                  result.numbers.map((number, index) => (
                    <motion.div
                      key={`fetched-${number}-${index}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.03, 
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className="flex items-center justify-center rounded-md bg-primary/10 text-primary p-2 text-sm font-medium"
                    >
                      {number}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
            
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Average</h3>
              <div className="h-32 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold mb-4">{result.avg.toFixed(2)}</div>
                <ResponsiveContainer width="100%" height={60}>
                  <BarChart data={chartData}>
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={false}
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-md p-2 text-xs">
                              Average: {payload[0].value}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">JSON Response</h3>
            <pre className="bg-secondary p-3 rounded-md overflow-x-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ApiTester;
