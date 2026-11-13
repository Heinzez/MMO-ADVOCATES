import {
    CaseRecord,
    FollowUpItem,
    StaffUser,
    PublicContentItem,
    DashboardData,
    AuditEventItem,
    CaseFilterOptions,
} from '@/types';
import {
    SYNTHETIC_CASES,
    SYNTHETIC_FOLLOW_UPS,
    SYNTHETIC_USERS,
    SYNTHETIC_CONTENT,
    SYNTHETIC_AUDIT_LOGS,
    getSyntheticDashboardData,
    getNairobiDateString,
} from '@/data/synthetic-fixtures';

export type ApiConnectionMode = 'live' | 'fixture';

let currentMode: ApiConnectionMode = 'fixture';
const listeners: Array<(mode: ApiConnectionMode) => void> = [];

export function getApiMode(): ApiConnectionMode {
    return currentMode;
}

export function onApiModeChange(listener: (mode: ApiConnectionMode) => void): () => void {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index >= 0) listeners.splice(index, 1);
    };
}

function setApiMode(mode: ApiConnectionMode) {
    if (currentMode !== mode) {
        currentMode = mode;
        listeners.forEach((l) => l(mode));
    }
}

// In-memory clones for fixture mutations
let fixtureCases: CaseRecord[] = JSON.parse(JSON.stringify(SYNTHETIC_CASES));
let fixtureFollowUps: FollowUpItem[] = JSON.parse(JSON.stringify(SYNTHETIC_FOLLOW_UPS));
let fixtureUsers: StaffUser[] = JSON.parse(JSON.stringify(SYNTHETIC_USERS));
let fixtureContent: PublicContentItem[] = JSON.parse(JSON.stringify(SYNTHETIC_CONTENT));
let fixtureAudit: AuditEventItem[] = JSON.parse(JSON.stringify(SYNTHETIC_AUDIT_LOGS));

function getXsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(options.headers as Record<string, string> || {}),
    };

    const token = getXsrfToken();
    if (token) {
        headers['X-XSRF-TOKEN'] = token;
    }

    if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

// -------------------------------------------------------------
// Dashboard Data
// -------------------------------------------------------------
export async function fetchDashboardData(): Promise<DashboardData> {
    try {
        const data = await request<DashboardData>('/staff/dashboard');
        if (data && Array.isArray(data.today) && Array.isArray(data.overdue)) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback to fixture
    }

    setApiMode('fixture');
    const today = getNairobiDateString(0);
    const todayItems = fixtureFollowUps.filter((f) => f.status === 'pending' && f.due_on === today);
    const overdueItems = fixtureFollowUps.filter((f) => f.status === 'pending' && f.due_on < today);

    return {
        date: today,
        timezone: 'Africa/Nairobi',
        today: todayItems,
        overdue: overdueItems,
    };
}

