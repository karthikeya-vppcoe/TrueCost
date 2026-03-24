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
            totalSavings: 14275,
            averageSavings: 892,
            risksDetected: 3,
            savingsGoal: 25000,
        },
        activity: Array.from({ length: 15 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (i * 3 + 2)); // Stagger dates
            return {
                id: `checkout-${i + 1}`,
                date: date.toISOString(),
                merchant: ['Amazon.in', 'Flipkart', 'Croma', 'IndiaMart', 'Myntra'][i % 5],
                items: Math.floor(Math.random() * 10) + 1,
                savings: parseFloat((Math.random() * (1500 - 200) + 200).toFixed(0)),
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
        price: parseFloat((Math.random() * 2000 + 100).toFixed(0)),
    }));
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.18;
    const shipping = 49;
    const total = subtotal + tax + shipping;
    const savings = parseFloat((total * 0.15).toFixed(0)); // ~15% savings

    return {
        id,
        date: new Date().toISOString(),
        merchant: 'Flipkart',
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
        { id: 'sub-1', name: 'Netflix Premium', amount: 649, cycle: 'monthly', nextPaymentDate: new Date(today.getFullYear(), today.getMonth(), 28).toISOString() },
        { id: 'sub-2', name: 'Spotify Premium', amount: 119, cycle: 'monthly', nextPaymentDate: new Date(today.getFullYear(), today.getMonth(), 15).toISOString() },
        { id: 'sub-3', name: 'Amazon Prime', amount: 1499, cycle: 'yearly', nextPaymentDate: new Date(today.getFullYear(), 8, 5).toISOString() },
        { id: 'sub-4', name: 'Google One 100GB', amount: 130, cycle: 'monthly', nextPaymentDate: new Date(today.getFullYear(), today.getMonth() + 1, 2).toISOString() },
        { id: 'sub-5', name: 'Gym Membership', amount: 1999, cycle: 'monthly', nextPaymentDate: new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString() },
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
        const baseSpending = 30000 + Math.random() * 20000;
        const baseSavings = baseSpending * (0.1 + Math.random() * 0.1);
        
        trends.push({
            month: months[monthIndex],
            spending: parseFloat(baseSpending.toFixed(0)),
            savings: parseFloat(baseSavings.toFixed(0)),
            transactions: Math.floor(10 + Math.random() * 10),
        });
    }
    return trends;
};

export const fetchCategorySpending = async (): Promise<import('../types.ts').CategorySpending[]> => {
    await delay(600);
    const categories = [
        { category: 'Groceries', amount: 24530, color: '#10B981', trend: 'stable' as const },
        { category: 'Electronics', amount: 18550, color: '#3B82F6', trend: 'down' as const },
        { category: 'Dining Out', amount: 15675, color: '#F59E0B', trend: 'up' as const },
        { category: 'Household', amount: 12465, color: '#8B5CF6', trend: 'stable' as const },
        { category: 'Entertainment', amount: 8999, color: '#EC4899', trend: 'up' as const },
        { category: 'Healthcare', amount: 7845, color: '#06B6D4', trend: 'down' as const },
        { category: 'Transportation', amount: 6780, color: '#F97316', trend: 'stable' as const },
        { category: 'Personal Care', amount: 4520, color: '#84CC16', trend: 'down' as const },
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
        spending: 99364,
        savings: 14275,
        transactions: 15,
    };
    const previous = {
        spending: 108732,
        savings: 12845,
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
            description: 'Based on your grocery patterns, buying in bulk could save you ₹2,500-3,000 monthly.',
            impact: 'medium',
            icon: '💡',
        },
        {
            id: '4',
            type: 'prediction',
            title: 'Next Month Forecast',
            description: 'Your predicted spending for next month is ₹95,000-1,05,000 based on current trends.',
            impact: 'low',
            icon: '📈',
        },
    ];
};

export const fetchPredictiveAnalytics = async (): Promise<import('../types.ts').PredictiveAnalytics> => {
    await delay(1000);
    return {
        nextMonthSpending: 102450,
        confidence: 87,
        factors: [
            'Historical spending patterns',
            'Seasonal trends',
            'Upcoming subscription renewals',
            'Current budget utilization',
        ],
        recommendation: 'Based on your spending patterns, we recommend setting aside ₹1,10,000 for next month to maintain your savings goals while accommodating typical expenses.',
    };
};

