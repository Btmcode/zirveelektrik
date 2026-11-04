"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Loader2, KeyRound, Settings2, Send, RotateCcw, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/components/admin/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { Field, FormGrid } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_WA_TEMPLATE,
  renderRequestCard,
  WA_TEMPLATE_TOKENS,
  type RequestCardData,
} from "@/lib/whatsapp-card";

const settingsFormSchema = z.object({
  phone: z.string().trim().max(30, "En fazla 30 karakter"),
  whatsapp: z.string().trim().max(30, "En fazla 30 karakter"),
  email: z.string().trim().email("Geçerli bir e-posta giriniz").max(120),
  address: z.string().trim().max(200, "En fazla 200 karakter"),
  workingHours: z.string().trim().max(100, "En fazla 100 karakter"),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre gerekli"),
    newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalı").max(128),
    confirmPassword: z.string().min(1, "Şifreyi tekrar girin"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface SettingsData {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  waTemplate: string;
}

/** Önizleme/test için sabit örnek talep; tarih sabittir (SSR/hidrasyon tutarlılığı). */
const SAMPLE_REQUEST: RequestCardData = {
  code: "ZR-248152",
  name: "Ahmet Yılmaz",
  phone: "0532 111 22 33",
  address: "Örnek Mahallesi, Deneme Sokak No:3 Daire 5",
  district: "Kağıthane",
  serviceType: "Sigorta ATD Yenileme",
  message: "Ana panel sigortaları atıyor, kontrol gerekiyor.",
  createdAt: "2026-01-15T11:30:00Z", // İstanbul saatiyle 14:30
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: { phone: "", whatsapp: "", email: "", address: "", workingHours: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  // WhatsApp şablon editörü (RHF dışında bağımsız state)
  const [templateDraft, setTemplateDraft] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const templateRef = useRef<HTMLTextAreaElement | null>(null);
  const templateText = renderRequestCard(SAMPLE_REQUEST, templateDraft);

  const load = useCallback(async () => {
    // Not: ilk yüklemede loading zaten true başlar; tüm setState'ler await
    // SONRASINDA yapılır (react-hooks/set-state-in-effect kuralı).
    try {
      const data = await apiFetch<{ settings: SettingsData }>("/api/admin/settings");
      settingsForm.reset({
        phone: data.settings.phone ?? "",
        whatsapp: data.settings.whatsapp ?? "",
        email: data.settings.email ?? "",
        address: data.settings.address ?? "",
        workingHours: data.settings.workingHours ?? "",
      });
      return data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ayarlar yüklenemedi");
      return null;
    } finally {
      setLoading(false);
    }
  }, [settingsForm]);

  useEffect(() => {
    // Şablon taslağı promise zincirinde (async) doldurulur — kural uyumlu.
    load().then((data) => {
      if (data) setTemplateDraft(data.settings.waTemplate ?? "");
    });
  }, [load]);

  async function onSettingsSubmit(values: SettingsFormValues) {
    setSavingSettings(true);
    try {
      await apiFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      toast.success("Ayarlar kaydedildi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ayarlar kaydedilemedi");
    } finally {
      setSavingSettings(false);
    }
  }

  /** Token'ı imleç konumuna ekler; imleç yoksa sona ekler. */
  function insertToken(token: string) {
    const el = templateRef.current;
    if (!el) {
      setTemplateDraft((prev) => prev + token);
      return;
    }
    const start = el.selectionStart ?? templateDraft.length;
    const end = el.selectionEnd ?? templateDraft.length;
    const next = templateDraft.slice(0, start) + token + templateDraft.slice(end);
    setTemplateDraft(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  }

  async function onTemplateSave() {
    setSavingTemplate(true);
    try {
      await apiFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({ waTemplate: templateDraft }),
      });
      toast.success("Şablon kaydedildi — otomatik bildirimlerde geçerli");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Şablon kaydedilemedi");
    } finally {
      setSavingTemplate(false);
    }
  }

  async function onTemplateTest() {
    setSendingTest(true);
    try {
      const data = await apiFetch<{ status: string; provider?: string }>(
        "/api/admin/wa-template/send-test",
        { method: "POST", body: JSON.stringify({ text: templateText }) }
      );
      toast.success(
        `Test mesajı gönderildi (${data.provider ?? "whatsapp"}) — telefonunuzu kontrol edin`
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Test mesajı gönderilemedi");
    } finally {
      setSendingTest(false);
    }
  }

  async function onPasswordSubmit(values: PasswordFormValues) {
    setSavingPassword(true);
    try {
      await apiFetch("/api/admin/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      toast.success("Şifre güncellendi");
      passwordForm.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Şifre güncellenemedi");
    } finally {
      setSavingPassword(false);
    }
  }

  const settingsErrors = settingsForm.formState.errors;
  const passwordErrors = passwordForm.formState.errors;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ayarlar"
        description="Site iletişim bilgileri ve hesap güvenliği"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="size-5 text-amber-600" aria-hidden="true" />
            Site İletişim Bilgileri
          </CardTitle>
          <CardDescription>
            Bu bilgiler sitedeki tüm iletişim alanlarında ve yapılandırılmış veride kullanılır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-4" noValidate>
              <FormGrid>
                <Field label="Telefon" htmlFor="phone" error={settingsErrors.phone?.message}>
                  <Input id="phone" {...settingsForm.register("phone")} placeholder="+90 537 720 13 45" className="tabular-nums" />
                </Field>
                <Field label="WhatsApp" htmlFor="whatsapp" error={settingsErrors.whatsapp?.message}>
                  <Input id="whatsapp" {...settingsForm.register("whatsapp")} placeholder="+90 537 720 13 45" className="tabular-nums" />
                </Field>
              </FormGrid>
              <Field label="E-posta" htmlFor="email" error={settingsErrors.email?.message}>
                <Input id="email" type="email" {...settingsForm.register("email")} placeholder="zirveeneeji@gmail.com" />
              </Field>
              <Field label="Adres" htmlFor="address" error={settingsErrors.address?.message}>
                <Input id="address" {...settingsForm.register("address")} placeholder="Eski Habipler Mah. Sümbüller Sk. A Blok No: 17-21A, Sultangazi/İstanbul" />
              </Field>
              <Field label="Çalışma Saatleri" htmlFor="workingHours" error={settingsErrors.workingHours?.message}>
                <Input id="workingHours" {...settingsForm.register("workingHours")} placeholder="7/24 Acil Servis" />
              </Field>
              <Button type="submit" disabled={savingSettings}>
                {savingSettings ? (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                ) : (
                  <Save aria-hidden="true" />
                )}
                Ayarları Kaydet
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="size-5 text-amber-600" aria-hidden="true" />
            WhatsApp Mesaj Şablonu
          </CardTitle>
          <CardDescription>
            Yeni talep geldiğinde WhatsApp&apos;ınıza düşecek &quot;Acil Çağrı Mesaj
            Kartı&quot; metnini özelleştirin. Token&apos;lar gerçek talep verisiyle
            doldurulur; WhatsApp&apos;ta *yıldız* kalın yazıya dönüşür. Şablonu boş
            kaydederseniz yerleşik varsayılan kart kullanılır.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Token çipleri: tıklayınca imleç konumuna eklenir */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Şablon token'ları">
            {WA_TEMPLATE_TOKENS.map((t) => (
              <button
                key={t.token}
                type="button"
                onClick={() => insertToken(t.token)}
                className="rounded-md border bg-muted px-2 py-1 font-mono text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                title={`${t.label} ekle`}
              >
                {t.token}
              </button>
            ))}
          </div>
          <Field
            label="Şablon Metni"
            htmlFor="waTemplate"
            hint={`${templateDraft.length}/4000 karakter`}
          >
            <Textarea
              id="waTemplate"
              ref={templateRef}
              value={templateDraft}
              onChange={(e) => setTemplateDraft(e.target.value)}
              rows={14}
              className="font-mono text-sm"
              placeholder={DEFAULT_WA_TEMPLATE}
              maxLength={4000}
            />
          </Field>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={onTemplateSave} disabled={savingTemplate}>
              {savingTemplate ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Save aria-hidden="true" />
              )}
              Şablonu Kaydet
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onTemplateTest}
              disabled={sendingTest}
            >
              {sendingTest ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Send aria-hidden="true" />
              )}
              WhatsApp&apos;a Test Gönder
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setTemplateDraft(DEFAULT_WA_TEMPLATE)}
            >
              <RotateCcw aria-hidden="true" />
              Varsayılanı Getir
            </Button>
          </div>
          {/* Canlı önizleme */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Önizleme (örnek talep verisiyle)
            </p>
            <div className="max-h-80 overflow-y-auto whitespace-pre-wrap break-words rounded-lg border bg-muted/50 p-3 text-sm">
              {templateText}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-5 text-amber-600" aria-hidden="true" />
            Şifre Değiştir
          </CardTitle>
          <CardDescription>
            Yönetici hesabı şifrenizi güncelleyin. Kaydettikten sonra tekrar girişte yeni şifre geçerli olur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="max-w-md space-y-4" noValidate>
            <Field label="Mevcut Şifre" htmlFor="currentPassword" error={passwordErrors.currentPassword?.message}>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...passwordForm.register("currentPassword")}
              />
            </Field>
            <Field label="Yeni Şifre" htmlFor="newPassword" error={passwordErrors.newPassword?.message} hint="En az 8 karakter">
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("newPassword")}
              />
            </Field>
            <Field label="Yeni Şifre (Tekrar)" htmlFor="confirmPassword" error={passwordErrors.confirmPassword?.message}>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("confirmPassword")}
              />
            </Field>
            <Button type="submit" variant="outline" disabled={savingPassword}>
              {savingPassword ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <KeyRound aria-hidden="true" />
              )}
              Şifreyi Güncelle
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
