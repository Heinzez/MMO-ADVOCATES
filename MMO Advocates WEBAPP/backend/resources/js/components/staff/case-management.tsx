import { useEffect, useState } from 'react';
import {
    Briefcase,
    Building,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    History,
    Phone,
    PlusCircle,
    Search,
    User as UserIcon,
    X,
    Edit3,
    ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    fetchCases,
    fetchCase,
    fetchCaseHistory,
    createCase,
    updateCase,
    createFollowUp,
    updateFollowUp,
    fetchUsers,
} from '@/services/staff-api';
import type {
    CaseRecord,
    AuditEventItem,
    FollowUpItem,
    StaffUser,
    PracticeArea,
    CaseStatus,
} from '@/types';

interface CaseManagementProps {
    initialCaseId?: number | null;
    userRole: string;
}

const PRACTICE_AREAS: PracticeArea[] = [
    'Conveyancing',
    'Civil Litigation',
    'Criminal Defense',
    'Land & Environmental',
    'Succession & Probate',
    'Small Claims',
    'Family & Divorce',
    'Commercial & Corporate',
];

const CASE_STATUSES: { value: CaseStatus; label: string }[] = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'pending_hearing', label: 'Pending Hearing' },
    { value: 'closed', label: 'Closed' },
];

export function CaseManagement({ initialCaseId, userRole }: CaseManagementProps) {
    const [cases, setCases] = useState<CaseRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Selected case details state
    const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
    const [caseHistory, setCaseHistory] = useState<AuditEventItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Modal dialogs state
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addFollowUpOpen, setAddFollowUpOpen] = useState(false);
    const [usersList, setUsersList] = useState<StaffUser[]>([]);

    // Create case form state
    const [formData, setFormData] = useState({
        client_name: '',
        client_contact: '',
        type: 'Conveyancing',
        case_number: '',
        court: '',
        status: 'open',
        opened_on: new Date().toISOString().split('T')[0],
        assigned_lawyer_id: 1,
    });

    // Follow-up form state
    const [followUpData, setFollowUpData] = useState({
        due_on: new Date().toISOString().split('T')[0],
        note: '',
        assignee_id: 1,
    });

    const isAdmin = userRole === 'admin';

    useEffect(() => {
        loadCases();
        loadStaffUsers();
    }, []);

    useEffect(() => {
        if (initialCaseId && cases.length > 0) {
            handleSelectCase(initialCaseId);
        }
    }, [initialCaseId, cases.length]);

    const loadCases = async () => {
        setLoading(true);
        try {
            const list = await fetchCases({
                search: searchTerm,
                type: filterType !== 'all' ? filterType : undefined,
                status: filterStatus !== 'all' ? filterStatus : undefined,
            });
            setCases(list);
        } catch (e) {
            console.error('Failed to load cases:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadStaffUsers = async () => {
        try {
            const users = await fetchUsers();
            setUsersList(users.filter((u) => u.is_active));
        } catch (e) {
            console.error('Failed to load staff users:', e);
        }
    };

    const handleSelectCase = async (id: number) => {
        try {
            const caseDetail = await fetchCase(id);
            setSelectedCase(caseDetail);

            setLoadingHistory(true);
            const history = await fetchCaseHistory(id);
            setCaseHistory(history);
        } catch (e) {
            console.error('Failed to fetch case detail:', e);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loadCases();
    };

    const handleCreateCaseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const created = await createCase({
                client_name: formData.client_name,
                client_contact: formData.client_contact,
                type: formData.type,
                case_number: formData.case_number || undefined,
                court: formData.court || undefined,
                status: formData.status,
                opened_on: formData.opened_on,
                assigned_lawyer_id: isAdmin ? Number(formData.assigned_lawyer_id) : undefined,
            });

            setCreateModalOpen(false);
            setFormData({
                client_name: '',
                client_contact: '',
                type: 'Conveyancing',
                case_number: '',
                court: '',
                status: 'open',
                opened_on: new Date().toISOString().split('T')[0],
                assigned_lawyer_id: 1,
            });

            await loadCases();
            handleSelectCase(created.id);
        } catch (e) {
            console.error('Failed to create case:', e);
        }
    };

    const handleEditCaseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCase) return;

        try {
            const updated = await updateCase(selectedCase.id, {
                client_name: selectedCase.client_name,
                client_contact: selectedCase.client_contact,
                court: selectedCase.court,
                status: selectedCase.status,
                type: selectedCase.type,
            });
            setSelectedCase(updated);
            setEditModalOpen(false);
            await loadCases();
        } catch (e) {
            console.error('Failed to update case:', e);
        }
    };

    const handleAddFollowUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCase) return;

        try {
            await createFollowUp(selectedCase.id, {
                due_on: followUpData.due_on,
                note: followUpData.note,
                status: 'pending',
                assignee_id: isAdmin ? Number(followUpData.assignee_id) : undefined,
            });

            setAddFollowUpOpen(false);
            setFollowUpData({
                due_on: new Date().toISOString().split('T')[0],
                note: '',
                assignee_id: 1,
            });

            // Reload this case's data
            await handleSelectCase(selectedCase.id);
        } catch (e) {
            console.error('Failed to add follow-up:', e);
        }
    };

    const handleToggleFollowUpDone = async (item: FollowUpItem) => {
        try {
            const newStatus = item.status === 'done' ? 'pending' : 'done';
            await updateFollowUp(item.id, { status: newStatus });
            if (selectedCase) {
                await handleSelectCase(selectedCase.id);
            }
        } catch (e) {
            console.error('Failed to toggle follow-up:', e);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-navy dark:text-slate-100">
                        Matter & Case Directory
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Structured litigation, conveyancing, succession and dispute records for MMO Advocates LLP
                    </p>
                </div>

                <Button
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-brand-navy hover:bg-[#16365c] text-white"
                >
                    <PlusCircle className="mr-2 size-4" />
                    Register New Matter
                </Button>
            </div>

            {/* Filter and Search Bar */}
            <Card className="border-border/80 bg-card shadow-sm">
                <CardContent className="p-4">
                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-12">
                        <div className="relative md:col-span-5">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by client, case #, court, or keyword..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 min-h-[40px] text-xs"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <select
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                }}
                                className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-blue min-h-[40px]"
                            >
                                <option value="all">All Practice Areas</option>
                                {PRACTICE_AREAS.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                }}
                                className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-blue min-h-[40px]"
                            >
                                <option value="all">All Statuses</option>
                                {CASE_STATUSES.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2 md:col-span-2">
                            <Button type="submit" variant="secondary" className="w-full text-xs min-h-[40px]">
                                Filter
                            </Button>
                            {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterType('all');
                                        setFilterStatus('all');
                                        loadCases();
                                    }}
                                    className="min-h-[40px] min-w-[40px]"
                                    title="Reset filters"
                                >
                                    <X className="size-4" />
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Split Screen: Case List (left) & Selected Case Detail (right) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Cases Table / Cards (7 cols or full width if none selected) */}
                <div className={`${selectedCase ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
                    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                        <div className="border-b border-border bg-brand-surface/70 px-4 py-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Registered Cases ({cases.length})
                            </span>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-xs text-muted-foreground">
                                Loading registered cases...
                            </div>
                        ) : cases.length === 0 ? (
                            <div className="p-8 text-center text-xs text-muted-foreground">
                                No cases match the filter criteria.
                            </div>
                        ) : (
                            <div className="divide-y divide-border/60">
                                {cases.map((c) => {
                                    const isSelected = selectedCase?.id === c.id;
                                    return (
                                        <div
                                            key={c.id}
                                            onClick={() => handleSelectCase(c.id)}
                                            className={`p-4 cursor-pointer transition ${
                                                isSelected
                                                    ? 'bg-blue-50/60 dark:bg-blue-950/30 border-l-4 border-l-brand-blue'
                                                    : 'hover:bg-muted/40'
                                            }`}
                                        >
                                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-brand-navy dark:text-sky-300">
                                                            {c.case_number}
                                                        </span>
                                                        <span className="rounded bg-brand-surface px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300 border border-border/50">
                                                            {c.type}
                                                        </span>
                                                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
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
                                                    </div>

                                                    <h3 className="font-medium text-sm text-foreground">
                                                        {c.client_name}
                                                    </h3>

                                                    {c.court && (
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Building className="size-3 shrink-0" />
                                                            <span className="truncate">{c.court}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                                                        <span>Advocate: <strong className="text-foreground">{c.assigned_lawyer?.name || 'Unassigned'}</strong></span>
                                                        <span>• Opened: {c.opened_on}</span>
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="self-start text-[11px] h-7"
                                                >
                                                    View Details →
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Case Detail Drawer / Panel (5 cols) */}
                {selectedCase && (
                    <div className="space-y-4 lg:col-span-5">
                        <Card className="border-border shadow-md">
                            <CardHeader className="border-b border-border bg-brand-surface py-3.5">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <CardTitle className="font-serif text-base text-brand-navy dark:text-slate-100">
                                            Case Overview
                                        </CardTitle>
                                        <span className="font-mono text-xs font-semibold text-brand-blue">
                                            {selectedCase.case_number}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setEditModalOpen(true)}
                                            className="h-8 text-xs"
                                        >
                                            <Edit3 className="mr-1 size-3.5" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedCase(null)}
                                            className="h-8 w-8"
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5 p-5">
                                {/* Core Details */}
                                <div className="space-y-3 rounded-lg bg-muted/40 p-3.5 border border-border/50 text-xs">
                                    <div>
                                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Client Name</span>
                                        <div className="font-medium text-sm text-foreground mt-0.5">{selectedCase.client_name}</div>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <Phone className="size-3.5 text-muted-foreground shrink-0" />
                                        <span>{selectedCase.client_contact}</span>
                                    </div>

                                    {selectedCase.court && (
                                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                            <Building className="size-3.5 text-muted-foreground shrink-0" />
                                            <span>{selectedCase.court}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40 text-[11px]">
                                        <div>
                                            <span className="text-muted-foreground">Practice Area:</span>
                                            <div className="font-semibold text-foreground">{selectedCase.type}</div>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Status:</span>
                                            <div className="font-semibold text-foreground capitalize">{selectedCase.status.replace('_', ' ')}</div>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Date Opened:</span>
                                            <div className="font-semibold text-foreground">{selectedCase.opened_on}</div>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Assigned Advocate:</span>
                                            <div className="font-semibold text-foreground">{selectedCase.assigned_lawyer?.name || 'Unassigned'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Follow-ups for this Case */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                            Follow-up Tasks ({selectedCase.follow_ups?.length || 0})
                                        </h4>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setAddFollowUpOpen(true)}
                                            className="h-7 text-xs"
                                        >
                                            <PlusCircle className="mr-1 size-3" />
                                            Add Task
                                        </Button>
                                    </div>

                                    {(!selectedCase.follow_ups || selectedCase.follow_ups.length === 0) ? (
                                        <div className="rounded border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                                            No follow-ups recorded for this matter. Click "+ Add Task" to record court appearances or document deadlines.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedCase.follow_ups.map((f) => (
                                                <div
                                                    key={f.id}
                                                    className={`rounded border p-2.5 text-xs transition ${
                                                        f.status === 'done'
                                                            ? 'border-border/60 bg-muted/30 opacity-75'
                                                            : 'border-border bg-card shadow-xs'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <Badge
                                                                    variant={f.status === 'done' ? 'secondary' : 'default'}
                                                                    className="text-[9px] py-0 px-1"
                                                                >
                                                                    {f.status === 'done' ? 'Completed' : `Due: ${f.due_on}`}
                                                                </Badge>
                                                                {f.assignee && (
                                                                    <span className="text-[10px] text-muted-foreground">
                                                                        • {f.assignee.name}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={`text-xs ${f.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                                                {f.note}
                                                            </p>
                                                        </div>

                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleToggleFollowUpDone(f)}
                                                            className="h-6 w-6 p-0"
                                                            title={f.status === 'done' ? 'Mark Pending' : 'Mark Done'}
                                                        >
                                                            <CheckCircle2 className={`size-4 ${f.status === 'done' ? 'text-green-600' : 'text-slate-400 hover:text-green-600'}`} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Audit History Trail */}
                                <div className="space-y-2 pt-2 border-t border-border/60">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        <History className="size-3.5" />
                                        <span>Audit History</span>
                                    </div>

                                    {loadingHistory ? (
                                        <div className="text-[11px] text-muted-foreground">Loading history...</div>
                                    ) : caseHistory.length === 0 ? (
                                        <div className="text-[11px] text-muted-foreground">Initial case creation logged.</div>
                                    ) : (
                                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                            {caseHistory.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between rounded bg-muted/30 px-2 py-1 text-[11px]">
                                                    <div className="font-mono text-slate-800 dark:text-slate-200">
                                                        {item.event}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {item.actor?.name || 'System'} • {item.created_at.split('T')[0]}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Modal: Create Case */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-lg text-brand-navy">
                            Register New Legal Matter
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateCaseSubmit} className="space-y-4 pt-2">
                        <div className="grid gap-2">
                            <Label htmlFor="client_name" className="text-xs font-semibold">Client Name / Corporate Entity *</Label>
                            <Input
                                id="client_name"
                                required
                                placeholder="e.g. Acme Enterprises Kenya Ltd"
                                value={formData.client_name}
                                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                className="text-xs"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="client_contact" className="text-xs font-semibold">Client Contact Phone & Email *</Label>
                            <Input
                                id="client_contact"
                                required
                                placeholder="+254 700 000 000 (legal@client.co.ke)"
                                value={formData.client_contact}
                                onChange={(e) => setFormData({ ...formData, client_contact: e.target.value })}
                                className="text-xs"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="type" className="text-xs font-semibold">Practice Area *</Label>
                                <select
                                    id="type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full rounded border border-border bg-background px-3 py-2 text-xs"
                                >
                                    {PRACTICE_AREAS.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="case_number" className="text-xs font-semibold">Case Number (optional)</Label>
                                <Input
                                    id="case_number"
                                    placeholder="e.g. MMO/CONV/2026/045"
                                    value={formData.case_number}
                                    onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                                    className="text-xs"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="court" className="text-xs font-semibold">Court / Tribunal / Registry</Label>
                            <Input
                                id="court"
                                placeholder="e.g. Milimani Commercial Courts, ArdhiSasa, ELC Kajiado"
                                value={formData.court}
                                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                                className="text-xs"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="status" className="text-xs font-semibold">Status *</Label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full rounded border border-border bg-background px-3 py-2 text-xs"
                                >
                                    {CASE_STATUSES.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="opened_on" className="text-xs font-semibold">Date Opened *</Label>
                                <Input
                                    id="opened_on"
                                    type="date"
                                    required
                                    value={formData.opened_on}
                                    onChange={(e) => setFormData({ ...formData, opened_on: e.target.value })}
                                    className="text-xs"
                                />
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="grid gap-2">
                                <Label htmlFor="assigned_lawyer" className="text-xs font-semibold">Assigned Associate Advocate</Label>
                                <select
                                    id="assigned_lawyer"
                                    value={formData.assigned_lawyer_id}
                                    onChange={(e) => setFormData({ ...formData, assigned_lawyer_id: Number(e.target.value) })}
                                    className="w-full rounded border border-border bg-background px-3 py-2 text-xs"
                                >
                                    {usersList.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-brand-navy hover:bg-[#16365c] text-white">
                                Register Matter
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Edit Case */}
            {selectedCase && (
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-lg text-brand-navy">
                                Edit Matter Details
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleEditCaseSubmit} className="space-y-4 pt-2">
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold">Client Name</Label>
                                <Input
                                    value={selectedCase.client_name}
                                    onChange={(e) => setSelectedCase({ ...selectedCase, client_name: e.target.value })}
                                    className="text-xs"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold">Client Contact</Label>
                                <Input
                                    value={selectedCase.client_contact}
                                    onChange={(e) => setSelectedCase({ ...selectedCase, client_contact: e.target.value })}
                                    className="text-xs"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold">Court / Registry</Label>
                                <Input
                                    value={selectedCase.court || ''}
                                    onChange={(e) => setSelectedCase({ ...selectedCase, court: e.target.value })}
                                    className="text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold">Status</Label>
                                    <select
                                        value={selectedCase.status}
                                        onChange={(e) => setSelectedCase({ ...selectedCase, status: e.target.value })}
                                        className="w-full rounded border border-border bg-background px-3 py-2 text-xs"
                                    >
                                        {CASE_STATUSES.map((s) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold">Practice Area</Label>
                                    <select
                                        value={selectedCase.type}
                                        onChange={(e) => setSelectedCase({ ...selectedCase, type: e.target.value })}
                                        className="w-full rounded border border-border bg-background px-3 py-2 text-xs"
                                    >
                                        {PRACTICE_AREAS.map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-brand-navy hover:bg-[#16365c] text-white">
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* Modal: Add Follow-up */}
            {selectedCase && (
                <Dialog open={addFollowUpOpen} onOpenChange={setAddFollowUpOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-lg text-brand-navy">
                                Schedule Follow-up Task
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                For {selectedCase.case_number} ({selectedCase.client_name})
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleAddFollowUpSubmit} className="space-y-4 pt-2">
                            <div className="grid gap-2">
                                <Label htmlFor="due_on" className="text-xs font-semibold">Due Date (Africa/Nairobi) *</Label>
                                <Input
                                    id="due_on"
                                    type="date"
                                    required
                                    value={followUpData.due_on}
                                    onChange={(e) => setFollowUpData({ ...followUpData, due_on: e.target.value })}
                                    className="text-xs"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="note" className="text-xs font-semibold">Action Description / Note *</Label>
                                <textarea
                                    id="note"
                                    rows={3}
                                    required
                                    placeholder="e.g. File response to chamber summons; obtain formal registry stamp."
                                    value={followUpData.note}
                                    onChange={(e) => setFollowUpData({ ...followUpData, note: e.target.value })}
                                    className="w-full rounded border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                />
                            </div>

                            {isAdmin && (
                                <div className="grid gap-2">
                                    <Label htmlFor="assignee" className="text-xs font-semibold">Assigned Advocate</Label>
                                    <select
                                        id="assignee"
                                        value={followUpData.assignee_id}
                                        onChange={(e) => setFollowUpData({ ...followUpData, assignee_id: Number(e.target.value) })}
                                        className="w-full rounded border border-border bg-background px-3 py-2 text-xs"
                                    >
                                        {usersList.map((u) => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setAddFollowUpOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-brand-navy hover:bg-[#16365c] text-white">
                                    Schedule Task
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
