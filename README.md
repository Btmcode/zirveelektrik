# zirveelektrik

Zirve Elektrik resmi web sitesi — İstanbul 7/24 acil elektrikçi hizmetleri için
SEO/AEO odaklı, mobil öncelikli kurumsal site ve yönetim paneli.

- **Site:** zirveelektrik.net
- **Hizmet modeli:** Google arama/haritalar → telefon → keşif → fiyat teklifi → servis

## Teknoloji

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| Arayüz | Tailwind CSS 4, shadcn/ui, Lucide |
| Veritabanı | Prisma ORM + Prisma Postgres (Vercel Storage, Accelerate) |
| Kimlik doğrulama | JWT (jose) + HttpOnly cookie, bcrypt |
| Çalışma zamanı | Bun |

## Kurulum

```bash
bun install

# .env.example dosyasını .env olarak kopyalayın ve değerleri doldurun
cp .env.example .env

bun run db:push          # şemayı uygula (Prisma Postgres bağlantı adresi gerektirir)
bunx prisma db seed      # içerik + admin kullanıcısı
bun run dev              # http://localhost:3000
```

> `prisma/seed.ts` admin şifresini yalnızca `ADMIN_PASSWORD` env değişkeninden okur;
> değişken tanımlı değilse seed bilinçli olarak durur.

## Yönetim Paneli

Panel yolu gizlidir (`src/lib/admin-path.ts` içindeki `ADMIN_LOGIN_PATH` sabiti).
Giriş: `ADMIN_EMAIL` + `ADMIN_PASSWORD` ile seed edilen kullanıcı.

- Talepler: gelen arıza bildirimleri, durum yönetimi, notlar
- İçerik: hizmetler, ilçeler, blog, SSS, müşteri yorumları
- Ayarlar: NAP (ad/telefon/adres) tek kaynak — tüm site bu tablodan okur

## Komutlar

| Komut | Açıklama |
|---|---|
| `bun run dev` | Geliştirme sunucusu (port 3000) |
| `bun run lint` | ESLint |
| `bun run build` | Üretim derlemesi |
| `bun run db:push` | Prisma şemasını veritabanına uygula |

## Yapı

```
src/app/(site)/        # herkese açık sayfalar (ana, hizmetler, bölgeler, blog, SSS, iletişim)
src/app/admin/         # yönetim paneli (gizli yol)
src/app/api/           # public + admin API rotaları
src/components/site/   # site bileşenleri (header, hero, form, footer...)
src/components/admin/  # panel bileşenleri
src/lib/               # schema.org, auth, settings, validation
prisma/                # şema + seed
db/                    # eski SQLite dosyaları (artık kullanılmıyor, repoya girmez)
```

## Vercel Deploy

1. **Repo bağlama:** [vercel.com/new](https://vercel.com/new) → `Btmcode/zirveelektrik` repo'sunu import edin (framework otomatik: Next.js).
2. **Veritabanı:** "Optional Integrations" bölümünde **Prisma Postgres (Storage)** seçili bırakın → Deploy. Bağlantı adresi otomatik tanımlanır.
3. **Ortam değişkenleri** (Project → Settings → Environment Variables):
   - `DATABASE_URL` — Prisma Postgres entegrasyonunun verdiği bağlantı adresi (`prisma+postgres://...`); entegrasyon farklı adla eklediyse bu adla manuel ekleyin
   - `ADMIN_SESSION_SECRET` — **zorunlu** (en az 32 karakter; `openssl rand -base64 36`)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` — yalnızca seed çalıştırmak için (runtime'da gerekmez)
4. **Region:** `vercel.json` ile `fra1` (Frankfurt) sabitlenmiştir — İstanbul'a en düşük gecikme.
5. **Seed (ilk kurulumda bir kez):** Prisma Postgres bağlantı adresini bilgisayarınıza alıp:
   ```bash
   DATABASE_URL="prisma+postgres://..." bun run db:push
   DATABASE_URL="prisma+postgres://..." bunx prisma db seed
   ```
6. **Domain:** Vercel → Settings → Domains → `zirveelektrik.net` + `www` ekleyin; DNS'te Vercel'in verdiği kayıtları girin.

> Not: Tüm içerik sayfaları `force-dynamic` render edilir; build sırasında veritabanı
> bağlantısı gerekmez. Ayar değişiklikleri anında yayına yansır.

## Notlar

- NAP tutarlılığı (Name/Address/Phone) için tüm sayfalar `settings` tablosunu
  tek kaynak olarak kullanır; değişiklik yalnızca panelden yapılır.
- `db/` ve `.env` repoya girmez; taze klon `db:push` + `seed` ile çalışır duruma gelir.
