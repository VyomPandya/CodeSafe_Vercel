import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

interface SeverityFilterProps {
  selectedSeverities: string[];
  onSeverityChange: (severity: string) => void;
}

export function SeverityFilter({ selectedSeverities, onSeverityChange }: SeverityFilterProps) {
  const severities = [
    { value: 'high', label: 'High', icon: XCircle, color: 'text-red-500 bg-red-50' },
    { value: 'medium', label: 'Medium', icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' },
    { value: 'low', label: 'Low', icon: AlertTriangle, color: 'text-yellow-500 bg-yellow-50' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {severities.map(({ value, label, icon: Icon, color }) => (
        <button
          key={value}
          onClick={() => onSeverityChange(value)}
          className={`inline-flex items-center px-3 py-1 rounded-full border ${
            selectedSeverities.includes(value)
              ? `${color} border-transparent`
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          } text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          <Icon className="h-4 w-4 mr-1" />
          {label}
        </button>
      ))}
    </div>
  );
}