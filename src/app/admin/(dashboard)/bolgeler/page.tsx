"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
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
import { districtUpsertSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils-format";

type DistrictFormValues = z.input<typeof districtUpsertSchema>;
type DistrictFormOutput = z.output<typeof districtUpsertSchema>;

interface AdminDistrict {
  id: string;
  slug: string;
  name: string;
  content: string;
  neighborhoods: string;
  side: string;
  active: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
}

const EMPTY_VALUES: DistrictFormValues = {
  name: "",
  slug: "",
  content: "",
  neighborhoods: "",
  side: "AVRUPA",
  active: true,
  metaTitle: "",
  metaDescription: "",
};

function SideBadge({ side }: { side: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
        side === "ANADOLU" ? "bg-teal-100 text-teal-900" : "bg-amber-100 text-amber-900"
      }`}
    >
      {side === "ANADOLU" ? "Anadolu" : "Avrupa"}
    </span>
  );
}

export default function AdminDistrictsPage() {
  const [districts, setDistricts] = useState<AdminDistrict[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminDistrict | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminDistrict | null>(null);
  const [deleting, setDeleting] = useState(false);
  const lastAutoSlug = useRef("");

  const form = useForm<DistrictFormValues, unknown, DistrictFormOutput>({
    resolver: zodResolver(districtUpsertSchema),
    defaultValues: EMPTY_VALUES,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ districts: AdminDistrict[] }>("/api/admin/districts");
      setDistricts(data.districts);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "İlçeler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");
  useEffect(() => {
    if (!dialogOpen) return;
    const auto = slugify(nameValue ?? "");
    if (!auto) return;
    if (!slugValue || slugValue === lastAutoSlug.current) {
      form.setValue("slug", auto);
      lastAutoSlug.current = auto;
    }
  }, [nameValue, dialogOpen, slugValue, form]);

  function openCreate() {
    setEditing(null);
    lastAutoSlug.current = "";
    form.reset(EMPTY_VALUES);
    setDialogOpen(true);
  }

  function openEdit(district: AdminDistrict) {
    setEditing(district);
    lastAutoSlug.current = "";
    form.reset({
      name: district.name,
      slug: district.slug,
      content: district.content,
      neighborhoods: district.neighborhoods ?? "",
      side: district.side === "ANADOLU" ? "ANADOLU" : "AVRUPA",
      active: district.active,
      metaTitle: district.metaTitle ?? "",
      metaDescription: district.metaDescription ?? "",
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: DistrictFormOutput) {
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/api/admin/districts/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        });
        toast.success("İlçe güncellendi");
      } else {
        await apiFetch("/api/admin/districts", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("İlçe oluşturuldu");
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
      await apiFetch(`/api/admin/districts/${deleteTarget.id}`, { method: "DELETE" });
      toast.success("İlçe silindi");
      setDeleteTarget(null);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Silinemedi");
    } finally {
      setDeleting(false);
    }
  }

  const errors = form.formState.errors;
  const neighborhoodsValue = form.watch("neighborhoods") ?? "";
  const neighborhoodCount = neighborhoodsValue.split("\n").filter((l) => l.trim()).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hizmet Bölgeleri"
        description="İlçe hizmet sayfalarını yönetin"
        action={
          <Button onClick={openCreate}>
            <Plus aria-hidden="true" />
            Yeni İlçe
          </Button>
        }
      />

      {loading && !districts ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : districts && districts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {districts.map((district) => (
            <div key={district.id} className={district.active ? "" : "opacity-60"}>
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                      <MapPin className="size-4 text-amber-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold leading-tight">{district.name}</h3>
                      <p className="font-mono text-xs text-muted-foreground">/{district.slug}</p>
                    </div>
                  </div>
                  <SideBadge side={district.side} />
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {district.neighborhoods
                    ? district.neighborhoods.split("\n").filter(Boolean).slice(0, 3).join(", ") +
                      (district.neighborhoods.split("\n").filter(Boolean).length > 3 ? "..." : "")
                    : "Mahalle listesi yok"}
                </p>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => openEdit(district)}>
                    <Pencil aria-hidden="true" />
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(district)}
                    aria-label={`${district.name} ilçesini sil`}
                  >
                    <Trash2 className="text-destructive" aria-hidden="true" />
                    Sil
                  </Button>
                  <span
                    className={`ml-auto inline-flex items-center self-center rounded-md px-2 py-0.5 text-xs font-medium ${
                      district.active ? "bg-emerald-100 text-emerald-900" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {district.active ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </CardContent>
            </Card>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MapPin}
          title="Henüz ilçe yok"
          description="Hizmet verdiğiniz ilk ilçe sayfasını oluşturun."
          action={
            <Button onClick={openCreate}>
              <Plus aria-hidden="true" />
              Yeni İlçe
            </Button>
          }
        />
      )}

      {/* Oluşturma / düzenleme diyaloğu */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && setDialogOpen(false)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "İlçeyi Düzenle" : "Yeni İlçe"}</DialogTitle>
            <DialogDescription>
              {editing ? "İlçe sayfası bilgilerini güncelleyin." : "Yeni bir ilçe hizmet sayfası oluşturun."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormGrid>
              <Field label="İlçe Adı" error={errors.name?.message}>
                <Input {...form.register("name")} placeholder="Kadıköy" aria-invalid={Boolean(errors.name)} />
              </Field>
              <Field label="Slug" error={errors.slug?.message} hint="İsmden otomatik üretilir, düzenlenebilir">
                <Input {...form.register("slug")} placeholder="kadikoy-elektrikci" className="font-mono" aria-invalid={Boolean(errors.slug)} />
              </Field>
            </FormGrid>

            <Field label="Yaka" error={errors.side?.message}>
              <Controller
                control={form.control}
                name="side"
                render={({ field }) => (
                  <Select value={field.value ?? "AVRUPA"} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full" aria-label="Yaka seç">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AVRUPA">Avrupa Yakası</SelectItem>
                      <SelectItem value="ANADOLU">Anadolu Yakası</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field
              label="Mahalleler"
              error={errors.neighborhoods?.message}
              hint={`Her satıra bir mahalle yazın (${neighborhoodCount} mahalle)`}
            >
              <Textarea
                {...form.register("neighborhoods")}
                placeholder={"Fikirtepe\nCaferağa\nBostancı"}
                className="h-32"
              />
            </Field>

            <Field label="İçerik" error={errors.content?.message} hint="Markdown desteklenir (**kalın**, ## başlık, - liste)">
              <Textarea
                {...form.register("content")}
                placeholder="İlçe hizmet içeriği..."
                className="h-48"
                aria-invalid={Boolean(errors.content)}
              />
            </Field>

            <div className="flex items-center justify-between rounded-md border p-3">
              <Label>Aktif</Label>
              <Controller
                control={form.control}
                name="active"
                render={({ field }) => (
                  <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} disabled={saving} />
                )}
              />
            </div>

            <FormGrid>
              <Field label="SEO Başlık" error={errors.metaTitle?.message}>
                <Input {...form.register("metaTitle")} placeholder="Kadıköy Elektrikçi | Zirve Elektrik" />
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
            <AlertDialogTitle>İlçe silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.name}" kalıcı olarak silinecek. Bu işlem geri alınamaz.
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

      {loading && districts && districts.length > 0 ? (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
          Güncelleniyor...
        </p>
      ) : null}
    </div>
  );
}
