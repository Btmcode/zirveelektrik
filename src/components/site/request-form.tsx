"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Loader2,
  MapPin,
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
 * İlçe/mahalle/sokak seçimi native <select> ile yapılır: Radix Select
 * kimliklerini React useId ile üretir ve HMR sonrası hydration uyumsuzluğu
 * doğurabilir; native select hem deterministiktir hem de mobilde yerel
 * seçici deneyimi (iOS wheel picker) verir.
 */
const selectClasses =
  "h-11 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

/** Zorunlu alanları işaretleyen yıldız; ekran okuyucular için sessiz. */
function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

/** Mahalle adındaki olası "Mahallesi/Mah." eklerini soyup düzenli hâle getirir. */
function cleanNeighborhoodName(raw: string): string {
  return raw.replace(/\s*(Mahallesi|Mah\.|Mh\.|Mah)\s*$/i, "").trim();
}

/** "Diğer (elle yazacağım)" seçeneğinin görsel olmayan değeri. */
const OTHER_STREET = "__diger__";
/** Bina/daire dropdown'larındaki "Diğer" değeri. */
const OTHER_NO = "__diger__";

const BINA_OPTIONS = Array.from({ length: 300 }, (_, i) => String(i + 1));
const DAIRE_OPTIONS = Array.from({ length: 60 }, (_, i) => String(i + 1));

interface RequestFormProps {
  districts: {
    name: string;
    side: string;
    neighborhoods: string[];
  }[];
  services: string[];
}

interface ApiErrorBody {
  ok?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
}

