import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import DashboardView from './views/DashboardView.tsx';
import ProductMappingView from './views/ProductMappingView.tsx';
import SettingsView from './views/SettingsView.tsx';
import AuthView from './views/AuthView.tsx';
import AdminAuthView from './views/AdminAuthView.tsx';
import UserAuthView from './views/UserAuthView.tsx';
import UserDashboardView from './views/UserDashboardView.tsx';
import UserProfileView from './views/UserProfileView.tsx';
import SubscriptionsView from './views/SubscriptionsView.tsx';
import PriceComparisonView from './views/PriceComparisonView.tsx';
import AnalyticsView from './views/AnalyticsView.tsx';
import UserHeader from './components/UserHeader.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import { User, AdminView, Theme, UserRole, UserView } from './types.ts';

type AppView = 'auth' | 'adminAuth' | 'userAuth' | 'app';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentAdminView, setCurrentAdminView] = useState<AdminView>('dashboard');
    const [currentUserView, setCurrentUserView] = useState<UserView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [appView, setAppView] = useState<AppView>('auth');

    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setAppView('app');
    };
    
    const handleLogout = () => {
        setUser(null);
        setAppView('auth');
        // Reset sub-views
        setCurrentUserView('dashboard');
        setCurrentAdminView('dashboard');
    };

    const handleUpdateUser = (updatedUser: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...updatedUser });
        }
    };
    
    const handleSelectRole = (role: UserRole) => {
        if (role === 'admin') {
            setAppView('adminAuth');
        } else {
            setAppView('userAuth');
        }
    };
    
    const renderAdminContent = () => {
        switch (currentAdminView) {
            case 'dashboard':
                return <DashboardView />;
            case 'mapping':
                return <ProductMappingView />;
            case 'settings':
                return user && <SettingsView user={user} onUpdate={handleUpdateUser} />;
            default:
                return <DashboardView />;
        }
    };

    const renderUserContent = () => {
        if (!user) return null;
        switch (currentUserView) {
            case 'dashboard':
                return <UserDashboardView user={user} onNavigate={(view) => setCurrentUserView(view)} />;
            case 'profile':
                return <UserProfileView user={user} onBack={() => setCurrentUserView('dashboard')} onUpdate={handleUpdateUser} />;
            case 'subscriptions':
                return <SubscriptionsView onBack={() => setCurrentUserView('dashboard')} />;
            case 'priceComparison':
                return <PriceComparisonView onBack={() => setCurrentUserView('dashboard')} />;
            case 'analytics':
                return <AnalyticsView onBack={() => setCurrentUserView('dashboard')} />;
            default:
                 return <UserDashboardView user={user} onNavigate={(view) => setCurrentUserView(view)} />;
        }
    }

    if (appView === 'auth') return <AuthView onSelectRole={handleSelectRole} />;
    if (appView === 'adminAuth') return <AdminAuthView onLogin={handleLogin} onBack={() => setAppView('auth')} />;
    if (appView === 'userAuth') return <UserAuthView onLogin={handleLogin} onBack={() => setAppView('auth')} />;

    return (
        <ErrorBoundary>
            <NotificationProvider>
                {user?.role === 'admin' ? (
                    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                        <Sidebar
                            currentView={currentAdminView}
                            setCurrentView={setCurrentAdminView}
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <Header
                                user={user}
                                currentView={currentAdminView}
                                setIsSidebarOpen={setIsSidebarOpen}
                                onLogout={handleLogout}
                                theme={theme}
                                setTheme={setTheme}
                            />
                            {renderAdminContent()}
                        </div>
                    </div>
                ) : (
                     <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
                        {user && (
                             <UserHeader 
                                user={user}
                                onLogout={handleLogout}
                                theme={theme}
                                setTheme={setTheme}
                                onNavigateProfile={() => setCurrentUserView('profile')}
                            />
                        )}
                       
                        {renderUserContent()}
                    </div>
                )}
            </NotificationProvider>
        </ErrorBoundary>
    );
};

export default App;