// Shopping List API functions
export const fetchShoppingList = async (): Promise<import('../types.ts').ShoppingListItem[]> => {
    await delay(700);
    const today = new Date();
    
    return [
        {
            id: 'item-1',
            name: 'Sony WH-1000XM5 Wireless Headphones',
            category: 'Electronics',
            targetPrice: 24999,
            currentPrice: 29999,
            merchant: 'Amazon.in',
            addedDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Waiting for Big Billion Days sale',
            priority: 'high',
            priceAlert: true,
            priceHistory: [
                { date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), price: 29999, merchant: 'Amazon.in' },
                { date: new Date(today.getTime() - 23 * 24 * 60 * 60 * 1000).toISOString(), price: 27999, merchant: 'Amazon.in' },
                { date: new Date(today.getTime() - 16 * 24 * 60 * 60 * 1000).toISOString(), price: 28499, merchant: 'Amazon.in' },
                { date: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(), price: 26999, merchant: 'Amazon.in' },
                { date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), price: 29999, merchant: 'Amazon.in' },
            ],
        },
        {
            id: 'item-2',
            name: 'Bosch Stand Mixer MUM5',
            category: 'Appliances',
            targetPrice: 18999,
            currentPrice: 16999,
            merchant: 'Croma',
            addedDate: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Croma has best price currently',
            priority: 'medium',
            priceAlert: true,
            priceHistory: [
                { date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), price: 22999, merchant: 'Croma' },
                { date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(), price: 20999, merchant: 'Croma' },
                { date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), price: 18999, merchant: 'Croma' },
                { date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), price: 17499, merchant: 'Croma' },
                { date: today.toISOString(), price: 16999, merchant: 'Croma' },
            ],
        },
        {
            id: 'item-3',
            name: 'Dyson V11 Absolute Vacuum',
            category: 'Home & Garden',
            targetPrice: 38999,
            currentPrice: 44999,
            merchant: 'Flipkart',
            addedDate: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'high',
            priceAlert: true,
            priceHistory: [
                { date: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(), price: 49999, merchant: 'Flipkart' },
                { date: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(), price: 47999, merchant: 'Flipkart' },
                { date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), price: 45999, merchant: 'Flipkart' },
                { date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), price: 44999, merchant: 'Flipkart' },
            ],
        },
        {
            id: 'item-4',
            name: 'Nintendo Switch OLED',
            category: 'Gaming',
            targetPrice: 27999,
            currentPrice: 24999,
            merchant: 'IndiaMart',
            addedDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Price dropped! Ready to buy',
            priority: 'low',
            priceAlert: false,
            priceHistory: [
                { date: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(), price: 29999, merchant: 'IndiaMart' },
                { date: new Date(today.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(), price: 27999, merchant: 'IndiaMart' },
                { date: new Date(today.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(), price: 26499, merchant: 'IndiaMart' },
                { date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), price: 25499, merchant: 'IndiaMart' },
                { date: today.toISOString(), price: 24999, merchant: 'IndiaMart' },
            ],
        },
        {
            id: 'item-5',
            name: 'Prestige Induction Cooktop',
            category: 'Kitchen',
            targetPrice: 2999,
            currentPrice: 3499,
            merchant: 'Amazon.in',
            addedDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium',
            priceAlert: true,
            priceHistory: [
                { date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), price: 3999, merchant: 'Amazon.in' },
                { date: new Date(today.getTime() - 22 * 24 * 60 * 60 * 1000).toISOString(), price: 3699, merchant: 'Amazon.in' },
                { date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), price: 3499, merchant: 'Amazon.in' },
            ],
        },
        {
            id: 'item-6',
            name: 'Apple AirPods Pro (2nd Gen)',
            category: 'Electronics',
            targetPrice: 19999,
            currentPrice: 24900,
            merchant: 'Myntra',
            addedDate: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Checking multiple retailers',
            priority: 'low',
            priceAlert: true,
            priceHistory: [
                { date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), price: 24900, merchant: 'Myntra' },
                { date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), price: 24900, merchant: 'Myntra' },
            ],
        },
    ];
};

export const fetchPriceAlerts = async (): Promise<import('../types.ts').PriceAlertNotification[]> => {
    await delay(400);
    const today = new Date();
    
    return [
        {
            id: 'alert-1',
            itemName: 'Bosch Stand Mixer MUM5',
            oldPrice: 22999,
            newPrice: 16999,
            merchant: 'Croma',
            timestamp: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'alert-2',
            itemName: 'Nintendo Switch OLED',
            oldPrice: 29999,
            newPrice: 24999,
            merchant: 'IndiaMart',
            timestamp: new Date(today.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'alert-3',
            itemName: 'Dyson V11 Absolute Vacuum',
            oldPrice: 49999,
            newPrice: 44999,
            merchant: 'Flipkart',
            timestamp: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        },
    ];
};