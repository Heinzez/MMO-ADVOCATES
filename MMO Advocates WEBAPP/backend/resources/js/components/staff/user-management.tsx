import { useEffect, useState } from 'react';
import {
    Users,
    UserPlus,
    Shield,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Mail,
    Lock,
    RefreshCw,
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
    DialogDescription,
} from '@/components/ui/dialog';
import { fetchUsers, createUser, setUserActive } from '@/services/staff-api';
import type { StaffUser, UserRole } from '@/types';

interface UserManagementProps {
    userRole: string;
}

export function UserManagement({ userRole }: UserManagementProps) {
    const isAdmin = userRole === 'admin';
    const [users, setUsers] = useState<StaffUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
    const [resetNotice, setResetNotice] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        role: UserRole;
    }>({
        name: '',
        email: '',
        role: 'associate',
    });

    useEffect(() => {
        if (isAdmin) {
            loadUsers();
        }
    }, [isAdmin]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const list = await fetchUsers();
            setUsers(list);
        } catch (e) {
            console.error('Failed to load users:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (user: StaffUser) => {
        setActionLoadingId(user.id);
        try {
            const updated = await setUserActive(user.id, !user.is_active);
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        } catch (e) {
            console.error('Failed to update user active status:', e);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await createUser({
                name: formData.name,
                email: formData.email,
                role: formData.role,
            });

            setCreateModalOpen(false);
            setFormData({ name: '', email: '', role: 'associate' });
            setResetNotice(`Account created for ${response.user.name}. Password activation invitation has been logged.`);
            await loadUsers();
        } catch (e) {
            console.error('Failed to create user account:', e);
        }
    };

    if (!isAdmin) {
        return (
            <Card className="border-amber-200 bg-amber-50/40 p-8 text-center dark:border-amber-900 dark:bg-amber-950/20">
                <ShieldAlert className="mx-auto mb-3 size-10 text-amber-700 dark:text-amber-400" />
                <h3 className="font-serif text-lg font-semibold text-amber-950 dark:text-amber-200">
                    Administrator Privilege Required
                </h3>
                <p className="mx-auto mt-2 max-w-md text-xs text-amber-900 dark:text-amber-300">
                    User administration, advocate account provisioning, and access revocations are strictly restricted to Managing Partners and authorized administrative staff.
                </p>
                <div className="mt-4">
                    <Badge variant="outline" className="text-xs border-amber-400 text-amber-800 dark:text-amber-300">
                        Current Session Role: {userRole}
                    </Badge>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-navy dark:text-slate-100">
                        Staff & Advocate Administration
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Manage firm credentials, associate advocate roles, and security activation states
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadUsers}
                        disabled={loading}
                        className="text-xs"
                    >
                        <RefreshCw className={`mr-1 size-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setCreateModalOpen(true)}
                        className="bg-brand-navy hover:bg-[#16365c] text-white"
                    >
                        <UserPlus className="mr-2 size-4" />
                        Provision User Account
                    </Button>
                </div>
            </div>

            {resetNotice && (
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-xs text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                        <span>{resetNotice}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setResetNotice(null)}
                        className="text-green-700 hover:text-green-900 font-bold"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Users Directory Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="border-b border-border bg-brand-surface/70 px-4 py-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Firm Advocates & Staff Directory ({users.length})
                    </span>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                        Loading authorized staff accounts...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-border bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">Advocate / Staff Name</th>
                                    <th className="px-4 py-3">Official Email</th>
                                    <th className="px-4 py-3">Role Authority</th>
                                    <th className="px-4 py-3">Account Status</th>
                                    <th className="px-4 py-3 text-right">Access Controls</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-muted/40 transition">
                                        <td className="px-4 py-3.5 font-medium text-foreground">
                                            {u.name}
                                        </td>
                                        <td className="px-4 py-3.5 text-muted-foreground font-mono text-[11px]">
                                            {u.email}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <Badge
                                                variant={
                                                    u.role === 'admin'
                                                        ? 'default'
                                                        : u.role === 'associate'
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                                className={`text-[10px] capitalize font-medium ${
                                                    u.role === 'admin'
                                                        ? 'bg-brand-navy text-white'
                                                        : u.role === 'associate'
                                                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300'
                                                        : 'text-slate-600'
                                                }`}
                                            >
                                                {u.role === 'admin' ? 'Managing Partner (Admin)' : u.role}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                    u.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                                }`}
                                            >
                                                <span className={`size-1.5 rounded-full ${u.is_active ? 'bg-green-600' : 'bg-red-600'}`} />
                                                {u.is_active ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <Button
                                                size="sm"
                                                variant={u.is_active ? 'outline' : 'default'}
                                                disabled={actionLoadingId === u.id}
                                                onClick={() => handleToggleActive(u)}
                                                className={`h-7 text-[11px] ${
                                                    !u.is_active
                                                        ? 'bg-green-700 hover:bg-green-800 text-white'
                                                        : 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40'
                                                }`}
                                            >
                                                {u.is_active ? 'Deactivate Access' : 'Reactivate Account'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal: Create User */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-lg text-brand-navy">
                            Provision Advocate / Staff Account
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Create official credentials for practice portal access
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-xs font-semibold">Full Legal Name *</Label>
                            <Input
                                id="name"
                                required
                                placeholder="e.g. Joy Muthoni Mwangi"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="text-xs"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-semibold">Official Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="j.muthoni@mmoadvocates.co.ke"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="text-xs"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role" className="text-xs font-semibold">Role Authority *</Label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground"
                            >
                                <option value="associate">Associate Advocate (Case assignment & follow-ups)</option>
                                <option value="admin">Managing Partner / Admin (Full firm oversight)</option>
                                <option value="staff">Administrative Staff (Support tasks)</option>
                            </select>
                        </div>

                        <div className="rounded border border-border/80 bg-brand-surface p-3 text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                                <Lock className="size-3 text-brand-navy" />
                                <span>Security Protocol Notice</span>
                            </div>
                            <p className="mt-1">
                                An initial temporary password and activation reset link will be sent to the advocate's official address upon account generation.
                            </p>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-brand-navy hover:bg-[#16365c] text-white">
                                Provision Account
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
