
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Add file extension to import to fix module resolution error.
import { LookupDataPoint } from '../types.ts';

interface LineChartComponentProps {
    data: LookupDataPoint[];
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-96 animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
                <svg className="w-6 h-6 text-brand-primary animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Lookup Activity (Last 7 Days)</h3>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#9ca3af', fontSize: 12 }} 
                        stroke="#6b7280"
                    />
                    <YAxis 
                        tick={{ fill: '#9ca3af', fontSize: 12 }} 
                        stroke="#6b7280"
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(31, 41, 55, 0.95)',
                            borderColor: '#4b5563',
                            borderRadius: '8px',
                            color: '#ffffff',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                    />
                    <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="success" 
                        stroke="#22c55e" 
                        strokeWidth={3} 
                        dot={{ fill: '#22c55e', r: 5 }}
                        activeDot={{ r: 8, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="failed" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', r: 5 }}
                        activeDot={{ r: 8, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default LineChartComponent;