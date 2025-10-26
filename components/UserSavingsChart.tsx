import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// FIX: Add file extension to import to fix module resolution error.
import { UserCheckoutActivity } from '../types.ts';
// FIX: Add file extension to import to fix module resolution error.
import { formatCurrency, formatDate } from '../utils/formatters.ts';
// FIX: Add file extension to import to fix module resolution error.
import { TrendingUpIcon } from './Icons.tsx';

interface UserSavingsChartProps {
    data: UserCheckoutActivity[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg">
        <p className="label font-semibold">{`${formatDate(label)}`}</p>
        <p className="intro text-green-400">{`Saved: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
};


const UserSavingsChart: React.FC<UserSavingsChartProps> = ({ data }) => {
    // Recharts expects data to be in chronological order
    const chartData = [...data].reverse();

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-96">
            <div className="flex items-center mb-4">
                <TrendingUpIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Savings Trends</h3>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
                    <XAxis 
                        dataKey="date" 
                        tickFormatter={(tick) => formatDate(tick).split(',')[0]} // Show "Month Day"
                        tick={{ fill: '#9ca3af' }}
                        axisLine={{ stroke: 'rgba(107, 114, 128, 0.5)' }}
                        tickLine={{ stroke: 'rgba(107, 114, 128, 0.5)' }}
                    />
                    <YAxis 
                        tickFormatter={(tick) => formatCurrency(tick)}
                        tick={{ fill: '#9ca3af' }}
                        axisLine={{ stroke: 'rgba(107, 114, 128, 0.5)' }}
                        tickLine={{ stroke: 'rgba(107, 114, 128, 0.5)' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default UserSavingsChart;