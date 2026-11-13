import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-brand-cream/40 p-6 md:p-10 dark:bg-background">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <Link
                            href={home()}
                            className="group mb-3 flex flex-col items-center gap-2"
                        >
                            <div className="flex items-center justify-center rounded-lg bg-brand-surface p-2 border border-border/60 transition group-hover:border-brand-blue/50">
                                <AppLogoIcon className="h-14 w-auto object-contain" />
                            </div>
                            <span className="font-serif text-lg font-semibold tracking-wider text-brand-navy dark:text-slate-100">
                                MMO ADVOCATES LLP
                            </span>
                            <span className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">
                                Kimathi House, Nairobi
                            </span>
                        </Link>

                        <div className="mt-2 space-y-1">
                            <h1 className="font-serif text-xl font-medium text-foreground">{title}</h1>
                            {description && (
                                <p className="text-xs text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {children}

                    <div className="mt-2 flex flex-col items-center gap-3 border-t border-border/60 pt-4 text-center">
                        <Link
                            href={home()}
                            className="text-xs font-medium text-brand-blue hover:text-brand-navy hover:underline transition"
                        >
                            ← Return to Firm Website
                        </Link>
                        <p className="text-[10px] text-muted-foreground/80">
                            Confidential. Authorized advocates & staff access only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
