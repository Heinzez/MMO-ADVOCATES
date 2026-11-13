import { useEffect, useState } from 'react';
import {
    AlertTriangle,
    CalendarCheck,
    CheckCircle2,
    Clock,
    PlusCircle,
    Briefcase,
    Building,
    Scale,
    ExternalLink,
    RefreshCw,
    ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    fetchDashboardData,
    fetchCases,
    updateFollowUp,
    getApiMode,
    onApiModeChange,
    type ApiConnectionMode,
} from '@/services/staff-api';
import type { DashboardData, CaseRecord, FollowUpItem } from '@/types';

interface DashboardOverviewProps {
    onNavigate: (tab: string, caseId?: number) => void;
    userRole: string;
}

export function DashboardOverview({ onNavigate, userRole }: DashboardOverviewProps) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [cases, setCases] = useState<CaseRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [apiMode, setApiMode] = useState<ApiConnectionMode>(getApiMode());

    useEffect(() => {
        const unsubscribe = onApiModeChange(setApiMode);
        loadData();
        return () => unsubscribe();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [dash, caseList] = await Promise.all([
                fetchDashboardData(),
                fetchCases(),
            ]);
            setData(dash);
            setCases(caseList);
        } catch (e) {
            console.error('Failed to load dashboard data:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkDone = async (item: FollowUpItem) => {
        setUpdatingId(item.id);
        try {
            await updateFollowUp(item.id, { status: 'done' });
            await loadData();
        } catch (e) {
            console.error('Failed to mark follow-up done:', e);
        } finally {
            setUpdatingId(null);
        }
    };

    // Calculate metrics
    const overdueCount = data?.overdue.length || 0;
    const todayCount = data?.today.length || 0;
    const activeCasesCount = cases.filter((c) => c.status !== 'closed').length;
    const hearingMattersCount = cases.filter((c) => c.status === 'pending_hearing').length;

    // Format Nairobi date nicely
    const todayDate = data?.date || new Date().toISOString().split('T')[0];
    const formattedNairobiDate = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Nairobi',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date());

    return (
        <div className="space-y-6">
            {/* Practice Banner */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-border/80 bg-brand-surface p-5 md:flex-row md:items-center">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Scale className="size-5 text-brand-navy" />
                        <h2 className="font-serif text-xl font-semibold tracking-tight text-brand-navy dark:text-slate-100">
                            Advocate Practice Desk
                        </h2>
                        <Badge
                            variant={apiMode === 'live' ? 'default' : 'secondary'}
                            className="ml-2 text-[10px] font-mono uppercase"
                        >
                            {apiMode === 'live' ? '● Live Backend' : '○ Synthetic Fixtures'}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formattedNairobiDate} • Africa/Nairobi (<span className="font-mono">UTC+3</span>)
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadData}
                        disabled={loading}
                        className="text-xs"
                    >
                        <RefreshCw className={`mr-1 size-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => onNavigate('cases')}
                        className="bg-brand-navy hover:bg-[#16365c] text-white text-xs"
                    >
                        <PlusCircle className="mr-1 size-3.5" />
                        Register New Case
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onNavigate('followups')}
                        className="text-xs"
                    >
                        <CalendarCheck className="mr-1 size-3.5" />
                        Schedule Follow-up
                    </Button>
                </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Overdue Card */}
                <Card className={`border-l-4 ${overdueCount > 0 ? 'border-l-amber-600 bg-amber-50/30 dark:bg-amber-950/10' : 'border-l-slate-300'}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Overdue Follow-ups
                        </CardTitle>
                        <AlertTriangle className={`size-4 ${overdueCount > 0 ? 'text-amber-600' : 'text-muted-foreground'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{overdueCount}</div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            {overdueCount > 0 ? 'Urgent client or registry actions requiring attention' : 'No overdue items'}
                        </p>
                    </CardContent>
                </Card>

                {/* Due Today Card */}
                <Card className="border-l-4 border-l-brand-blue bg-blue-50/20 dark:bg-blue-950/10">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Due Today
                        </CardTitle>
                        <Clock className="size-4 text-brand-blue" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{todayCount}</div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Scheduled for today ({todayDate})
                        </p>
                    </CardContent>
                </Card>

                {/* Active Matters */}
                <Card className="border-l-4 border-l-brand-navy">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Active Matters
                        </CardTitle>
                        <Briefcase className="size-4 text-brand-navy" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{activeCasesCount}</div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Out of {cases.length} total registered cases
                        </p>
                    </CardContent>
                </Card>

                {/* Court Hearing Matters */}
                <Card className="border-l-4 border-l-purple-600">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Court Hearings
                        </CardTitle>
                        <Building className="size-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{hearingMattersCount}</div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Active litigation / hearing notices
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Action Grids */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left Column: Overdue and Due Today Tasks (7 cols) */}
                <div className="space-y-6 lg:col-span-7">
                    {/* Overdue Tasks */}
                    <Card className="border-amber-200/80 dark:border-amber-900/60 shadow-sm">
                        <CardHeader className="border-b border-border/60 bg-amber-50/50 py-3.5 dark:bg-amber-950/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="size-4 text-amber-700 dark:text-amber-500" />
                                    <CardTitle className="text-sm font-semibold text-amber-950 dark:text-amber-200">
                                        Overdue Action Items ({overdueCount})
                                    </CardTitle>
                                </div>
                                <span className="text-[11px] font-medium text-amber-800 dark:text-amber-400">
                                    Prioritize Immediately
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="divide-y divide-border/60 p-0">
                            {overdueCount === 0 ? (
                                <div className="p-6 text-center text-xs text-muted-foreground">
                                    <CheckCircle2 className="mx-auto mb-2 size-6 text-green-600" />
                                    No overdue follow-ups pending. Excellent practice management.
                                </div>
                            ) : (
                                data?.overdue.map((item) => (
                                    <div key={item.id} className="p-4 hover:bg-muted/40 transition">
                                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-semibold text-brand-navy dark:text-sky-300">
                                                        {item.case_record?.case_number || `Case #${item.case_id}`}
                                                    </span>
                                                    <span className="text-xs font-medium text-foreground">
                                                        • {item.case_record?.client_name || 'Client Matter'}
                                                    </span>
                                                    <Badge variant="destructive" className="text-[10px] py-0 px-1.5">
                                                        Due: {item.due_on}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-700 dark:text-slate-300">
                                                    {item.note}
                                                </p>
                                                {item.assignee && (
                                                    <div className="text-[11px] text-muted-foreground">
                                                        Assigned to: <span className="font-medium text-foreground">{item.assignee.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 pt-1 sm:pt-0">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onNavigate('cases', item.case_id)}
                                                    className="h-7 text-[11px]"
                                                >
                                                    View Case
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    disabled={updatingId === item.id}
                                                    onClick={() => handleMarkDone(item)}
                                                    className="h-7 bg-green-700 hover:bg-green-800 text-white text-[11px]"
                                                >
                                                    <CheckCircle2 className="mr-1 size-3" />
                                                    Mark Done
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Today's Tasks */}
                    <Card className="border-border/80 shadow-sm">
                        <CardHeader className="border-b border-border/60 bg-brand-surface py-3.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-brand-blue" />
                                    <CardTitle className="text-sm font-semibold text-foreground">
                                        Scheduled for Today ({todayCount})
                                    </CardTitle>
                                </div>
                                <span className="text-[11px] font-mono text-muted-foreground">
                                    {todayDate}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="divide-y divide-border/60 p-0">
                            {todayCount === 0 ? (
                                <div className="p-6 text-center text-xs text-muted-foreground">
                                    No follow-ups due today. Click "Schedule Follow-up" to record a court appearance or document deadline.
                                </div>
                            ) : (
                                data?.today.map((item) => (
                                    <div key={item.id} className="p-4 hover:bg-muted/40 transition">
                                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-semibold text-brand-navy dark:text-sky-300">
                                                        {item.case_record?.case_number || `Case #${item.case_id}`}
                                                    </span>
                                                    <span className="text-xs font-medium text-foreground">
                                                        • {item.case_record?.client_name || 'Client Matter'}
                                                    </span>
                                                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-brand-blue text-brand-blue">
                                                        Today
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-700 dark:text-slate-300">
                                                    {item.note}
                                                </p>
                                                {item.assignee && (
                                                    <div className="text-[11px] text-muted-foreground">
                                                        Assigned to: <span className="font-medium text-foreground">{item.assignee.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 pt-1 sm:pt-0">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onNavigate('cases', item.case_id)}
                                                    className="h-7 text-[11px]"
                                                >
                                                    View Case
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    disabled={updatingId === item.id}
                                                    onClick={() => handleMarkDone(item)}
                                                    className="h-7 bg-green-700 hover:bg-green-800 text-white text-[11px]"
                                                >
                                                    <CheckCircle2 className="mr-1 size-3" />
                                                    Mark Done
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Recent Matters & Practice Directory Links (5 cols) */}
                <div className="space-y-6 lg:col-span-5">
                    {/* Active Case Matters */}
                    <Card className="border-border/80 shadow-sm">
                        <CardHeader className="border-b border-border/60 bg-brand-surface py-3.5">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    Recent Active Matters
                                </CardTitle>
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => onNavigate('cases')}
                                    className="p-0 text-xs text-brand-blue hover:text-brand-navy"
                                >
                                    View All ({cases.length}) →
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="divide-y divide-border/60 p-0">
                            {cases.slice(0, 5).map((c) => (
                                <div
                                    key={c.id}
                                    onClick={() => onNavigate('cases', c.id)}
                                    className="flex cursor-pointer items-center justify-between p-3.5 hover:bg-muted/50 transition"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-semibold text-brand-navy dark:text-sky-300">
                                                {c.case_number}
                                            </span>
                                            <span className="rounded bg-brand-surface px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300 border border-border/50">
                                                {c.type}
                                            </span>
                                        </div>
                                        <div className="text-xs font-medium text-foreground truncate max-w-[240px]">
                                            {c.client_name}
                                        </div>
                                        {c.court && (
                                            <div className="text-[11px] text-muted-foreground truncate max-w-[240px]">
                                                {c.court}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                            c.status === 'open'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                                : c.status === 'in_progress'
                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                : c.status === 'pending_hearing'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                        }`}>
                                            {c.status.replace('_', ' ')}
                                        </span>
                                        <div className="text-[10px] text-muted-foreground mt-1">
                                            {c.assigned_lawyer?.name || 'Unassigned'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Official Portals & Registries */}
                    <Card className="border-border/80 shadow-sm">
                        <CardHeader className="py-3.5">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Judicial & Land Portals (Kenya)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs">
                            <a
                                href="https://efiling.court.go.ke"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded p-2 hover:bg-brand-surface transition border border-transparent hover:border-border"
                            >
                                <span className="font-medium text-foreground">Kenya Judiciary E-Filing System</span>
                                <ExternalLink className="size-3 text-muted-foreground" />
                            </a>
                            <a
                                href="https://ardhisasa.lands.go.ke"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded p-2 hover:bg-brand-surface transition border border-transparent hover:border-border"
                            >
                                <span className="font-medium text-foreground">Ministry of Lands ArdhiSasa Portal</span>
                                <ExternalLink className="size-3 text-muted-foreground" />
                            </a>
                            <a
                                href="http://kenyalaw.org"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded p-2 hover:bg-brand-surface transition border border-transparent hover:border-border"
                            >
                                <span className="font-medium text-foreground">Kenya Law Reports & Cause Lists</span>
                                <ExternalLink className="size-3 text-muted-foreground" />
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