// -------------------------------------------------------------
// Cases
// -------------------------------------------------------------
export async function fetchCases(filters?: CaseFilterOptions): Promise<CaseRecord[]> {
    try {
        const params = new URLSearchParams();
        if (filters?.search) params.set('search', filters.search);
        if (filters?.type) params.set('type', filters.type);
        if (filters?.status) params.set('status', filters.status);
        if (filters?.follow_up_on) params.set('follow_up_on', filters.follow_up_on);

        const url = `/staff/cases${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await request<CaseRecord[]>(url);
        if (Array.isArray(data)) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback to fixture
    }

    setApiMode('fixture');
    let results = [...fixtureCases];

    if (filters?.search) {
        const term = filters.search.toLowerCase();
        results = results.filter(
            (c) =>
                c.client_name.toLowerCase().includes(term) ||
                (c.case_number && c.case_number.toLowerCase().includes(term)) ||
                c.type.toLowerCase().includes(term) ||
                (c.court && c.court.toLowerCase().includes(term))
        );
    }
    if (filters?.type && filters.type !== 'all') {
        results = results.filter((c) => c.type.toLowerCase() === filters.type!.toLowerCase());
    }
    if (filters?.status && filters.status !== 'all') {
        results = results.filter((c) => c.status.toLowerCase() === filters.status!.toLowerCase());
    }

    return results;
}

export async function fetchCase(id: number): Promise<CaseRecord> {
    try {
        const data = await request<CaseRecord>(`/staff/cases/${id}`);
        if (data && data.id) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback to fixture
    }

    setApiMode('fixture');
    const found = fixtureCases.find((c) => c.id === id);
    if (!found) {
        throw new Error(`Case with ID ${id} not found.`);
    }

    // Attach case follow-ups
    const caseFollowUps = fixtureFollowUps.filter((f) => f.case_id === id);
    return {
        ...found,
        follow_ups: caseFollowUps,
    };
}

export async function fetchCaseHistory(id: number): Promise<AuditEventItem[]> {
    try {
        const data = await request<AuditEventItem[]>(`/staff/cases/${id}/history`);
        if (Array.isArray(data)) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback to fixture
    }

    setApiMode('fixture');
    return fixtureAudit.filter((a) => a.subject_id === id);
}

export async function createCase(caseData: {
    client_name: string;
    client_contact: string;
    type: string;
    case_number?: string | null;
    court?: string | null;
    status: string;
    opened_on: string;
    assigned_lawyer_id?: number;
}): Promise<CaseRecord> {
    try {
        const data = await request<CaseRecord>('/staff/cases', {
            method: 'POST',
            body: JSON.stringify(caseData),
        });
        if (data && data.id) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback to fixture
    }

    setApiMode('fixture');
    const newId = Math.max(0, ...fixtureCases.map((c) => c.id)) + 1;
    const assignedUser = fixtureUsers.find((u) => u.id === (caseData.assigned_lawyer_id || 1));
    const created: CaseRecord = {
        id: newId,
        client_name: caseData.client_name,
        client_contact: caseData.client_contact,
        type: caseData.type,
        case_number: caseData.case_number || `MMO/${caseData.type.substring(0, 4).toUpperCase()}/2026/0${newId}`,
        court: caseData.court || null,
        status: caseData.status,
        opened_on: caseData.opened_on,
        assigned_lawyer_id: caseData.assigned_lawyer_id || 1,
        assigned_lawyer: assignedUser ? { id: assignedUser.id, name: assignedUser.name } : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    fixtureCases.unshift(created);
    fixtureAudit.unshift({
        id: Date.now(),
        event: 'case.created',
        actor: { id: 1, name: 'Morris M. Ondego' },
        subject_type: 'case',
        subject_id: newId,
        created_at: new Date().toISOString(),
    });

    return created;
}

export async function updateCase(
    id: number,
    patchData: Partial<CaseRecord>
): Promise<CaseRecord> {
    try {
        const data = await request<CaseRecord>(`/staff/cases/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(patchData),
        });
        if (data && data.id) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback to fixture
    }

    setApiMode('fixture');
    const index = fixtureCases.findIndex((c) => c.id === id);
    if (index >= 0) {
        fixtureCases[index] = {
            ...fixtureCases[index],
            ...patchData,
            updated_at: new Date().toISOString(),
        };
        fixtureAudit.unshift({
            id: Date.now(),
            event: 'case.updated',
            actor: { id: 1, name: 'Current User' },
            subject_type: 'case',
            subject_id: id,
            created_at: new Date().toISOString(),
        });
        return fixtureCases[index];
    }
    throw new Error('Case not found');
}

// -------------------------------------------------------------
// Follow-ups
// -------------------------------------------------------------
export async function fetchFollowUps(caseId?: number): Promise<FollowUpItem[]> {
    if (caseId) {
        try {
            const data = await request<FollowUpItem[]>(`/staff/cases/${caseId}/follow-ups`);
            if (Array.isArray(data)) {
                setApiMode('live');
                return data;
            }
        } catch {
            // Fallback
        }
    }

    setApiMode('fixture');
    if (caseId) {
        return fixtureFollowUps.filter((f) => f.case_id === caseId);
    }
    return [...fixtureFollowUps];
}

