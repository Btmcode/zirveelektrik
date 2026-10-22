"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Loader2,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  serviceRequestSchema,
  type ServiceRequestInput,
} from "@/lib/validation";

/**
 * İlçe/hizmet seçimi native <select> ile yapılır: Radix Select kimliklerini
 * React useId ile üretir ve HMR sonrası hydration uyumsuzluğu doğurabilir;
 * native select hem deterministiktir hem de mobilde yerel seçici deneyimi verir.
 */
const selectClasses =
  "h-10 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

type FormInput = z.input<typeof serviceRequestSchema>;

interface RequestFormProps {
  districts: string[];
  services: string[];
}

interface ApiErrorBody {
  ok?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
}

export function RequestForm({ districts, services }: RequestFormProps) {
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const form = useForm<FormInput, unknown, ServiceRequestInput>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      district: "",
      serviceType: "",
      message: "",
      kvkkConsent: false,
    },
  });

  async function onSubmit(values: ServiceRequestInput) {
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as ApiErrorBody | null;

      if (res.ok && data?.ok && typeof data === "object") {
        const code = (data as { code?: string }).code;
        if (code) setSuccessCode(code);
        form.reset();
        toast.success("Talebiniz alındı", {
          description: code
            ? `Takip kodunuz: ${code}. Ustalarımız en kısa sürede sizi arayacak.`
            : "Ustalarımız en kısa sürede sizi arayacak.",
        });
        return;
      }

      if (res.status === 400 && data?.errors) {
        for (const [field, messages] of Object.entries(data.errors)) {
          const message = messages?.[0];
          if (message) {
            form.setError(field as keyof FormInput, { message });
          }
        }
        toast.error("Lütfen formu kontrol edin", {
          description: "İşaretli alanları düzeltip tekrar gönderin.",
        });
        return;
      }

      toast.error(data?.error ?? "Talep gönderilemedi", {
        description:
          "Lütfen daha sonra tekrar deneyin veya bizi doğrudan telefonla arayın.",
      });
    } catch {
      toast.error("Bağlantı hatası", {
        description:
          "İnternet bağlantınızı kontrol edin veya bizi telefonla arayın.",
      });
    }
  }

  if (successCode) {
    return (
      <Card className="flex h-full flex-col items-center justify-center p-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-9 text-primary" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground">
          Talebiniz Alındı!
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Ustalarımız en kısa sürede sizi arayarak randevu planlayacak. Talebinizi
          takip etmek için kodunuzu saklayın:
        </p>
        <p
          className="mt-4 rounded-lg bg-accent px-6 py-3 font-mono text-2xl font-bold tracking-widest text-primary"
          aria-label={`Takip kodu: ${successCode}`}
        >
          {successCode}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setSuccessCode(null);
            form.reset();
          }}
        >
          Yeni Talep Oluştur
        </Button>
      </Card>
    );
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Arıza Bildirim Formu
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Formu doldurun; ekibimiz sizi kısa sürede arayarak adresinize uygun
        randevu planlasın.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Soyad</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Adınız Soyadınız"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="tel"
                      placeholder="05XX XXX XX XX"
                      autoComplete="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İlçe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select {...field} aria-label="İlçe seçin" className={selectClasses}>
                        <option value="" disabled>
                          İlçe seçin
                        </option>
                        {districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hizmet</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select {...field} aria-label="Hizmet seçin" className={selectClasses}>
                        <option value="">Hizmet seçin (opsiyonel)</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adres</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mahalle, sokak, bina ve daire bilgisi"
                    rows={2}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arıza Açıklaması</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Örn: Sabahdan beri sigorta sürekli atıyor, mutfakta priz çalışmıyor..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kvkkConsent"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
                  <FormControl>
                    <Checkbox
                      id="kvkk-consent"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-2">
                    <label
                      htmlFor="kvkk-consent"
                      className="block cursor-pointer text-xs leading-relaxed text-muted-foreground sm:text-sm"
                    >
                      <span className="font-medium text-foreground">
                        KVKK Aydınlatma Metni'ni okudum.
                      </span>{" "}
                      Ad soyad, telefon ve adres bilgilerimin, arıza talebime
                      dönüş yapılması ve hizmetin sunulması amacıyla KVKK
                      kapsamında işlenmesine onay veriyorum. Verilerim üçüncü
                      kişilere ticari amaçla verilmez.
                    </label>
                    <Link
                      href="/gizlilik-politikasi"
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Aydınlatma Metni'ni okumak için tıklayın
                      <ExternalLink className="size-3" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="size-4" aria-hidden="true" />
                Arıza Bildirimi Gönder
              </>
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
