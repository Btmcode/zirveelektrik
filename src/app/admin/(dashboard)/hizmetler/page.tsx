"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plug,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertTriangle,
  Star,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/components/admin/api-client";
import { EmptyState } from "@/components/admin/empty-state";
import { PageHeader } from "@/components/admin/page-header";
import { Field, FormGrid } from "@/components/admin/form-field";
import { getIcon } from "@/components/site/icon-map";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { serviceUpsertSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils-format";

type ServiceFormValues = z.input<typeof serviceUpsertSchema>;
type ServiceFormOutput = z.output<typeof serviceUpsertSchema>;

interface AdminService {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  icon: string;
  priceNote: string | null;
  imageUrl: string | null;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
}

const ICON_OPTIONS = [
  "Zap", "SearchCheck", "CircuitBoard", "Activity", "Cable", "Lightbulb",
  "Plug", "ShieldCheck", "AirVent", "BellRing", "Building2", "Network",
  "BatteryCharging", "Wrench",
];

const EMPTY_VALUES: ServiceFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  icon: "Zap",
  priceNote: "",
  featured: false,
  active: true,
  sortOrder: 0,
  metaTitle: "",
  metaDescription: "",
};

function SwitchField({
  label,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <Label>{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminService[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminService | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminService | null>(null);
  const [deleting, setDeleting] = useState(false);
  const lastAutoSlug = useRef("");

  const form = useForm<ServiceFormValues, unknown, ServiceFormOutput>({
    resolver: zodResolver(serviceUpsertSchema),
    defaultValues: EMPTY_VALUES,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ services: AdminService[] }>("/api/admin/services");
      setServices(data.services);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Hizmetler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Başlıktan otomatik slug (yalnızca kullanıcı slug alanını elle değiştirmediyse)
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

  function openEdit(service: AdminService) {
    setEditing(service);
    lastAutoSlug.current = "";
    form.reset({
      title: service.title,
      slug: service.slug,
      excerpt: service.excerpt,
      content: service.content,
      icon: service.icon,
      priceNote: service.priceNote ?? "",
      imageUrl: service.imageUrl ?? "",
      featured: service.featured,
      active: service.active,
      sortOrder: service.sortOrder,
      metaTitle: service.metaTitle ?? "",
      metaDescription: service.metaDescription ?? "",
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: ServiceFormOutput) {
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/api/admin/services/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        });
        toast.success("Hizmet güncellendi");
      } else {
        await apiFetch("/api/admin/services", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Hizmet oluşturuldu");
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
      await apiFetch(`/api/admin/services/${deleteTarget.id}`, { method: "DELETE" });
      toast.success("Hizmet silindi");
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
        title="Hizmetler"
        description="Sitedeki hizmet sayfalarını yönetin"
        action={
          <Button onClick={openCreate}>
            <Plus aria-hidden="true" />
            Yeni Hizmet
          </Button>
        }
      />

      {loading && !services ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : services && services.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <div key={service.id} className={service.active ? "" : "opacity-60"}>
              <Card>
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                      <Icon className="size-5 text-amber-600" aria-hidden="true" />
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {service.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                          <Star className="size-3" aria-hidden="true" />
                          Öne Çıkan
                        </span>
                      ) : null}
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                          service.active ? "bg-emerald-100 text-emerald-900" : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {service.active ? "Aktif" : "Pasif"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-snug">{service.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{service.excerpt}</p>
                    <p className="font-mono text-xs text-muted-foreground">/{service.slug}</p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={() => openEdit(service)}>
                      <Pencil aria-hidden="true" />
                      Düzenle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(service)}
                      aria-label={`${service.title} hizmetini sil`}
                    >
                      <Trash2 className="text-destructive" aria-hidden="true" />
                      Sil
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Plug}
          title="Henüz hizmet yok"
          description="İlk hizmet sayfasını oluşturarak başlayın."
          action={
            <Button onClick={openCreate}>
              <Plus aria-hidden="true" />
              Yeni Hizmet
            </Button>
          }
        />
      )}

      {/* Oluşturma / düzenleme diyaloğu */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && setDialogOpen(false)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Hizmeti Düzenle" : "Yeni Hizmet"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Hizmet bilgilerini güncelleyin."
                : "Yeni bir hizmet sayfası oluşturun."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormGrid>
              <Field label="Başlık" error={errors.title?.message}>
                <Input {...form.register("title")} placeholder="Sigorta Arızaları" aria-invalid={Boolean(errors.title)} />
              </Field>
              <Field
                label="Slug"
                error={errors.slug?.message}
                hint="Başlıktan otomatik üretilir, düzenlenebilir"
              >
                <Input {...form.register("slug")} placeholder="sigorta-arizalari" className="font-mono" aria-invalid={Boolean(errors.slug)} />
              </Field>
            </FormGrid>

            <Field label="Kısa Özet" error={errors.excerpt?.message}>
              <Textarea
                {...form.register("excerpt")}
                placeholder="Liste kartlarında görünen kısa açıklama..."
                className="h-20"
                aria-invalid={Boolean(errors.excerpt)}
              />
            </Field>

            <Field label="İçerik" error={errors.content?.message} hint="Markdown desteklenir (**kalın**, ## başlık, - liste)">
              <Textarea
                {...form.register("content")}
                placeholder="Hizmet detay içeriği..."
                className="h-64"
                aria-invalid={Boolean(errors.content)}
              />
            </Field>

            <FormGrid>
              <Field label="İkon" error={errors.icon?.message}>
                <Controller
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <Select value={field.value ?? "Zap"} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full" aria-label="İkon seç">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field label="Fiyat Notu" error={errors.priceNote?.message}>
                <Input {...form.register("priceNote")} placeholder="Keşif sonrası fiyat" />
              </Field>
            </FormGrid>

            <FormGrid>
              <SwitchField
                label="Öne Çıkan"
                checked={Boolean(form.watch("featured"))}
                onCheckedChange={(checked) => form.setValue("featured", checked)}
                disabled={saving}
              />
              <SwitchField
                label="Aktif"
                checked={Boolean(form.watch("active"))}
                onCheckedChange={(checked) => form.setValue("active", checked)}
                disabled={saving}
              />
            </FormGrid>

            <Field label="Sıralama" error={errors.sortOrder?.message} hint="Küçük değer önce görünür">
              <Controller
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <Input
                    type="number"
                    min={0}
                    max={999}
                    value={Number.isFinite(field.value) ? String(field.value) : "0"}
                    onChange={(e) => {
                      const n = e.target.valueAsNumber;
                      field.onChange(Number.isNaN(n) ? 0 : n);
                    }}
                  />
                )}
              />
            </Field>

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
            <AlertDialogTitle>Hizmet silinsin mi?</AlertDialogTitle>
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

      {loading && services && services.length > 0 ? (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
          Güncelleniyor...
        </p>
      ) : null}
    </div>
  );
}