export async function createFollowUp(
    caseId: number,
    followUpData: {
        due_on: string;
        note: string;
        status?: 'pending' | 'done';
        assignee_id?: number;
    }
): Promise<FollowUpItem> {
    try {
        const data = await request<FollowUpItem>(`/staff/cases/${caseId}/follow-ups`, {
            method: 'POST',
            body: JSON.stringify(followUpData),
        });
        if (data && data.id) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback
    }

    setApiMode('fixture');
    const targetCase = fixtureCases.find((c) => c.id === caseId);
    const assignedUser = fixtureUsers.find((u) => u.id === (followUpData.assignee_id || 1));
    const newId = Math.max(0, ...fixtureFollowUps.map((f) => f.id)) + 1;

    const created: FollowUpItem = {
        id: newId,
        case_id: caseId,
        assignee_id: followUpData.assignee_id || 1,
        due_on: followUpData.due_on,
        note: followUpData.note,
        status: followUpData.status || 'pending',
        case_record: targetCase
            ? {
                  id: targetCase.id,
                  client_name: targetCase.client_name,
                  case_number: targetCase.case_number,
                  assigned_lawyer_id: targetCase.assigned_lawyer_id,
              }
            : undefined,
        assignee: assignedUser ? { id: assignedUser.id, name: assignedUser.name } : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    fixtureFollowUps.unshift(created);
    return created;
}

export async function updateFollowUp(
    id: number,
    patchData: {
        due_on?: string;
        note?: string;
        status?: 'pending' | 'done';
        assignee_id?: number;
    }
): Promise<FollowUpItem> {
    try {
        const data = await request<FollowUpItem>(`/staff/follow-ups/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(patchData),
        });
        if (data && data.id) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback
    }

    setApiMode('fixture');
    const index = fixtureFollowUps.findIndex((f) => f.id === id);
    if (index >= 0) {
        fixtureFollowUps[index] = {
            ...fixtureFollowUps[index],
            ...patchData,
            updated_at: new Date().toISOString(),
        };
        return fixtureFollowUps[index];
    }
    throw new Error('Follow-up not found');
}

// -------------------------------------------------------------
// Users (Admin Only)
// -------------------------------------------------------------
export async function fetchUsers(): Promise<StaffUser[]> {
    try {
        const data = await request<StaffUser[]>('/staff/users');
        if (Array.isArray(data)) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback
    }

    setApiMode('fixture');
    return [...fixtureUsers];
}

export async function createUser(userData: {
    name: string;
    email: string;
    role: 'admin' | 'associate' | 'staff';
}): Promise<{ user: StaffUser; password_reset_requested: boolean }> {
    try {
        const data = await request<{ user: StaffUser; password_reset_requested: boolean }>(
            '/staff/users',
            {
                method: 'POST',
                body: JSON.stringify(userData),
            }
        );
        if (data && data.user) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback
    }

    setApiMode('fixture');
    const newId = Math.max(0, ...fixtureUsers.map((u) => u.id)) + 1;
    const created: StaffUser = {
        id: newId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        is_active: true,
        created_at: new Date().toISOString(),
    };
    fixtureUsers.push(created);

    return {
        user: created,
        password_reset_requested: true,
    };
}

export async function setUserActive(userId: number, isActive: boolean): Promise<StaffUser> {
    try {
        const data = await request<StaffUser>(`/staff/users/${userId}/active`, {
            method: 'PATCH',
            body: JSON.stringify({ is_active: isActive }),
        });
        if (data && data.id) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback
    }

    setApiMode('fixture');
    const user = fixtureUsers.find((u) => u.id === userId);
    if (user) {
        user.is_active = isActive;
        return { ...user };
    }
    throw new Error('User not found');
}

// -------------------------------------------------------------
// Public Content Management
// -------------------------------------------------------------
export async function fetchContent(): Promise<PublicContentItem[]> {
    try {
        const data = await request<PublicContentItem[]>('/staff/content');
        if (Array.isArray(data)) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback
    }

    setApiMode('fixture');
    return [...fixtureContent];
}

export async function createContentItem(itemData: {
    slug: string;
    title: string;
    body: string;
}): Promise<PublicContentItem> {
    try {
        const data = await request<PublicContentItem>('/staff/content', {
            method: 'POST',
            body: JSON.stringify(itemData),
        });
        if (data && data.id) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback
    }

    setApiMode('fixture');
    const newId = Math.max(0, ...fixtureContent.map((c) => c.id)) + 1;
    const created: PublicContentItem = {
        id: newId,
        slug: itemData.slug,
        title: itemData.title,
        body: itemData.body,
        status: 'draft',
        updated_by: 1,
        editor: { id: 1, name: 'Morris M. Ondego' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    fixtureContent.unshift(created);
    return created;
}

export async function updateContentItem(
    id: number,
    itemData: {
        slug?: string;
        title?: string;
        body?: string;
    }
): Promise<PublicContentItem> {
    try {
        const data = await request<PublicContentItem>(`/staff/content/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(itemData),
        });
        if (data && data.id) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback
    }

    setApiMode('fixture');
    const index = fixtureContent.findIndex((c) => c.id === id);
    if (index >= 0) {
        fixtureContent[index] = {
            ...fixtureContent[index],
            ...itemData,
            updated_at: new Date().toISOString(),
        };
        return fixtureContent[index];
    }
    throw new Error('Content item not found');
}

export async function publishContentItem(id: number): Promise<PublicContentItem> {
    try {
        const data = await request<PublicContentItem>(`/staff/content/${id}/publish`, {
            method: 'POST',
        });
        if (data && data.id) {
            setApiMode('live');
            return data;
        }
    } catch {
        // Fallback
    }

    setApiMode('fixture');
    const index = fixtureContent.findIndex((c) => c.id === id);
    if (index >= 0) {
        const item = fixtureContent[index];
        fixtureContent[index] = {
            ...item,
            status: 'published',
            published_slug: item.slug,
            published_title: item.title,
            published_body: item.body,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        return fixtureContent[index];
    }
    throw new Error('Content item not found');
}
