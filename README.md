<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TrueCost - Smart Shopping Dashboard

A comprehensive admin and user dashboard for tracking shopping costs, managing product mappings, and monitoring API health across multiple retailers.

## Features

- 🎯 **Dual Role System**: Separate interfaces for admins and users
- 📊 **Interactive Dashboards**: Real-time data visualization with charts and analytics
- 🌍 **Global Activity Map**: Visual representation of API activity worldwide
- 🌙 **Dark Mode**: Full dark mode support with theme toggle
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🔒 **Form Validation**: Built-in validation for user inputs
- 🔔 **Notifications**: Toast notifications for user feedback
- 💰 **Savings Tracking**: Monitor and visualize shopping savings over time
- 🎨 **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

- **Frontend**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Charts**: Recharts 3.3.0
- **AI Integration**: Google Gemini AI 1.27.0
- **Styling**: TailwindCSS (via CDN)

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
- **Shopping History**: View past transactions with detailed breakdowns
- **Subscriptions**: Manage active subscriptions
- **Profile Management**: Update user information
- **Savings Goals**: Set and track financial goals

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@truecost.com or open an issue on GitHub.

## AI Studio Integration

View the original app in AI Studio: https://ai.studio/apps/drive/1GJWRwInVGIt-AOvNA6uTEk7zIdQp56Dh
