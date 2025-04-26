import React from 'react';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, XCircle, Clock, FileCode } from 'lucide-react';
import { VulnerabilityResult } from './AnalysisResult';

interface HistoryEntry {
  id: string;
  file_name: string;
  results: VulnerabilityResult[];
  created_at: string;
}

interface HistoryViewProps {
  history: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
}

export function HistoryView({ history, onSelectEntry }: HistoryViewProps) {
  // Ensure history is an array
  const safeHistory = Array.isArray(history) ? history : [];
  
  const getSeverityCount = (results: VulnerabilityResult[] | any, severity: 'high' | 'medium' | 'low') => {
    // Ensure results is an array before calling filter
    if (!Array.isArray(results)) {
      console.error('Results is not an array:', results);
      return 0;
    }
    return results.filter(result => result.severity === severity).length;
  };

  const getSeverityIcon = (count: number, severity: 'high' | 'medium' | 'low') => {
    if (count === 0) return null;

    const iconClass = {
      high: 'text-red-500',
      medium: 'text-orange-500',
      low: 'text-yellow-500'
    }[severity];

    const Icon = {
      high: XCircle,
      medium: AlertTriangle,
      low: AlertTriangle
    }[severity];

    return (
      <div className={`flex items-center ${iconClass} mr-3`}>
        <Icon className="h-4 w-4 mr-1" />
        <span className="text-sm">{count}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Analysis History</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {safeHistory.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            No analysis history available
          </div>
        ) : (
          safeHistory.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className="w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileCode className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{entry.file_name}</p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">
                        {format(new Date(entry.created_at), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {getSeverityIcon(getSeverityCount(entry.results, 'high'), 'high')}
                  {getSeverityIcon(getSeverityCount(entry.results, 'medium'), 'medium')}
                  {getSeverityIcon(getSeverityCount(entry.results, 'low'), 'low')}
                  {Array.isArray(entry.results) && entry.results.length === 0 && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}