export type CaseStatus = 'open' | 'in_progress' | 'pending_hearing' | 'closed';

export type PracticeArea =
    | 'Conveyancing'
    | 'Civil Litigation'
    | 'Criminal Defense'
    | 'Land & Environmental'
    | 'Succession & Probate'
    | 'Small Claims'
    | 'Family & Divorce'
    | 'Commercial & Corporate';

export type FollowUpStatus = 'pending' | 'done';

export type UserRole = 'admin' | 'associate' | 'staff';

export interface StaffUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface FollowUpItem {
    id: number;
    case_id: number;
    assignee_id: number;
    due_on: string; // YYYY-MM-DD
    note: string;
    status: FollowUpStatus;
    case_record?: {
        id: number;
        client_name: string;
        case_number: string | null;
        assigned_lawyer_id: number;
    };
    assignee?: {
        id: number;
        name: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface CaseRecord {
    id: number;
    case_number: string | null;
    client_name: string;
    client_contact: string;
    type: string;
    court: string | null;
    status: CaseStatus | string;
    opened_on: string;
    assigned_lawyer_id: number;
    assigned_lawyer?: {
        id: number;
        name: string;
    } | null;
    follow_ups?: FollowUpItem[];
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export interface PublicContentItem {
    id: number;
    slug: string;
    title: string;
    body: string;
    status: 'draft' | 'published';
    published_slug?: string | null;
    published_title?: string | null;
    published_body?: string | null;
    published_at?: string | null;
    updated_by: number;
    editor?: {
        id: number;
        name: string;
    } | null;
    created_at?: string;
    updated_at?: string;
}

export interface DashboardData {
    date: string;
    timezone: string;
    today: FollowUpItem[];
    overdue: FollowUpItem[];
}

export interface AuditEventItem {
    id?: number;
    event: string;
    actor?: {
        id: number;
        name: string;
    } | null;
    subject_type: 'case' | 'follow_up';
    subject_id: number;
    created_at: string;
}

export interface CaseFilterOptions {
    search?: string;
    type?: string;
    status?: string;
    follow_up_on?: string;
}
