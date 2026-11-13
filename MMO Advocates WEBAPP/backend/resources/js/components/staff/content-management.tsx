import { useEffect, useState } from 'react';
import {
    FileText,
    PlusCircle,
    CheckCircle2,
    Eye,
    Globe,
    Edit3,
    ArrowUpRight,
    RefreshCw,
    X,
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
import {
    fetchContent,
    createContentItem,
    updateContentItem,
    publishContentItem,
} from '@/services/staff-api';
import type { PublicContentItem } from '@/types';

interface ContentManagementProps {
    userRole: string;
}

export function ContentManagement({ userRole }: ContentManagementProps) {
    const [items, setItems] = useState<PublicContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewItem, setPreviewItem] = useState<PublicContentItem | null>(null);
    const [editingItem, setEditingItem] = useState<PublicContentItem | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    // Create form state
    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        body: '',
    });

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setLoading(true);
        try {
            const list = await fetchContent();
            setItems(list);
        } catch (e) {
            console.error('Failed to load content items:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createContentItem({
                slug: formData.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'),
                title: formData.title,
                body: formData.body,
            });

            setCreateModalOpen(false);
            setFormData({ slug: '', title: '', body: '' });
            await loadContent();
        } catch (e) {
            console.error('Failed to create content item:', e);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            await updateContentItem(editingItem.id, {
                slug: editingItem.slug,
                title: editingItem.title,
                body: editingItem.body,
            });
            setEditingItem(null);
            await loadContent();
        } catch (e) {
            console.error('Failed to update content item:', e);
        }
    };

    const handlePublish = async (item: PublicContentItem) => {
        if (!confirm(`Are you sure you want to publish "${item.title}" to the live public firm website?`)) {
            return;
        }

        setActionLoadingId(item.id);
        try {
            await publishContentItem(item.id);
            await loadContent();
        } catch (e) {
            console.error('Failed to publish content item:', e);
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-navy dark:text-slate-100">
                        Public Website Content & Editorial Controls
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Draft, review, preview, and publish legal guides, practice notes, and firm notices to the public portal
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadContent}
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
                        <PlusCircle className="mr-2 size-4" />
                        Create Content Item
                    </Button>
                </div>
            </div>

            {/* Content List & Preview Split */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Content Directory Table (7 cols or full if no preview) */}
                <div className={`${previewItem ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4`}>
                    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                        <div className="border-b border-border bg-brand-surface/70 px-4 py-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Editorial Content Items ({items.length})
                            </span>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-xs text-muted-foreground">
                                Loading content items...
                            </div>
                        ) : items.length === 0 ? (
                            <div className="p-8 text-center text-xs text-muted-foreground">
                                No content items created yet.
                            </div>
                        ) : (
                            <div className="divide-y divide-border/60">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-4 transition ${
                                            previewItem?.id === item.id
                                                ? 'bg-blue-50/60 dark:bg-blue-950/30 border-l-4 border-l-brand-blue'
                                                : 'hover:bg-muted/30'
                                        }`}
                                    >
                                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs text-muted-foreground">
                                                        /{item.slug}
                                                    </span>
                                                    <Badge
                                                        variant={item.status === 'published' ? 'default' : 'secondary'}
                                                        className={`text-[10px] capitalize font-medium ${
                                                            item.status === 'published'
                                                                ? 'bg-green-700 text-white'
                                                                : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </Badge>
                                                </div>

                                                <h3 className="font-serif text-base font-medium text-foreground">
                                                    {item.title}
                                                </h3>

                                                <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                                                    {item.body}
                                                </p>

                                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                                                    <span>Editor: <strong className="text-foreground">{item.editor?.name || 'Staff'}</strong></span>
                                                    {item.published_at && (
                                                        <span>• Published: {item.published_at.split('T')[0]}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0 shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setPreviewItem(item)}
                                                    className="h-7 text-[11px]"
                                                >
                                                    <Eye className="mr-1 size-3" />
                                                    Preview
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingItem(item)}
                                                    className="h-7 text-[11px]"
                                                >
                                                    <Edit3 className="mr-1 size-3" />
                                                    Edit
                                                </Button>
                                                {item.status === 'draft' && (
                                                    <Button
                                                        size="sm"
                                                        disabled={actionLoadingId === item.id}
                                                        onClick={() => handlePublish(item)}
                                                        className="h-7 bg-brand-navy hover:bg-[#16365c] text-white text-[11px]"
                                                    >
                                                        <Globe className="mr-1 size-3" />
                                                        Publish
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Editorial Live Preview Panel (6 cols) */}
                {previewItem && (
                    <div className="space-y-4 lg:col-span-6">
                        <Card className="border-border shadow-md">
                            <CardHeader className="border-b border-border bg-brand-surface py-3.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Eye className="size-4 text-brand-blue" />
                                        <CardTitle className="font-serif text-sm font-semibold text-brand-navy dark:text-slate-100">
                                            Live Public Article Preview
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {previewItem.status === 'draft' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handlePublish(previewItem)}
                                                className="h-7 bg-green-700 hover:bg-green-800 text-white text-xs"
                                            >
                                                Publish Now
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setPreviewItem(null)}
                                            className="h-7 w-7"
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 space-y-4 bg-brand-cream/50 dark:bg-card">
                                <div className="rounded border border-amber-300/40 bg-amber-50/70 p-2 text-center text-[11px] text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                                    Visual rendering in authentic MMO Advocates public typography (Cinzel / Serif headings & Instrument Sans)
                                </div>

                                <div className="space-y-3">
                                    <span className="font-mono text-xs uppercase tracking-wider text-brand-gold font-semibold">
                                        MMO Advocates LLP • Practice Note
                                    </span>
                                    <h1 className="font-serif text-2xl font-bold leading-tight text-brand-navy dark:text-slate-100">
                                        {previewItem.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground border-b border-border/60 pb-3">
                                        <span>Kimathi House, Nairobi</span>
                                        <span>•</span>
                                        <span>Public Article URL: <code className="text-brand-blue">/public-content/{previewItem.slug}</code></span>
                                    </div>
                                </div>

                                <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-800 dark:text-slate-200 space-y-3 whitespace-pre-line">
                                    {previewItem.body}
                                </div>

                                <div className="rounded bg-brand-surface p-4 border border-border/80 text-xs">
                                    <h4 className="font-serif font-semibold text-brand-navy dark:text-slate-100">
                                        Legal Representation & Consultations
                                    </h4>
                                    <p className="text-muted-foreground mt-1 text-[11px]">
                                        For bespoke legal counsel regarding this matter, contact MMO Advocates LLP at Suite 807, Kimathi House, Nairobi. Call 0725 144 472.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Modal: Create Content Item */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-lg text-brand-navy">
                            Create Public Website Content
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Draft an article or legal note for the firm's website
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-xs font-semibold">Article Title *</Label>
                            <Input
                                id="title"
                                required
                                placeholder="e.g. Commercial Conveyancing Protocols in Nairobi"
                                value={formData.title}
                                onChange={(e) => {
                                    const title = e.target.value;
                                    setFormData({
                                        ...formData,
                                        title,
                                        slug: formData.slug || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
                                    });
                                }}
                                className="text-xs"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug" className="text-xs font-semibold">Public URL Slug (kebab-case) *</Label>
                            <Input
                                id="slug"
                                required
                                placeholder="e.g. commercial-conveyancing-protocols"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="body" className="text-xs font-semibold">Article Body Content *</Label>
                            <textarea
                                id="body"
                                rows={8}
                                required
                                placeholder="Write the legal article, procedural guidelines, or client advisory notice..."
                                value={formData.body}
                                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                className="w-full rounded border border-border bg-background p-3 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-brand-blue"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-brand-navy hover:bg-[#16365c] text-white">
                                Save as Draft
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Edit Content Item */}
            {editingItem && (
                <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-lg text-brand-navy">
                                Edit Content Item
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold">Title</Label>
                                <Input
                                    value={editingItem.title}
                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                    className="text-xs"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold">Slug</Label>
                                <Input
                                    value={editingItem.slug}
                                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                                    className="text-xs font-mono"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold">Body Content</Label>
                                <textarea
                                    rows={8}
                                    value={editingItem.body}
                                    onChange={(e) => setEditingItem({ ...editingItem, body: e.target.value })}
                                    className="w-full rounded border border-border bg-background p-3 text-xs leading-relaxed"
                                />
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
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
        </div>
    );
}
