import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

export interface VulnerabilityResult {
  severity: 'low' | 'medium' | 'high';
  message: string;
  line: number;
  column?: number;
  rule?: string;
  improvement?: string;
}

interface AnalysisResultProps {
  results: VulnerabilityResult[];
  fileName: string;
}

export function AnalysisResult({ results, fileName }: AnalysisResultProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-yellow-500';
      case 'medium':
        return 'text-orange-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <AlertTriangle className="h-5 w-5" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5" />;
      case 'high':
        return <XCircle className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Analysis Results for {fileName}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Found {results.length} potential {results.length === 1 ? 'issue' : 'issues'}
        </p>
      </div>
      <div className="divide-y divide-gray-200">
        {results.map((result, index) => (
          <div key={index} className="px-4 py-4 sm:px-6">
            <div 
              className="flex items-center justify-between cursor-pointer" 
              onClick={() => toggleItem(index)}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${getSeverityColor(result.severity)}`}>
                  {getSeverityIcon(result.severity)}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} Severity
                  </h4>
                  <p className="text-sm text-gray-500">{result.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Line {result.line}{result.column ? `, Column ${result.column}` : ''}
                    {result.rule && ` • Rule: ${result.rule}`}
                  </p>
                </div>
              </div>
              <div>
                {expandedItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            
            {expandedItems.includes(index) && result.improvement && (
              <div className="mt-4 ml-8 p-3 bg-indigo-50 rounded-md">
                <h5 className="text-sm font-medium text-indigo-800 mb-1">
                  Improvement Suggestion
                </h5>
                <p className="text-sm text-indigo-700">
                  {result.improvement}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}