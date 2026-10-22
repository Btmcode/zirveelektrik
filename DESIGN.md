# DESIGN.md - Zirve Elektrik

Zirve Elektrik (zirveelektrik.net) için tasarım sistemi dokümanı. AI ajanları bu dosyayı okuyarak görsel olarak tutarlı UI üretir.

## 1. Marka Kimliği

- **Marka**: Zirve Elektrik - İstanbul genelinde 7/24 elektrik arıza tespiti ve onarım hizmeti.
- **Ton**: Güvenilir, uzman, hızlı, erişilebilir. Kurumsal ama samimi. Acil hizmet hissi.
- **Hedef kitle**: İstanbul'da ev/ofis sahipleri, elektrik arızası yaşayan acil müşteriler.

## 2. Renk Sistemi (Tailwind theme token - hardcode YASAK)

| Token | Değer | Kullanım |
|-------|-------|----------|
| `primary` | amber-500 (`oklch(0.769 0.188 70.08)`) | CTA butonları, ikonlar, vurgular, "elektrik" hissi |
| `primary-foreground` | amber-950 | amber üstünde metin |
| `foreground` | slate-900 | başlıklar, gövde metni |
| `background` | white / `bg-background` | sayfa zemini |
| `muted` | slate-50/slate-100 | ikincil bölüm zeminleri (accent-teal bölümler) |
| `muted-foreground` | slate-600 | açıklama metinleri |
| `destructive` | red-600 | acil durum vurguları, hata |
| `border` | slate-200 | kart/kenarlıklar |

Kural: Mavi/indigo KULLANMA. Acil durum bandı `bg-destructive` (kırmızı). Karanlık bölümler (footer, CTA bandı) `bg-zinc-950` + `text-zinc-100` kullanır.

## 3. Tipografi

- Font: Geist Sans (next/font, `latin-ext` subset - Türkçe karakter zorunlu).
- H1: `text-3xl md:text-5xl font-bold tracking-tight`
- H2 (bölüm başlıkları): `text-2xl md:text-4xl font-bold tracking-tight`
- Gövde: `text-base text-muted-foreground`
- Eyebrow/etiket: `text-sm font-semibold uppercase tracking-wider text-primary`
- Telefon numaraları: `font-bold tabular-nums`

## 4. Spacing & Layout

- Maksimum içerik genişliği: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Bölüm dikey boşluğu: `py-12 md:py-20`
- Kart içi: `p-6`; grid gap: `gap-4 md:gap-6`
- Mobil-first: tüm grid'ler `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4`

## 5. Bileşen Kalıpları

- **Header**: beyaz, `sticky top-0`, üstte koyu infor bar (telefon + saat), ana nav + amber "Hemen Ara" butonu. Mobil: Sheet menü.
- **Mobil alt sabit çubuk**: sadece `md:hidden`, `fixed bottom-0`, iki buton: Ara (amber) + WhatsApp (yeşil). Footer'a `pb-20 md:pb-0` boşluk bırak.
- **ServiceCard**: `Card p-6`, Lucide ikonu `size-10 text-primary`, başlık `font-semibold`, 2 satır özet, "Detaylı Bilgi →" link.
- **CTA bandı**: koyu zinc-950 zemin, amber başlık, telefon butonu.
- **FAQ**: shadcn Accordion, `type="single" collapsible`.
- **Footer**: koyu (zinc-950), 4 kolon (marka+NAP, hizmetler, bölgeler, iletişim), en altta telif. `mt-auto` ile sticky footer.
- **Badge'ler**: küçük `Badge variant="secondary"` - "7/24", "Garantili", "Aynı Gün".
- **Admin**: shadcn Sidebar (inset variant), koyu açık tema fark etmeksizin `bg-card` paneller, Tablo = shadcn Table + Badge durum renkleri.

## 6. İkonografi & Görseller

- Yalnızca Lucide ikonlar (Zap, Phone, ShieldCheck, Clock, MapPin, Wrench, Plug, Lightbulb, BatteryCharging, Cable...).
- Görseller: `next/image`, her img'de açıklayıcı `alt` (SEO).
- Görsel stili: gerçekçi, sıcak ışıklı elektrikçi/ev ortamı fotoğrafları; amber tonu baskın.

## 7. Erişilebilirlik (WCAG AA)

- Semantik HTML: `header, nav, main, section, footer, article`.
- Tel linkleri: `<a href="tel:...">`, aria-label ile tam numara.
- Kontrast: amber üstünde koyu metin; muted-foreground en az 4.5:1.
- Klavye ile gezinilebilir tüm etkileşimler; `focus-visible` ring aktif.

## 8. Yasaklar

- Inline style (`style={{}}`) kullanma - Tailwind class.
- Hardcoded renk/heks değer - theme token.
- `dangerouslySetInnerHTML` - yalnızca JSON-LD script'i için, kontrollü.
- Mavi/indigo tema.
- Monolitik tek dosya bileşen - modüler, tipli, yeniden kullanılabilir.
