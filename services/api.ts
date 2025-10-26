import { ManualMappingItem, ApiHealth, ApiStatusEnum, LookupDataPoint, ActivityLogItem, ActivityType, UserSavings, UserCheckoutActivity, DetailedCheckout, Subscription } from '../types.ts';

// FIX: A helper function is created to simulate network delay, making mock API responses feel more realistic.
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// FIX: Mock data for manual mapping items is generated to provide a realistic data source for the Product Mapping view.
export const fetchManualMappingItems = async (): Promise<ManualMappingItem[]> => {
  await delay(500);
  return [
    { id: '1', unmatchedTitle: 'Super-Charge Energy Drink 24pk', merchant: 'Costco', potentialSKU: 'SC-ED-24', confidence: 88 },
    { id: '2', unmatchedTitle: 'Organic Blueberries 1lb', merchant: 'Whole Foods', potentialSKU: 'ORG-BLU-1', confidence: 92 },
    { id: '3', unmatchedTitle: 'Family Size Potato Chips', merchant: 'Walmart', potentialSKU: 'WMT-CHIPS-FAM', confidence: 75 },
    { id: '4', unmatchedTitle: 'Generic Paper Towels 8 Rolls', merchant: 'Target', potentialSKU: 'TGT-PT-8', confidence: 60 },
    { id: '5', unmatchedTitle: 'Artisan Sourdough Loaf', merchant: 'Trader Joes', potentialSKU: 'TJ-SDL-1', confidence: 95 },
  ];
};

// FIX: Mock data for API health status is created to populate the API health indicator on the dashboard.
export const fetchApiHealth = async (): Promise<ApiHealth[]> => {
  await delay(300);
  return [
    { name: 'Walmart API', status: ApiStatusEnum.OPERATIONAL, responseTime: 120 },
    { name: 'Target API', status: ApiStatusEnum.OPERATIONAL, responseTime: 150 },
    { name: 'Costco API', status: ApiStatusEnum.DEGRADED, responseTime: 850 },
    { name: 'Amazon API', status: ApiStatusEnum.DOWN, responseTime: 0 },
  ];
};

// FIX: Mock data for lookup activity is generated to populate the line chart on the dashboard.
export const fetchLookupData = async (): Promise<LookupDataPoint[]> => {
  await delay(700);
  const data: LookupDataPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      success: Math.floor(Math.random() * (500 - 300 + 1) + 300),
      failed: Math.floor(Math.random() * (50 - 10 + 1) + 10),
    });
  }
  return data;
};

// FIX: Mock data for the activity log is generated to populate the live activity feed on the dashboard.
export const fetchActivityLog = async (): Promise<ActivityLogItem[]> => {
    await delay(400);
    const now = new Date();
    return [
      { id: '1', type: ActivityType.SUCCESS, message: 'Walmart lookup for "Cereal" completed successfully.', timestamp: new Date(now.getTime() - 2 * 60000).toISOString() },
      { id: '2', type: ActivityType.RISK, message: 'Costco API response time is degraded (850ms).', timestamp: new Date(now.getTime() - 5 * 60000).toISOString() },
      { id: '3', type: ActivityType.ERROR, message: 'Failed to connect to Amazon API.', timestamp: new Date(now.getTime() - 10 * 60000).toISOString() },
      { id: '4', type: ActivityType.INFO, message: 'New mapping rule for "Organic Milk" created.', timestamp: new Date(now.getTime() - 15 * 60000).toISOString() },
      { id: '5', type: ActivityType.SUCCESS, message: 'Target lookup for "Bread" completed successfully.', timestamp: new Date(now.getTime() - 20 * 60000).toISOString() },
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// FIX: Mock data for user-specific savings and checkout activity is generated for the user profile and dashboard views.
export const fetchUserData = async (): Promise<{ savings: UserSavings; activity: UserCheckoutActivity[] }> => {
    await delay(600);
    return {
        savings: {
            totalSavings: 142.75,
            averageSavings: 8.92,
            risksDetected: 3,
            savingsGoal: 250,
        },
        activity: Array.from({ length: 15 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (i * 3 + 2)); // Stagger dates
            return {
                id: `checkout-${i + 1}`,
                date: date.toISOString(),
                merchant: ['Walmart', 'Target', 'Amazon', 'BestBuy', 'Costco'][i % 5],
                items: Math.floor(Math.random() * 10) + 1,
                savings: parseFloat((Math.random() * (15 - 2) + 2).toFixed(2)),
            };
        }),
    };
};

// FIX: A detailed mock checkout object is generated to populate the checkout detail modal, providing a complete example of a user transaction.
export const fetchCheckoutDetail = async (id: string): Promise<DetailedCheckout> => {
    await delay(800);
    const items = Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, i) => ({
        id: `item-${i}`,
        name: `Product ${String.fromCharCode(65 + i)}`,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: parseFloat((Math.random() * 20 + 1).toFixed(2)),
    }));
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const shipping = 5.99;
    const total = subtotal + tax + shipping;
    const savings = parseFloat((total * 0.15).toFixed(2)); // ~15% savings

    return {
        id,
        date: new Date().toISOString(),
        merchant: 'Target',
        items,
        subtotal,
        tax,
        shipping,
        total,
        savings,
        savingsBreakdown: [
            { description: '15% Off Store Coupon "SAVE15"', amount: parseFloat((savings * 0.7).toFixed(2)) },
            { description: 'Manufacturer Rebate on Product A', amount: parseFloat((savings * 0.3).toFixed(2)) },
        ],
    };
};

