"use client";

import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  HelpCircle,
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
import { faqUpsertSchema } from "@/lib/validation";

type FaqFormValues = z.input<typeof faqUpsertSchema>;
type FaqFormOutput = z.output<typeof faqUpsertSchema>;

interface AdminFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  active: boolean;
}

const CATEGORIES: Record<string, string> = {
  GENEL: "Genel",
  FIYAT: "Fiyat",
  HIZMET: "Hizmet",
  GARANTI: "Garanti",
};

const EMPTY_VALUES: FaqFormValues = {
  question: "",
  answer: "",
  category: "GENEL",
  sortOrder: 0,
  active: true,
};

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
      {CATEGORIES[category] ?? category}
    </span>
  );
}

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<AdminFaq[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminFaq | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminFaq | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<FaqFormValues, unknown, FaqFormOutput>({
    resolver: zodResolver(faqUpsertSchema),
    defaultValues: EMPTY_VALUES,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ faqs: AdminFaq[] }>("/api/admin/faqs");
      setFaqs(data.faqs);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "SSS kayıtları yüklenemedi");
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

  function openEdit(faq: AdminFaq) {
    setEditing(faq);
    form.reset({
      question: faq.question,
      answer: faq.answer,
      category: (Object.keys(CATEGORIES) as string[]).includes(faq.category)
        ? (faq.category as FaqFormValues["category"])
        : "GENEL",
      sortOrder: faq.sortOrder,
      active: faq.active,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: FaqFormOutput) {
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/api/admin/faqs/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        });
        toast.success("SSS kaydı güncellendi");
      } else {
        await apiFetch("/api/admin/faqs", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("SSS kaydı eklendi");
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
      await apiFetch(`/api/admin/faqs/${deleteTarget.id}`, { method: "DELETE" });
      toast.success("SSS kaydı silindi");
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
        title="Sık Sorulan Sorular"
        description="Site SSS bölümünü yönetin (AEO için önemli)"
        action={
          <Button onClick={openCreate}>
            <Plus aria-hidden="true" />
            Yeni SSS
          </Button>
        }
      />

      {loading && !faqs ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : faqs && faqs.length > 0 ? (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className={faq.active ? "" : "opacity-60"}>
            <Card>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold leading-snug">{faq.question}</h3>
                    <CategoryBadge category={faq.category} />
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        faq.active ? "bg-emerald-100 text-emerald-900" : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {faq.active ? "Aktif" : "Pasif"}
                    </span>
                    <span className="text-xs text-muted-foreground">Sıra: {faq.sortOrder}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{faq.answer}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(faq)}>
                    <Pencil aria-hidden="true" />
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(faq)}
                    aria-label="SSS kaydını sil"
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
          icon={HelpCircle}
          title="Henüz SSS yok"
          description="Sık sorulan soruları ekleyerek arama motorlarında görünürlük kazanın."
          action={
            <Button onClick={openCreate}>
              <Plus aria-hidden="true" />
              Yeni SSS
            </Button>
          }
        />
      )}

      {/* Oluşturma / düzenleme diyaloğu */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && setDialogOpen(false)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "SSS Kaydını Düzenle" : "Yeni SSS Kaydı"}</DialogTitle>
            <DialogDescription>
              {editing ? "Soru ve cevabı güncelleyin." : "Yeni bir soru-cevap ekleyin."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Field label="Soru" error={errors.question?.message}>
              <Input
                {...form.register("question")}
                placeholder="Elektrikçi ne kadar sürede geliyor?"
                aria-invalid={Boolean(errors.question)}
              />
            </Field>

            <Field label="Cevap" error={errors.answer?.message}>
              <Textarea
                {...form.register("answer")}
                placeholder="Ortalama 30-45 dakika içinde..."
                className="h-32"
                aria-invalid={Boolean(errors.answer)}
              />
            </Field>

            <FormGrid>
              <Field label="Kategori" error={errors.category?.message}>
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <Select value={field.value ?? "GENEL"} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full" aria-label="Kategori seç">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(CATEGORIES) as string[]).map((key) => (
                          <SelectItem key={key} value={key}>
                            {CATEGORIES[key]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
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
            </FormGrid>

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
            <AlertDialogTitle>SSS kaydı silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.question}" kalıcı olarak silinecek. Bu işlem geri alınamaz.
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

      {loading && faqs && faqs.length > 0 ? (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
          Güncelleniyor...
        </p>
      ) : null}
    </div>
  );
}
