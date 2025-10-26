import React, { useState, useEffect } from 'react';
// FIX: Add file extension to import to fix module resolution error.
import DataTable from '../components/DataTable.tsx';
// FIX: Add file extension to import to fix module resolution error.
import { ManualMappingItem } from '../types.ts';
// FIX: Add file extension to import to fix module resolution error.
import { fetchManualMappingItems } from '../services/api.ts';
// FIX: Add file extension to import to fix module resolution error.
import { generateContent } from '../services/geminiService.ts';
// FIX: Add file extension to import to fix module resolution error.
import SkeletonLoader from '../components/SkeletonLoader.tsx';

const ProductMappingView: React.FC = () => {
    const [mappingItems, setMappingItems] = useState<ManualMappingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isThinking, setIsThinking] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ManualMappingItem | null>(null);
    const [geminiSuggestion, setGeminiSuggestion] = useState<string>('');

    useEffect(() => {
        const loadItems = async () => {
            setIsLoading(true);
            try {
                const items = await fetchManualMappingItems();
                setMappingItems(items);
            } catch (error) {
                console.error("Failed to fetch mapping items:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadItems();
    }, []);
    
    const handleGetSuggestion = async (item: ManualMappingItem) => {
        setSelectedItem(item);
        setGeminiSuggestion('');
        setIsThinking(true);
        try {
            const prompt = `Given the product title "${item.unmatchedTitle}" from merchant "${item.merchant}", and a potential SKU of "${item.potentialSKU}" with ${item.confidence}% confidence, what is the most likely official product name and SKU? Provide a brief justification.`;
            const suggestion = await generateContent(prompt);
            setGeminiSuggestion(suggestion);
        } catch (error) {
            setGeminiSuggestion('Sorry, I was unable to get a suggestion. Please try again.');
        } finally {
            setIsThinking(false);
        }
    };

    const columns = [
        { header: 'Product Title', accessor: 'unmatchedTitle' as keyof ManualMappingItem },
        { header: 'Merchant', accessor: 'merchant' as keyof ManualMappingItem },
        { header: 'Potential SKU', accessor: 'potentialSKU' as keyof ManualMappingItem },
        { 
            header: 'Confidence', 
            accessor: 'confidence' as keyof ManualMappingItem,
            render: (item: ManualMappingItem) => (
                <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.confidence}%` }}></div>
                    </div>
                    <span>{item.confidence}%</span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: 'id' as keyof ManualMappingItem,
            render: (item: ManualMappingItem) => (
                <div className="space-x-2">
                    <button onClick={() => handleGetSuggestion(item)} className="px-3 py-1 text-xs font-medium text-white bg-brand-primary rounded-md hover:bg-blue-700">Suggest</button>
                    <button className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Approve</button>
                    <button className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Reject</button>
                </div>
            )
        }
    ];

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 animate-fade-in">
            {isLoading ? (
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                     <SkeletonLoader className="h-8 w-1/4 mb-4" />
                     <SkeletonLoader className="h-96 w-full" />
                 </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <DataTable title="Manual Mapping Queue" columns={columns} data={mappingItems} />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">AI Suggestion</h3>
                        {selectedItem ? (
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Selected: <span className="font-bold">{selectedItem.unmatchedTitle}</span></p>
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg min-h-[10rem]">
                                    {isThinking ? (
                                        <div className="flex items-center justify-center h-full">
                                            <p className="text-gray-500 dark:text-gray-400">Thinking...</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{geminiSuggestion || 'Click "Suggest" on an item to get an AI-powered recommendation.'}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Select an item to get an AI suggestion.</p>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default ProductMappingView;