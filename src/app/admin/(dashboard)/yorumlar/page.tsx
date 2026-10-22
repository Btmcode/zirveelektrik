"use client";

import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Star,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertTriangle,
  RefreshCw,
  MessageSquareQuote,
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
import { testimonialUpsertSchema } from "@/lib/validation";
import { formatDateTr } from "@/lib/utils-format";

type TestimonialFormValues = z.input<typeof testimonialUpsertSchema>;
type TestimonialFormOutput = z.output<typeof testimonialUpsertSchema>;

interface AdminTestimonial {
  id: string;
  name: string;
  district: string;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

const EMPTY_VALUES: TestimonialFormValues = {
  name: "",
  district: "",
  content: "",
  rating: 5,
  approved: false,
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} yıldız`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminTestimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<TestimonialFormValues, unknown, TestimonialFormOutput>({
    resolver: zodResolver(testimonialUpsertSchema),
    defaultValues: EMPTY_VALUES,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ testimonials: AdminTestimonial[] }>("/api/admin/testimonials");
      setTestimonials(data.testimonials);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Yorumlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    form.reset(EMPTY_VALUES);
    setDialogOpen(true);
  }

  function openEdit(testimonial: AdminTestimonial) {
    setEditing(testimonial);
    form.reset({
      name: testimonial.name,
      district: testimonial.district ?? "",
      content: testimonial.content,
      rating: testimonial.rating,
      approved: testimonial.approved,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: TestimonialFormOutput) {
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/api/admin/testimonials/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        });
        toast.success("Yorum güncellendi");
      } else {
        await apiFetch("/api/admin/testimonials", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Yorum eklendi");
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
      await apiFetch(`/api/admin/testimonials/${deleteTarget.id}`, { method: "DELETE" });
      toast.success("Yorum silindi");
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
        title="Müşteri Yorumları"
        description="Sitede görünen yorumları onaylayın ve düzenleyin"
        action={
          <Button onClick={openCreate}>
            <Plus aria-hidden="true" />
            Yeni Yorum
          </Button>
        }
      />

      {loading && !testimonials ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : testimonials && testimonials.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={testimonial.approved ? "" : "opacity-70"}>
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <RatingStars rating={testimonial.rating} />
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                      testimonial.approved
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {testimonial.approved ? "Onaylı" : "Onay Bekliyor"}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                  <p className="text-sm font-semibold">
                    {testimonial.name}
                    {testimonial.district ? (
                      <span className="font-normal text-muted-foreground"> - {testimonial.district}</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDateTr(testimonial.createdAt)}</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => openEdit(testimonial)}>
                    <Pencil aria-hidden="true" />
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(testimonial)}
                    aria-label={`${testimonial.name} yorumunu sil`}
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
          icon={MessageSquareQuote}
          title="Henüz yorum yok"
          description="Müşteri yorumlarını ekleyerek sosyal kanıt oluşturun."
          action={
            <Button onClick={openCreate}>
              <Plus aria-hidden="true" />
              Yeni Yorum
            </Button>
          }
        />
      )}

      {/* Oluşturma / düzenleme diyaloğu */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && setDialogOpen(false)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Yorumu Düzenle" : "Yeni Yorum"}</DialogTitle>
            <DialogDescription>
              {editing ? "Yorum bilgilerini güncelleyin." : "Yeni bir müşteri yorumu ekleyin."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormGrid>
              <Field label="Ad Soyad" error={errors.name?.message}>
                <Input {...form.register("name")} placeholder="Ahmet Y." aria-invalid={Boolean(errors.name)} />
              </Field>
              <Field label="İlçe" error={errors.district?.message}>
                <Input {...form.register("district")} placeholder="Şişli" />
              </Field>
            </FormGrid>

            <Field label="Yorum" error={errors.content?.message}>
              <Textarea
                {...form.register("content")}
                placeholder="Çok hızlı geldiler, sigortayı aynı gün çözdüler..."
                className="h-28"
                aria-invalid={Boolean(errors.content)}
              />
            </Field>

            <FormGrid>
              <Field label="Puan" error={errors.rating?.message}>
                <Controller
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <Select
                      value={String(field.value ?? 5)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="w-full" aria-label="Puan seç">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} Yıldız
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <div className="flex items-center justify-between self-end rounded-md border p-3">
                <Label>Onaylı</Label>
                <Controller
                  control={form.control}
                  name="approved"
                  render={({ field }) => (
                    <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} disabled={saving} />
                  )}
                />
              </div>
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
            <AlertDialogTitle>Yorum silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.name}" yorumu kalıcı olarak silinecek. Bu işlem geri alınamaz.
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

      {loading && testimonials && testimonials.length > 0 ? (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
          Güncelleniyor...
        </p>
      ) : null}
    </div>
  );
}
