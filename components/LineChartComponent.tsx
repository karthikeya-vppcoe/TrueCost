
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Add file extension to import to fix module resolution error.
import { LookupDataPoint } from '../types.ts';

interface LineChartComponentProps {
    data: LookupDataPoint[];
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-96">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Lookup Activity (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.3)" />
                    <XAxis dataKey="date" tick={{ fill: '#9ca3af' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                            borderColor: '#4b5563',
                            color: '#ffffff'
                        }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="success" stroke="#22c55e" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default LineChartComponent;