export function RequestForm({ districts, services }: RequestFormProps) {
  const [successCode, setSuccessCode] = useState<string | null>(null);
  // Mahalle seçimine bağlı sokak listesi (public /api/geo/streets).
  const [streets, setStreets] = useState<string[]>([]);
  const [streetsLoading, setStreetsLoading] = useState(false);
  const [sokakChoice, setSokakChoice] = useState("");
  const [sokakOther, setSokakOther] = useState(false);
  // Bina/daire no harfli olabilir (12A, Z12): dropdown'da yoksa elle giriş.
  const [binaOther, setBinaOther] = useState(false);
  const [daireOther, setDaireOther] = useState(false);
  // Bayat yanıt koruması: yalnızca en son isteğin sonucu kabul edilir.
  const streetReqSeq = useRef(0);
  // Form yüklendiği anda damgalanır (yalnızca ilk render'da hesaplanır);
  // sunucu 3 sn'den hızlı gönderimleri bot sayar.
  const [mountedAt] = useState(() => Date.now());

  /**
   * Doğrulama şeması: paylaşılan şema, formun yapılandırılmış adres
   * alanlarına göre uyarlanır (birleşik `address` gönderimde oluşturulur)
   * ve zorunluluklar ilçe/mahalle verisine göre dinamik eklenir. Sunucu,
   * birleşik son adresi kendi kurallarıyla (min 10 karakter) yeniden
   * doğrular.
   */
  const formSchema = useMemo(
    () =>
      serviceRequestSchema
        .extend({
          address: z.string().trim().max(500).optional().default(""),
        })
        .superRefine((val, ctx) => {
          const hasNeighborhoods =
            (districts.find((d) => d.name === val.district)?.neighborhoods
              .length ?? 0) > 0;
          if (hasNeighborhoods && !val.mahalle?.trim()) {
            ctx.addIssue({
              code: "custom",
              path: ["mahalle"],
              message: "Mahalle seçiniz",
            });
          }
          if (!val.sokak || val.sokak.trim().length < 2) {
            ctx.addIssue({
              code: "custom",
              path: ["sokak"],
              message: "Sokak/cadde seçin veya elle yazın",
            });
          }
          if (!val.binaNo?.trim()) {
            ctx.addIssue({
              code: "custom",
              path: ["binaNo"],
              message: "Bina numarası seçin",
            });
          }
        }),
    [districts]
  );

  const form = useForm<z.input<typeof formSchema>, unknown, ServiceRequestInput>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        phone: "",
        mahalle: "",
        sokak: "",
        binaNo: "",
        daireNo: "",
        address: "",
        district: "",
        serviceType: "",
        message: "",
        website: "",
        kvkkConsent: false,
      },
    }
  );

  // useForm SONRASI türetilir (TDZ hatasına karşı sıralama önemli).
  const selectedDistrictName = form.watch("district");
  const selectedMahalle = form.watch("mahalle");
  const sokakValue = form.watch("sokak");
  const binaValue = form.watch("binaNo");
  const daireValue = form.watch("daireNo");

  const selectedDistrict = districts.find((d) => d.name === selectedDistrictName);
  const selectedNeighborhoods = selectedDistrict?.neighborhoods ?? [];

  // İlçe seçeneklerini yakalara göre grupla (optgroup).
  const avrupaDistricts = districts.filter((d) => d.side !== "ANADOLU");
  const anadoluDistricts = districts.filter((d) => d.side === "ANADOLU");

  /** Mahalle değişince o mahallenin sokak listesini getirir. */
  function loadStreets(district: string, mahalleName: string): void {
    const seq = ++streetReqSeq.current;
    setStreets([]);
    setSokakChoice("");
    setSokakOther(false);
    form.setValue("sokak", "", { shouldValidate: false });
    if (!district || !mahalleName) {
      setStreetsLoading(false);
      return;
    }
    setStreetsLoading(true);
    fetch(
      `/api/geo/streets?ilce=${encodeURIComponent(district)}&mahalle=${encodeURIComponent(mahalleName)}`
    )
      .then((r) => (r.ok ? r.json() : { streets: [] }))
      .then((data: { streets?: string[] }) => {
        if (streetReqSeq.current !== seq) return; // bayat yanıt
        setStreets(Array.isArray(data.streets) ? data.streets : []);
        setStreetsLoading(false);
      })
      .catch(() => {
        if (streetReqSeq.current !== seq) return;
        setStreets([]);
        setStreetsLoading(false);
      });
  }

  /** Mahalle seçimi değişti: sokak zincirini sıfırla ve listeyi getir. */
  function onMahalleChange(value: string): void {
    loadStreets(selectedDistrictName, value);
  }

  // Canlı adres özeti: kullanıcıya gönderilecek birleşik adresi gösterir.
  const mahalleClean = cleanNeighborhoodName(selectedMahalle ?? "");
  const detailSummary = [
    sokakValue?.trim() ? sokakValue.trim() : "",
    binaValue ? `No:${binaValue}` : "",
    daireValue ? `D:${daireValue}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const addressSummary = [
    mahalleClean ? `${mahalleClean} Mahallesi` : "",
    selectedDistrictName,
    detailSummary,
  ]
    .filter(Boolean)
    .join(", ");

  /** Sokak/bina/daire zincirini ve ilgili form durumunu sıfırlar. */
  function resetAddressChain(): void {
    streetReqSeq.current++;
    setStreets([]);
    setSokakChoice("");
    setSokakOther(false);
    setBinaOther(false);
    setDaireOther(false);
    setStreetsLoading(false);
    form.setValue("sokak", "", { shouldValidate: false });
    form.setValue("binaNo", "", { shouldValidate: false });
    form.setValue("daireNo", "", { shouldValidate: false });
  }

  async function onSubmit(values: ServiceRequestInput) {
    try {
      // Birleşik adres: "X Mahallesi, Sokak No:bina D:daire". WhatsApp
      // kartı ve harita linki dahil tek adres metni olarak akar.
      const nh = cleanNeighborhoodName(values.mahalle ?? "");
      const detail = [
        values.sokak?.trim(),
        values.binaNo ? `No:${values.binaNo}` : "",
        values.daireNo ? `D:${values.daireNo}` : "",
      ]
        .filter(Boolean)
        .join(" ");
      const address = [nh ? `${nh} Mahallesi` : "", detail]
        .filter(Boolean)
        .join(", ");
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, address, formTs: mountedAt }),
      });
      const data = (await res.json().catch(() => null)) as ApiErrorBody | null;

      if (res.ok && data?.ok && typeof data === "object") {
        const code = (data as { code?: string }).code;
        if (code) setSuccessCode(code);
        form.reset();
        resetAddressChain();
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
            form.setError(field as keyof z.input<typeof formSchema>, {
              message,
            });
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

  // Geçersiz gönderimde ilk hatalı alana odaklan (klavye ve ekran okuyucu dostu).
  function onInvalid() {
    const firstError = Object.keys(form.formState.errors).find(
      (k) => k !== "website"
    );
    if (firstError) {
      try {
        // RHF'in Controller tabanlı alanlar için setFocus options tipi
        // daraltıldığından imza açıkça verilir; davranış aynı kalır
        // (native input/select alanlarında shouldFocus çalışır).
        (
          form.setFocus as (
            name: string,
            options?: { shouldFocus?: boolean }
          ) => void
        )(firstError, { shouldFocus: true });
      } catch {
        // Özel bileşenlerde odaklanma başarısız olabilir; kritik değil.
      }
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
            resetAddressChain();
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
      <p className="mt-3 text-xs text-muted-foreground">
        <span className="text-destructive" aria-hidden="true">
          *
        </span>{" "}
        ile işaretli alanlar zorunludur.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="mt-6 space-y-5"
          noValidate
        >
          {/* Honeypot: insanlar ve ekran okuyucular için görünmez/dışı; botlar doldurur. */}
          <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
            <label htmlFor="website-hp">Website</label>
            <input
              id="website-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("website")}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ad Soyad
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Adınız Soyadınız"
                      autoComplete="name"
                      maxLength={80}
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
                  <FormLabel>
                    Telefon
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="tel"
                      placeholder="05XX XXX XX XX"
                      autoComplete="tel"
                      maxLength={20}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Adres bilgileri: tamamen kademeli seçim
              (ilçe → mahalle → sokak → bina → daire) */}
          <fieldset className="space-y-4 rounded-xl border bg-muted/30 p-4">
            <legend className="flex items-center gap-1.5 px-1 text-sm font-semibold text-foreground">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              Adres Bilgileri
            </legend>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      İlçe
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <select
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            // ilçe değişince alt zincir sıfırlanır
                            form.setValue("mahalle", "", {
                              shouldValidate: false,
                            });
                            resetAddressChain();
                          }}
                          aria-label="İlçe seçin"
                          className={selectClasses}
                        >
                          <option value="" disabled>
                            İlçe seçin
                          </option>
                          {avrupaDistricts.length > 0 ? (
                            <optgroup label="Avrupa Yakası">
                              {avrupaDistricts.map((d) => (
                                <option key={d.name} value={d.name}>
                                  {d.name}
                                </option>
                              ))}
                            </optgroup>
                          ) : null}
                          {anadoluDistricts.length > 0 ? (
                            <optgroup label="Anadolu Yakası">
                              {anadoluDistricts.map((d) => (
                                <option key={d.name} value={d.name}>
                                  {d.name}
                                </option>
                              ))}
                            </optgroup>
                          ) : null}
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
                name="mahalle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mahalle
                      {selectedNeighborhoods.length > 0 ? <RequiredMark /> : null}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <select
                          {...field}
                          disabled={
                            !selectedDistrictName ||
                            selectedNeighborhoods.length === 0
                          }
                          onChange={(e) => {
                            field.onChange(e);
                            onMahalleChange(e.target.value);
                          }}
                          aria-label="Mahalle seçin"
                          className={selectClasses}
                        >
                          {selectedNeighborhoods.length === 0 ? (
                            <option value="">
                              {selectedDistrictName
                                ? "Bu ilçe için mahalle listesi yok"
                                : "Önce ilçe seçin"}
                            </option>
                          ) : (
                            <option value="" disabled>
                              Mahalle seçin
                            </option>
                          )}
                          {selectedNeighborhoods.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sokak/cadde: mahalle verisinden dropdown; liste yoksa
                veya kullanıcı isterse elle giriş */}
            <FormField
              control={form.control}
              name="sokak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Sokak / Cadde
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {streetsLoading ? (
                        <div className="relative">
                          <select
                            disabled
                            aria-label="Sokak listesi yükleniyor"
                            className={selectClasses}
                          >
                            <option>Sokaklar yükleniyor…</option>
                          </select>
                          <Loader2
                            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                      ) : !selectedMahalle ? (
                        /* Mahalle seçilmeden sokak zinciri başlamaz */
                        <div className="relative">
                          <select
                            disabled
                            aria-label="Önce mahalle seçin"
                            className={selectClasses}
                          >
                            <option>Önce mahalle seçin</option>
                          </select>
                        </div>
                      ) : streets.length > 0 && !sokakOther ? (
                        <div className="relative">
                          <select
                            value={sokakChoice}
                            onChange={(e) => {
                              const v = e.target.value;
                              setSokakChoice(v);
                              if (v === OTHER_STREET) {
                                setSokakOther(true);
                                form.setValue("sokak", "", {
                                  shouldValidate: false,
                                });
                              } else {
                                form.setValue("sokak", v, {
                                  shouldValidate: false,
                                });
                              }
                            }}
                            aria-label="Sokak/cadde seçin"
                            className={selectClasses}
                          >
                            <option value="" disabled>
                              Sokak/cadde seçin
                            </option>
                            {streets.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                            <option value={OTHER_STREET}>
                              Diğer (elle yazacağım)
                            </option>
                          </select>
                          <ChevronDown
                            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                      ) : (
                        <Input
                          placeholder="Sokak/cadde adını yazın (örn: Atatürk Cad.)"
                          autoComplete="off"
                          maxLength={120}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                      {sokakOther && streets.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSokakOther(false);
                            setSokakChoice("");
                            form.setValue("sokak", "", {
                              shouldValidate: false,
                            });
                          }}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          ← Listeden seçmek istiyorum
                        </button>
                      ) : null}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="binaNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Bina No
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {binaOther ? (
                          <Input
                            placeholder="Örn: 12A"
                            autoComplete="off"
                            maxLength={10}
                            aria-label="Bina numarasını yazın"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        ) : (
                          <div className="relative">
                            <select
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                if (e.target.value === OTHER_NO) {
                                  setBinaOther(true);
                                  form.setValue("binaNo", "", {
                                    shouldValidate: false,
                                  });
                                } else {
                                  field.onChange(e);
                                }
                              }}
                              aria-label="Bina numarası seçin"
                              className={selectClasses}
                            >
                              <option value="" disabled>
                                Bina no seçin
                              </option>
                              {BINA_OPTIONS.map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                              <option value={OTHER_NO}>
                                Diğer (elle yazacağım)
                              </option>
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        {binaOther ? (
                          <button
                            type="button"
                            onClick={() => {
                              setBinaOther(false);
                              form.setValue("binaNo", "", {
                                shouldValidate: false,
                              });
                            }}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            ← Listeden seçmek istiyorum
                          </button>
                        ) : null}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="daireNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daire</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {daireOther ? (
                          <Input
                            placeholder="Örn: Z12"
                            autoComplete="off"
                            maxLength={10}
                            aria-label="Daire numarasını yazın"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        ) : (
                          <div className="relative">
                            <select
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                if (e.target.value === OTHER_NO) {
                                  setDaireOther(true);
                                  form.setValue("daireNo", "", {
                                    shouldValidate: false,
                                  });
                                } else {
                                  field.onChange(e);
                                }
                              }}
                              aria-label="Daire numarası seçin"
                              className={selectClasses}
                            >
                              <option value="">Daire seçin (opsiyonel)</option>
                              {DAIRE_OPTIONS.map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                              <option value={OTHER_NO}>
                                Diğer (elle yazacağım)
                              </option>
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        {daireOther ? (
                          <button
                            type="button"
                            onClick={() => {
                              setDaireOther(false);
                              form.setValue("daireNo", "", {
                                shouldValidate: false,
                              });
                            }}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            ← Listeden seçmek istiyorum
                          </button>
                        ) : null}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Canlı adres özeti: gönderilecek birleşik adresi gösterir. */}
            <div
              aria-live="polite"
              className="flex items-start gap-2 rounded-lg border border-dashed bg-background px-3 py-2.5"
            >
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              {addressSummary ? (
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="sr-only">
                    Talebinizde görünecek adres:{" "}
                  </span>
                  <span className="font-medium">{addressSummary}</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  İlçe ve mahalle seçtiğinizde adresiniz burada özetlenir.
                </p>
              )}
            </div>
          </fieldset>

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

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Arıza Açıklaması
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Örn: Sabahdan beri sigorta sürekli atıyor, mutfakta priz çalışmıyor..."
                    rows={4}
                    maxLength={2000}
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
                        KVKK Aydınlatma Metni&apos;ni okudum.
                        <span className="text-destructive" aria-hidden="true">
                          {" "}
                          *
                        </span>
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
                      Aydınlatma Metni&apos;ni okumak için tıklayın
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
