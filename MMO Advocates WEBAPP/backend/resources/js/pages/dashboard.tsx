import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Briefcase,
    CalendarClock,
    Users,
    FileEdit,
    Building2,
} from 'lucide-react';
import { DashboardOverview } from '@/components/staff/dashboard-overview';
import { CaseManagement } from '@/components/staff/case-management';
import { FollowUpManagement } from '@/components/staff/follow-up-management';
import { UserManagement } from '@/components/staff/user-management';
import { ContentManagement } from '@/components/staff/content-management';
import { dashboard } from '@/routes';

type TabKey = 'overview' | 'cases' | 'followups' | 'users' | 'content';

export default function Dashboard() {
    const { auth } = usePage().props;
    const userRole = (auth?.user?.role as string) || 'admin';
    const isAdmin = userRole === 'admin';

    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

    // Sync tab with URL search parameters
    useEffect(() => {
        const parseUrlParams = () => {
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                const tabParam = params.get('tab') as TabKey;
                const caseIdParam = params.get('caseId');

                if (tabParam && ['overview', 'cases', 'followups', 'users', 'content'].includes(tabParam)) {
                    setActiveTab(tabParam);
                }
                if (caseIdParam) {
                    setSelectedCaseId(Number(caseIdParam));
                }
            }
        };

        parseUrlParams();
        window.addEventListener('popstate', parseUrlParams);
        return () => window.removeEventListener('popstate', parseUrlParams);
    }, []);

    const handleTabChange = (tab: TabKey, caseId?: number) => {
        setActiveTab(tab);
        setSelectedCaseId(caseId || null);

        if (typeof window !== 'undefined') {
            const params = new URLSearchParams();
            params.set('tab', tab);
            if (caseId) {
                params.set('caseId', caseId.toString());
            }
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.pushState({}, '', newUrl);
        }
    };

    return (
        <>
            <Head title={`Practice Portal - ${activeTab.toUpperCase()} — MMO Advocates LLP`} />

            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Secondary In-Page Navigation Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
                    <div className="flex flex-wrap gap-1">
                        <button
                            type="button"
                            onClick={() => handleTabChange('overview')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                                activeTab === 'overview'
                                    ? 'bg-brand-navy text-white shadow-xs dark:bg-brand-blue'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <LayoutDashboard className="size-3.5" />
                            <span>Practice Overview</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTabChange('cases')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                                activeTab === 'cases'
                                    ? 'bg-brand-navy text-white shadow-xs dark:bg-brand-blue'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <Briefcase className="size-3.5" />
                            <span>Matter Directory</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTabChange('followups')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                                activeTab === 'followups'
                                    ? 'bg-brand-navy text-white shadow-xs dark:bg-brand-blue'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <CalendarClock className="size-3.5" />
                            <span>Follow-ups & Hearings</span>
                        </button>

                        {isAdmin && (
                            <button
                                type="button"
                                onClick={() => handleTabChange('users')}
                                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                                    activeTab === 'users'
                                        ? 'bg-brand-navy text-white shadow-xs dark:bg-brand-blue'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <Users className="size-3.5" />
                                <span>User Management</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => handleTabChange('content')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                                activeTab === 'content'
                                    ? 'bg-brand-navy text-white shadow-xs dark:bg-brand-blue'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <FileEdit className="size-3.5" />
                            <span>Public Content</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Building2 className="size-3.5 text-brand-gold" />
                        <span className="font-serif font-semibold text-brand-navy dark:text-slate-200">
                            MMO ADVOCATES LLP
                        </span>
                        <span className="hidden sm:inline">• Kimathi House Suite 807</span>
                    </div>
                </div>

                {/* Tab Views */}
                <div className="min-w-0">
                    {activeTab === 'overview' && (
                        <DashboardOverview
                            onNavigate={(tab, caseId) => handleTabChange(tab as TabKey, caseId)}
                            userRole={userRole}
                        />
                    )}

                    {activeTab === 'cases' && (
                        <CaseManagement
                            initialCaseId={selectedCaseId}
                            userRole={userRole}
                        />
                    )}

                    {activeTab === 'followups' && (
                        <FollowUpManagement
                            onNavigateCase={(caseId) => handleTabChange('cases', caseId)}
                            userRole={userRole}
                        />
                    )}

                    {activeTab === 'users' && (
                        <UserManagement
                            userRole={userRole}
                        />
                    )}

                    {activeTab === 'content' && (
                        <ContentManagement
                            userRole={userRole}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Staff Practice Portal',
            href: dashboard(),
        },
    ],
};
