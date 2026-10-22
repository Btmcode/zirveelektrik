"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/components/admin/api-client";
import { EmptyState } from "@/components/admin/empty-state";
import { PageHeader } from "@/components/admin/page-header";
import { Field, FormGrid } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { blogUpsertSchema } from "@/lib/validation";
import { formatDateTr, slugify } from "@/lib/utils-format";

type BlogFormValues = z.input<typeof blogUpsertSchema>;
type BlogFormOutput = z.output<typeof blogUpsertSchema>;

interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  tags: string;
  published: boolean;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
}

const EMPTY_VALUES: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "Zirve Elektrik Editör",
  tags: "",
  published: false,
  metaTitle: "",
  metaDescription: "",
};

function PublishedField({
  checked,
  onCheckedChange,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div>
        <Label>Yayında</Label>
        <p className="text-xs text-muted-foreground">Sitede herkese görünür olur</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<AdminBlogPost[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);
  const lastAutoSlug = useRef("");

  const form = useForm<BlogFormValues, unknown, BlogFormOutput>({
    resolver: zodResolver(blogUpsertSchema),
    defaultValues: EMPTY_VALUES,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ posts: AdminBlogPost[] }>("/api/admin/blog");
      setPosts(data.posts);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Blog yazıları yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const titleValue = form.watch("title");
  const slugValue = form.watch("slug");
  useEffect(() => {
    if (!dialogOpen) return;
    const auto = slugify(titleValue ?? "");
    if (!auto) return;
    if (!slugValue || slugValue === lastAutoSlug.current) {
      form.setValue("slug", auto);
      lastAutoSlug.current = auto;
    }
  }, [titleValue, dialogOpen, slugValue, form]);

  function openCreate() {
    setEditing(null);
    lastAutoSlug.current = "";
    form.reset(EMPTY_VALUES);
    setDialogOpen(true);
  }

  function openEdit(post: AdminBlogPost) {
    setEditing(post);
    lastAutoSlug.current = "";
    form.reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage ?? "",
      author: post.author,
      tags: post.tags ?? "",
      published: post.published,
      metaTitle: post.metaTitle ?? "",
      metaDescription: post.metaDescription ?? "",
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: BlogFormOutput) {
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/api/admin/blog/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        });
        toast.success("Yazı güncellendi");
      } else {
        await apiFetch("/api/admin/blog", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Yazı oluşturuldu");
      }
      setDialogOpen(false);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/admin/blog/${deleteTarget.id}`, { method: "DELETE" });
      toast.success("Yazı silindi");
      setDeleteTarget(null);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Silinemedi");
    } finally {
      setDeleting(false);
    }
  }

  const errors = form.formState.errors;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog"
        description="Sorun-çözüm yazılarını ve rehberleri yönetin"
        action={
          <Button onClick={openCreate}>
            <Plus aria-hidden="true" />
            Yeni Yazı
          </Button>
        }
      />

      {loading && !posts ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className={post.published ? "" : "opacity-70"}>
            <Card>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold leading-snug">{post.title}</h3>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        post.published
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {post.published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono">/{post.slug}</span>
                    {post.publishedAt ? ` • ${formatDateTr(post.publishedAt)}` : ""}
                    {post.tags ? ` • ${post.tags}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(post)}>
                    <Pencil aria-hidden="true" />
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(post)}
                    aria-label={`${post.title} yazısını sil`}
                  >
                    <Trash2 className="text-destructive" aria-hidden="true" />
                    Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="Henüz yazı yok"
          description="İlk blog yazısını oluşturarak başlayın."
          action={
            <Button onClick={openCreate}>
              <Plus aria-hidden="true" />
              Yeni Yazı
            </Button>
          }
        />
      )}

      {/* Oluşturma / düzenleme diyaloğu */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && setDialogOpen(false)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Yazıyı Düzenle" : "Yeni Blog Yazısı"}</DialogTitle>
            <DialogDescription>
              {editing ? "Yazı bilgilerini güncelleyin." : "Yeni bir blog yazısı oluşturun."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormGrid>
              <Field label="Başlık" error={errors.title?.message}>
                <Input {...form.register("title")} placeholder="Sigorta Sürekli Atıyor: Nedenleri ve Çözümleri" aria-invalid={Boolean(errors.title)} />
              </Field>
              <Field label="Slug" error={errors.slug?.message} hint="Başlıktan otomatik üretilir, düzenlenebilir">
                <Input {...form.register("slug")} placeholder="sigorta-surekli-atiyor" className="font-mono" aria-invalid={Boolean(errors.slug)} />
              </Field>
            </FormGrid>

            <Field label="Kısa Özet" error={errors.excerpt?.message}>
              <Textarea {...form.register("excerpt")} placeholder="Liste ve paylaşım kartlarında görünen özet..." className="h-20" aria-invalid={Boolean(errors.excerpt)} />
            </Field>

            <Field label="İçerik" error={errors.content?.message} hint="Markdown desteklenir (**kalın**, ## başlık, - liste)">
              <Textarea {...form.register("content")} placeholder="Makale içeriği..." className="h-64" aria-invalid={Boolean(errors.content)} />
            </Field>

            <FormGrid>
              <Field label="Etiketler" error={errors.tags?.message} hint="Virgülle ayırın: sigorta, pano, ipucu">
                <Input {...form.register("tags")} placeholder="sigorta, pano" />
              </Field>
              <Field label="Kapak Görseli" error={errors.coverImage?.message} hint="Örn: /images/blog/sigorta.jpg">
                <Input {...form.register("coverImage")} placeholder="/images/blog/ornek.jpg" className="font-mono" />
              </Field>
            </FormGrid>

            <PublishedField
              checked={Boolean(form.watch("published"))}
              onCheckedChange={(checked) => form.setValue("published", checked)}
              disabled={saving}
            />

            <FormGrid>
              <Field label="SEO Başlık" error={errors.metaTitle?.message}>
                <Input {...form.register("metaTitle")} placeholder="Boş bırakılırsa başlık kullanılır" />
              </Field>
              <Field label="SEO Açıklama" error={errors.metaDescription?.message}>
                <Input {...form.register("metaDescription")} placeholder="En fazla 160 karakter" />
              </Field>
            </FormGrid>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Vazgeç
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
                {editing ? "Güncelle" : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Silme onayı */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yazı silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" kalıcı olarak silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading && posts && posts.length > 0 ? (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
          Güncelleniyor...
        </p>
      ) : null}
    </div>
  );
}
