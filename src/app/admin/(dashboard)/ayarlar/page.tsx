"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Loader2, KeyRound, Settings2 } from "lucide-react";
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
}

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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ settings: SettingsData }>("/api/admin/settings");
      settingsForm.reset({
        phone: data.settings.phone ?? "",
        whatsapp: data.settings.whatsapp ?? "",
        email: data.settings.email ?? "",
        address: data.settings.address ?? "",
        workingHours: data.settings.workingHours ?? "",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ayarlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [settingsForm]);

  useEffect(() => {
    load();
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
