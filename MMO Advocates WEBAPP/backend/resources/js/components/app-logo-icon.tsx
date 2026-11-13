import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    alt = 'MMO Advocates LLP Logo',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/brand/logo.png"
            alt={alt}
            className={cn('size-9 object-contain', className)}
            {...props}
        />
    );
}
