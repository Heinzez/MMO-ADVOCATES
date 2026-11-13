import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded bg-brand-surface p-1 border border-border/50">
                <AppLogoIcon className="size-7 object-contain" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold text-brand-navy dark:text-slate-100 font-serif tracking-tight text-base">
                    MMO ADVOCATES
                </span>
                <span className="truncate text-xs text-muted-foreground font-sans tracking-wide">
                    Staff Practice Portal
                </span>
            </div>
        </>
    );
}
