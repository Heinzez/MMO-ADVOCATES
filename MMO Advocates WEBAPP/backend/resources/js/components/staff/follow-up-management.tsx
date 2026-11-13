import { useEffect, useState } from 'react';
import {
    CalendarClock,
    CheckCircle2,
    Clock,
    AlertTriangle,
    PlusCircle,
    Search,
    X,
    Edit3,
    Calendar,
    Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    fetchFollowUps,
    updateFollowUp,
    createFollowUp,
    fetchCases,
    fetchUsers,
} from '@/services/staff-api';
import { getNairobiDateString } from '@/data/synthetic-fixtures';
import type { FollowUpItem, CaseRecord, StaffUser } from '@/types';

interface FollowUpManagementProps {
    onNavigateCase?: (caseId: number) => void;
    userRole: string;
}

type FilterTab = 'all' | 'overdue' | 'today' | 'upcoming' | 'done';

export function FollowUpManagement({ onNavigateCase, userRole }: FollowUpManagementProps) {
    const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
    const [cases, setCases] = useState<CaseRecord[]>([]);
    const [usersList, setUsersList] = useState<StaffUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal dialogs
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<FollowUpItem | null>(null);

    // Create form state
    const [newForm, setNewForm] = useState({
        case_id: 1,
        due_on: getNairobiDateString(0),
        note: '',
        assignee_id: 1,
    });

    const isAdmin = userRole === 'admin';
    const today = getNairobiDateString(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [tasks, caseList, users] = await Promise.all([
                fetchFollowUps(),
                fetchCases(),
                fetchUsers(),
            ]);
            setFollowUps(tasks);
            setCases(caseList);
            setUsersList(users.filter((u) => u.is_active));
            if (caseList.length > 0) {
                setNewForm((prev) => ({ ...prev, case_id: caseList[0].id }));
            }
        } catch (e) {
            console.error('Failed to load follow-up tasks:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDone = async (item: FollowUpItem) => {
        try {
            const nextStatus = item.status === 'done' ? 'pending' : 'done';
            await updateFollowUp(item.id, { status: nextStatus });
            await loadData();
        } catch (e) {
            console.error('Failed to toggle follow-up:', e);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createFollowUp(newForm.case_id, {
                due_on: newForm.due_on,
                note: newForm.note,
                status: 'pending',
                assignee_id: isAdmin ? Number(newForm.assignee_id) : undefined,
            });

            setCreateModalOpen(false);
            setNewForm({
                case_id: cases[0]?.id || 1,
                due_on: getNairobiDateString(0),
                note: '',
                assignee_id: 1,
            });
            await loadData();
        } catch (e) {
            console.error('Failed to create follow-up:', e);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            await updateFollowUp(editingItem.id, {
                due_on: editingItem.due_on,
                note: editingItem.note,
                status: editingItem.status,
            });
            setEditingItem(null);
            await loadData();
        } catch (e) {
            console.error('Failed to update follow-up:', e);
        }
    };

    // Filter calculations
    const filteredItems = followUps.filter((item) => {
        // Tab filter
        if (activeTab === 'overdue') {
            if (item.status === 'done' || item.due_on >= today) return false;
        } else if (activeTab === 'today') {
            if (item.status === 'done' || item.due_on !== today) return false;
        } else if (activeTab === 'upcoming') {
            if (item.status === 'done' || item.due_on <= today) return false;
        } else if (activeTab === 'done') {
            if (item.status !== 'done') return false;
        }

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const noteMatch = item.note.toLowerCase().includes(term);
            const clientMatch = item.case_record?.client_name?.toLowerCase().includes(term) || false;
            const caseNumMatch = item.case_record?.case_number?.toLowerCase().includes(term) || false;
            if (!noteMatch && !clientMatch && !caseNumMatch) return false;
        }

        return true;
    });

    const overdueTotal = followUps.filter((f) => f.status === 'pending' && f.due_on < today).length;
    const todayTotal = followUps.filter((f) => f.status === 'pending' && f.due_on === today).length;
    const upcomingTotal = followUps.filter((f) => f.status === 'pending' && f.due_on > today).length;
    const doneTotal = followUps.filter((f) => f.status === 'done').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-navy dark:text-slate-100">
                        Follow-up & Hearing Management
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Track upcoming court appearances, pleading deadlines, searches, and client consultations
                    </p>
                </div>

                <Button
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-brand-navy hover:bg-[#16365c] text-white"
                >
                    <PlusCircle className="mr-2 size-4" />
                    Schedule Task
                </Button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-brand-surface/70 p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('all')}
                        className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                            activeTab === 'all'
                                ? 'bg-card text-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        All ({followUps.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('overdue')}
                        className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                            activeTab === 'overdue'
                                ? 'bg-amber-100 text-amber-900 shadow-xs dark:bg-amber-950 dark:text-amber-200'
                                : 'text-amber-700 hover:text-amber-900 dark:text-amber-400'
                        }`}
                    >
                        Overdue ({overdueTotal})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('today')}
                        className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                            activeTab === 'today'
                                ? 'bg-blue-100 text-blue-900 shadow-xs dark:bg-blue-950 dark:text-blue-200'
                                : 'text-blue-700 hover:text-blue-900 dark:text-blue-400'
                        }`}
                    >
                        Due Today ({todayTotal})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('upcoming')}
                        className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                            activeTab === 'upcoming'
                                ? 'bg-card text-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Upcoming ({upcomingTotal})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('done')}
                        className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                            activeTab === 'done'
                                ? 'bg-card text-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Completed ({doneTotal})
                    </button>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search follow-ups or cases..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 text-xs min-h-[38px]"
                    />
                </div>
            </div>

            {/* Follow-up Items List */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                        Loading follow-up tasks...
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                        No follow-ups found for the selected view.
                    </div>
                ) : (
                    <div className="divide-y divide-border/60">
                        {filteredItems.map((item) => {
                            const isOverdue = item.status === 'pending' && item.due_on < today;
                            const isToday = item.status === 'pending' && item.due_on === today;

                            return (
                                <div
                                    key={item.id}
                                    className={`p-4 transition ${
                                        item.status === 'done'
                                            ? 'bg-muted/20 opacity-75'
                                            : isOverdue
                                            ? 'bg-amber-50/20 dark:bg-amber-950/10'
                                            : 'hover:bg-muted/30'
                                    }`}
                                >
                                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                        <div className="flex items-start gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleDone(item)}
                                                className="mt-0.5 rounded-full p-1 text-slate-400 hover:text-green-600 focus:outline-none transition"
                                                title={item.status === 'done' ? 'Mark Pending' : 'Mark Done'}
                                            >
                                                <CheckCircle2
                                                    className={`size-5 ${
                                                        item.status === 'done'
                                                            ? 'text-green-600 fill-green-50 dark:fill-green-950'
                                                            : 'hover:stroke-green-600'
                                                    }`}
                                                />
                                            </button>

                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {isOverdue && (
                                                        <Badge variant="destructive" className="text-[10px] py-0 px-1.5 flex items-center gap-1">
                                                            <AlertTriangle className="size-3" />
                                                            Overdue ({item.due_on})
                                                        </Badge>
                                                    )}
                                                    {isToday && (
                                                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-brand-blue text-brand-blue font-semibold">
                                                            Due Today
                                                        </Badge>
                                                    )}
                                                    {item.status === 'done' && (
                                                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5 text-muted-foreground">
                                                            Done
                                                        </Badge>
                                                    )}
                                                    {!isOverdue && !isToday && item.status !== 'done' && (
                                                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-muted-foreground">
                                                            Due: {item.due_on}
                                                        </Badge>
                                                    )}

                                                    {item.case_record && (
                                                        <span
                                                            onClick={() => onNavigateCase && onNavigateCase(item.case_id)}
                                                            className="cursor-pointer font-mono text-xs font-semibold text-brand-navy hover:underline dark:text-sky-300"
                                                        >
                                                            {item.case_record.case_number}
                                                        </span>
                                                    )}

                                                    {item.case_record?.client_name && (
                                                        <span className="text-xs text-muted-foreground">
                                                            • {item.case_record.client_name}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className={`text-xs text-foreground ${item.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                                                    {item.note}
                                                </p>

                                                {item.assignee && (
                                                    <div className="text-[11px] text-muted-foreground">
                                                        Assigned Advocate: <span className="font-medium text-foreground">{item.assignee.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingItem(item)}
                                                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                                            >
                                                <Edit3 className="mr-1 size-3" />
                                                Edit
                                            </Button>
                                            {item.case_record && onNavigateCase && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onNavigateCase(item.case_id)}
                                                    className="h-7 text-xs"
                                                >
                                                    Matter →
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal: Schedule Follow-up */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-lg text-brand-navy">
                            Schedule Follow-up Task
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
                        <div className="grid gap-2">
                            <Label htmlFor="case_id" className="text-xs font-semibold">Select Case Matter *</Label>
                            <select
                                id="case_id"
                                value={newForm.case_id}
                                onChange={(e) => setNewForm({ ...newForm, case_id: Number(e.target.value) })}
                                className="w-full rounded border border-border bg-background px-3 py-2 text-xs"
                            >
                                {cases.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.case_number} — {c.client_name} ({c.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="due_on" className="text-xs font-semibold">Due Date (Africa/Nairobi) *</Label>
                            <Input
                                id="due_on"
                                type="date"
                                required
                                value={newForm.due_on}
                                onChange={(e) => setNewForm({ ...newForm, due_on: e.target.value })}
                                className="text-xs"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="note" className="text-xs font-semibold">Action Note / Court Directive *</Label>
                            <textarea
                                id="note"
                                rows={3}
                                required
                                placeholder="Describe required action (e.g. Extract formal decree; serve notice of appeal)."
                                value={newForm.note}
                                onChange={(e) => setNewForm({ ...newForm, note: e.target.value })}
                                className="w-full rounded border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-blue"
                            />
                        </div>

                        {isAdmin && (
                            <div className="grid gap-2">
                                <Label htmlFor="assignee" className="text-xs font-semibold">Assign to Advocate</Label>
                                <select
                                    id="assignee"
                                    value={newForm.assignee_id}
                                    onChange={(e) => setNewForm({ ...newForm, assignee_id: Number(e.target.value) })}
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
                                Save Task
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Edit Follow-up */}
            {editingItem && (
                <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-lg text-brand-navy">
                                Edit Task Details
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold">Due Date</Label>
                                <Input
                                    type="date"
                                    value={editingItem.due_on}
                                    onChange={(e) => setEditingItem({ ...editingItem, due_on: e.target.value })}
                                    className="text-xs"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold">Action Note</Label>
                                <textarea
                                    rows={3}
                                    value={editingItem.note}
                                    onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value })}
                                    className="w-full rounded border border-border bg-background p-2.5 text-xs"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold">Status</Label>
                                <select
                                    value={editingItem.status}
                                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as 'pending' | 'done' })}
                                    className="w-full rounded border border-border bg-background px-3 py-2 text-xs"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="done">Completed</option>
                                </select>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-brand-navy hover:bg-[#16365c] text-white">
                                    Update Task
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
