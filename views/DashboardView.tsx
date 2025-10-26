import React, { useState, useEffect } from 'react';
// FIX: Add file extension to import to fix module resolution error.
import DashboardCard from '../components/DashboardCard.tsx';
// FIX: Add file extension to import to fix module resolution error.
import LineChartComponent from '../components/LineChartComponent.tsx';
// FIX: Add file extension to import to fix module resolution error.
import ApiStatusIndicator from '../components/ApiStatusIndicator.tsx';
// FIX: Add file extension to import to fix module resolution error.
import ActivityFeed from '../components/ActivityFeed.tsx';
// FIX: Add file extension to import to fix module resolution error.
import DataTable from '../components/DataTable.tsx';
// FIX: Add file extension to import to fix module resolution error.
import { PiggyBankIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '../components/Icons.tsx';
// FIX: Add file extension to import to fix module resolution error.
import { fetchManualMappingItems, fetchApiHealth, fetchLookupData, fetchActivityLog } from '../services/api.ts';
// FIX: Add file extension to import to fix module resolution error.
import { ManualMappingItem, ApiHealth, LookupDataPoint, ActivityLogItem } from '../types.ts';

const DashboardView: React.FC = () => {
    const [mappingItems, setMappingItems] = useState<ManualMappingItem[]>([]);
    const [apiHealth, setApiHealth] = useState<ApiHealth[]>([]);
    const [lookupData, setLookupData] = useState<LookupDataPoint[]>([]);
    const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [mapping, health, lookups, activities] = await Promise.all([
                    fetchManualMappingItems(),
                    fetchApiHealth(),
                    fetchLookupData(),
                    fetchActivityLog(),
                ]);
                setMappingItems(mapping);
                setApiHealth(health);
                setLookupData(lookups);
                setActivityLog(activities);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const totalSuccess = lookupData.reduce((acc, curr) => acc + curr.success, 0);
    const totalFailed = lookupData.reduce((acc, curr) => acc + curr.failed, 0);
    const successRate = totalSuccess + totalFailed > 0 ? (totalSuccess / (totalSuccess + totalFailed)) * 100 : 0;

    const mappingColumns = [
        { header: 'Product Title', accessor: 'unmatchedTitle' as keyof ManualMappingItem },
        { header: 'Merchant', accessor: 'merchant' as keyof ManualMappingItem },
        { header: 'Potential SKU', accessor: 'potentialSKU' as keyof ManualMappingItem },
        { header: 'Confidence', accessor: 'confidence' as keyof ManualMappingItem, render: (item: ManualMappingItem) => `${item.confidence}%` },
    ];

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 animate-fade-in overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <DashboardCard 
                    title="Items to Map" 
                    value={mappingItems.length} 
                    icon={<InformationCircleIcon className="h-6 w-6 text-white"/>}
                    isLoading={isLoading}
                    colorClass="bg-blue-500"
                />
                <DashboardCard 
                    title="Successful Lookups (7d)" 
                    value={totalSuccess}
                    icon={<CheckCircleIcon className="h-6 w-6 text-white"/>}
                    isLoading={isLoading}
                    colorClass="bg-green-500"
                />
                <DashboardCard 
                    title="Failed Lookups (7d)" 
                    value={totalFailed}
                    icon={<XCircleIcon className="h-6 w-6 text-white"/>}
                    isLoading={isLoading}
                    colorClass="bg-red-500"
                />
                <DashboardCard 
                    title="Success Rate (7d)" 
                    value={Number(successRate.toFixed(1))}
                    suffix="%"
                    icon={<PiggyBankIcon className="h-6 w-6 text-white"/>}
                    isLoading={isLoading}
                    colorClass="bg-yellow-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="lg:col-span-2">
                    <LineChartComponent data={lookupData} />
                </div>
                <div>
                   <ApiStatusIndicator status={apiHealth} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                 <div className="lg:col-span-2">
                    <DataTable title="Manual Mapping Queue" columns={mappingColumns} data={mappingItems.slice(0, 5)} />
                </div>
                <div>
                   <ActivityFeed activities={activityLog} />
                </div>
            </div>
        </main>
    );
};

export default DashboardView;