export const fetchSubscriptions = async (): Promise<Subscription[]> => {
    await delay(750);
    const today = new Date();
    return [
        { id: 'sub-1', name: 'Netflix Premium', amount: 19.99, cycle: 'monthly', nextPaymentDate: new Date(today.getFullYear(), today.getMonth(), 28).toISOString() },
        { id: 'sub-2', name: 'Spotify Family', amount: 16.99, cycle: 'monthly', nextPaymentDate: new Date(today.getFullYear(), today.getMonth(), 15).toISOString() },
        { id: 'sub-3', name: 'Amazon Prime', amount: 139.00, cycle: 'yearly', nextPaymentDate: new Date(today.getFullYear(), 8, 5).toISOString() },
        { id: 'sub-4', name: 'Cloud Storage 2TB', amount: 9.99, cycle: 'monthly', nextPaymentDate: new Date(today.getFullYear(), today.getMonth() + 1, 2).toISOString() },
        { id: 'sub-5', name: 'Gym Membership', amount: 45.50, cycle: 'monthly', nextPaymentDate: new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString() },
    ];
};

// Analytics API functions
export const fetchSpendingTrends = async (): Promise<import('../types.ts').SpendingTrend[]> => {
    await delay(800);
    const trends = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const baseSpending = 300 + Math.random() * 200;
        const baseSavings = baseSpending * (0.1 + Math.random() * 0.1);
        
        trends.push({
            month: months[monthIndex],
            spending: parseFloat(baseSpending.toFixed(2)),
            savings: parseFloat(baseSavings.toFixed(2)),
            transactions: Math.floor(10 + Math.random() * 10),
        });
    }
    return trends;
};

export const fetchCategorySpending = async (): Promise<import('../types.ts').CategorySpending[]> => {
    await delay(600);
    const categories = [
        { category: 'Groceries', amount: 245.30, color: '#10B981', trend: 'stable' as const },
        { category: 'Electronics', amount: 185.50, color: '#3B82F6', trend: 'down' as const },
        { category: 'Dining Out', amount: 156.75, color: '#F59E0B', trend: 'up' as const },
        { category: 'Household', amount: 124.65, color: '#8B5CF6', trend: 'stable' as const },
        { category: 'Entertainment', amount: 89.99, color: '#EC4899', trend: 'up' as const },
        { category: 'Healthcare', amount: 78.45, color: '#06B6D4', trend: 'down' as const },
        { category: 'Transportation', amount: 67.80, color: '#F97316', trend: 'stable' as const },
        { category: 'Personal Care', amount: 45.20, color: '#84CC16', trend: 'down' as const },
    ];
    
    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
    return categories.map(cat => ({
        ...cat,
        percentage: parseFloat(((cat.amount / total) * 100).toFixed(1)),
    }));
};

export const fetchMonthlyComparison = async (): Promise<import('../types.ts').MonthlyComparison> => {
    await delay(500);
    const current = {
        spending: 993.64,
        savings: 142.75,
        transactions: 15,
    };
    const previous = {
        spending: 1087.32,
        savings: 128.45,
        transactions: 18,
    };
    
    return {
        currentMonth: current,
        previousMonth: previous,
        percentageChange: {
            spending: parseFloat((((current.spending - previous.spending) / previous.spending) * 100).toFixed(1)),
            savings: parseFloat((((current.savings - previous.savings) / previous.savings) * 100).toFixed(1)),
            transactions: parseFloat((((current.transactions - previous.transactions) / previous.transactions) * 100).toFixed(1)),
        },
    };
};

export const fetchAnalyticsInsights = async (): Promise<import('../types.ts').AnalyticsInsight[]> => {
    await delay(900);
    return [
        {
            id: '1',
            type: 'success',
            title: 'Great Savings Performance',
            description: 'You saved 14% more this month compared to last month. Keep up the excellent work!',
            impact: 'high',
            icon: '🎉',
        },
        {
            id: '2',
            type: 'warning',
            title: 'Dining Out Spending Increased',
            description: 'Your dining out expenses are up 23% this month. Consider meal planning to reduce costs.',
            impact: 'medium',
            icon: '🍽️',
        },
        {
            id: '3',
            type: 'tip',
            title: 'Bulk Purchase Opportunity',
            description: 'Based on your grocery patterns, buying in bulk could save you $25-30 monthly.',
            impact: 'medium',
            icon: '💡',
        },
        {
            id: '4',
            type: 'prediction',
            title: 'Next Month Forecast',
            description: 'Your predicted spending for next month is $950-1050 based on current trends.',
            impact: 'low',
            icon: '📈',
        },
    ];
};

export const fetchPredictiveAnalytics = async (): Promise<import('../types.ts').PredictiveAnalytics> => {
    await delay(1000);
    return {
        nextMonthSpending: 1024.50,
        confidence: 87,
        factors: [
            'Historical spending patterns',
            'Seasonal trends',
            'Upcoming subscription renewals',
            'Current budget utilization',
        ],
        recommendation: 'Based on your spending patterns, we recommend setting aside $1,100 for next month to maintain your savings goals while accommodating typical expenses.',
    };
};