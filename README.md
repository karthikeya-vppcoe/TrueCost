<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TrueCost - Smart Shopping Intelligence

A production-grade fintech shopping intelligence app combining real-time price comparison (like an improved Buyhatke.com) with hidden-fee transparency. Compare live prices across Amazon.in, Flipkart, Croma & IndiaMart – powered by Gemini AI.

## Features

- 🎯 **Dual Role System**: Separate interfaces for admins and users
- 💸 **Real-time Price Intelligence**: Live prices from Amazon.in, Flipkart, Croma & IndiaMart via Gemini AI simulation
- 🎟️ **Auto-detect Coupons**: Gemini AI finds 2-3 working coupon codes for any merchant
- 📈 **30-Day Price History**: Line chart tracking price trends for any product
- ⚠️ **Hidden Fee Detection**: Identifies and surfaces convenience/platform fees at checkout
- 🛒 **Smart Shopping List**: Track items, set target prices, get price drop alerts
- 📊 **Advanced Analytics**: Spending trends, category breakdown, AI-powered insights & forecasts
- 🌙 **Dark Mode**: Full dark/light mode support
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🏆 **Savings Milestones & Rewards**: Gamification to encourage smart shopping
- 🔔 **Toast Notifications**: Real-time feedback for user actions

## Real-time Price Intelligence (powered by Gemini + IndiaMart simulation)

Search any product (e.g. "Wireless Headphones", "Smart Watch", "Laptop") to get:
- Live prices from **Amazon.in**, **Flipkart**, **Croma**, and **IndiaMart (Wholesale)**
- Savings percentage comparison across retailers  
- 30-day price history chart  
- Auto-detected coupon codes per merchant

## Tech Stack

- **Frontend**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Charts**: Recharts 3.3.0
- **AI Integration**: Google Gemini AI 1.27.0 (price data + coupons)
- **Styling**: TailwindCSS (via CDN) – clean fintech design (teal #0D9488 accent)

## Run Locally

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/karthikeya-vppcoe/TrueCost.git
   cd TrueCost
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   Get your API key from: https://makersuite.google.com/app/apikey

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
5. Deploy!

The `vercel.json` configuration is already included for automatic setup.

### Deploy to Render

1. Push your code to GitHub
2. Visit [Render](https://render.com)
3. Create a new Static Site
4. Connect your repository
5. Add environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
6. Deploy!

The `render.yaml` configuration is already included for automatic setup.

### Deploy to Netlify

1. Push your code to GitHub
2. Visit [Netlify](https://netlify.com)
3. Import your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
6. Deploy!

## Default Credentials

### Admin Access
- Email: `admin@truecost.com`
- Password: `password`

### User Access
- Sign up with any email or sign in with any credentials
- Email format validation applies

## Project Structure

```
TrueCost/
├── components/          # Reusable React components
│   ├── ErrorBoundary.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Toast.tsx
│   └── ...
├── context/            # React context providers
│   └── NotificationContext.tsx
├── hooks/              # Custom React hooks
│   ├── useCountUp.ts
│   └── useFormValidation.ts
├── services/           # API and service integrations
│   ├── api.ts
│   ├── geminiService.ts
│   └── errorTrackingService.ts
├── utils/              # Utility functions
│   └── formatters.ts
├── views/              # Page-level components
│   ├── AuthView.tsx
│   ├── DashboardView.tsx
│   ├── UserDashboardView.tsx
│   └── ...
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── vite.config.ts      # Vite configuration
```

## Features by Role

### Admin Features
- **Dashboard Overview**: System-wide metrics and analytics
- **Product Mapping**: Manage unmatched products and SKU mappings
- **API Health Monitoring**: Real-time API status across retailers
- **Activity Feed**: Live system activity logs
- **Settings**: Account and system configuration

### User Features
- **Savings Dashboard**: Track total and average savings
- **Advanced Analytics**: Deep insights with AI-powered predictions and spending trends
- **Shopping History**: View past transactions with detailed breakdowns
- **Price Comparison**: Compare prices across multiple retailers
- **Smart Shopping List** 🆕: Track items with price history and get alerts when prices drop
- **Subscriptions**: Manage active subscriptions
- **Profile Management**: Update user information
- **Savings Goals**: Set and track financial goals
- **Achievements & Rewards**: Unlock milestones and earn points
- **Budget Insights**: AI-powered spending analysis and recommendations

### New! Smart Shopping List Features
- 📊 **Price History Tracking**: Visualize price trends over time with interactive charts
- 🔔 **Price Drop Alerts**: Get notified when items reach your target price
- 🎯 **Priority Management**: Organize items by priority (high/medium/low)
- 💰 **Savings Calculator**: See potential savings at a glance
- 📈 **Multi-Merchant Tracking**: Monitor prices across different retailers
- ✅ **Purchase Tracking**: Mark items as purchased when you buy them
- 🎨 **Beautiful UI**: Smooth animations and responsive design

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@truecost.com or open an issue on GitHub.

## AI Studio Integration

View the original app in AI Studio: https://ai.studio/apps/drive/1GJWRwInVGIt-AOvNA6uTEk7zIdQp56Dh
