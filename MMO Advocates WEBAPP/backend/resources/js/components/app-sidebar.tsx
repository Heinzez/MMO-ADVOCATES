import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Briefcase,
    CalendarClock,
    Users,
    FileEdit,
    Globe,
    Building2,
    Shield,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
} from '@/components/ui/sidebar';
import { dashboard, home } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const { auth } = page.props;
    const user = auth?.user;
    const userRole = (user?.role as string) || 'admin';
    const isAdmin = userRole === 'admin';

    // Determine current tab from URL search query
    let currentTab = 'overview';
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        currentTab = params.get('tab') || 'overview';
    } else if (page.url) {
        try {
            const url = new URL(page.url, 'http://localhost');
            currentTab = url.searchParams.get('tab') || 'overview';
        } catch {
            currentTab = 'overview';
        }
    }

    const mainNavItems: NavItem[] = [
        {
            title: 'Overview',
            href: dashboard.url({ query: { tab: 'overview' } }),
            icon: LayoutDashboard,
            isActive: currentTab === 'overview',
        },
        {
            title: 'Case Directory',
            href: dashboard.url({ query: { tab: 'cases' } }),
            icon: Briefcase,
            isActive: currentTab === 'cases',
        },
        {
            title: 'Follow-up Tasks',
            href: dashboard.url({ query: { tab: 'followups' } }),
            icon: CalendarClock,
            isActive: currentTab === 'followups',
        },
        ...(isAdmin
            ? [
                  {
                      title: 'User Administration',
                      href: dashboard.url({ query: { tab: 'users' } }),
                      icon: Users,
                      isActive: currentTab === 'users',
                  },
              ]
            : []),
        {
            title: 'Public Content',
            href: dashboard.url({ query: { tab: 'content' } }),
            icon: FileEdit,
            isActive: currentTab === 'content',
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Public Firm Site',
            href: home(),
            icon: Globe,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                <SidebarGroup className="mt-auto px-3 py-2">
                    <div className="rounded-lg border border-border/60 bg-brand-surface/60 p-3 text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-brand-navy dark:text-slate-200">
                            <Shield className="size-3.5 text-brand-gold" />
                            <span>Role: <span className="capitalize">{userRole}</span></span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Building2 className="size-3" />
                            <span>Kimathi House Suite 807</span>
                        </div>
                    </div>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
