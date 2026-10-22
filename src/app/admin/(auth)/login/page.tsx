"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Home, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { apiFetch } from "@/components/admin/api-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
} from "@/components/admin/form-field";

const loginFormSchema = z.object({
  email: z.string().trim().min(1, "E-posta gerekli").email("Geçerli bir e-posta giriniz"),
  password: z.string().min(8, "Şifre en az 8 karakter"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    if (submitting) return;
    setSubmitting(true);
    try {
      await apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      router.push("/admin");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Giriş yapılamadı");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Image
            src="/logo.png"
            alt="Zirve Elektrik logosu"
            width={96}
            height={96}
            priority
            className="size-16 object-contain drop-shadow-md"
          />
          <h1 className="text-2xl font-bold tracking-tight">Yönetici Girişi</h1>
          <p className="text-sm text-muted-foreground">
            Zirve Elektrik yönetim paneline erişin
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>Yalnızca yetkili personel giriş yapabilir.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Field label="E-posta" htmlFor="email" error={errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ornek@sirket.com"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
              </Field>
              <Field label="Şifre" htmlFor="password" error={errors.password?.message}>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
              </Field>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Button asChild variant="outline" className="mt-3 w-full">
          <Link href="/" aria-label="Siteyi aç, anasayfaya dön">
            <Home aria-hidden="true" />
            Anasayfaya Dön
          </Link>
        </Button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Zirve Elektrik - zirveelektrik.net
        </p>
      </div>
    </div>
  );
}
