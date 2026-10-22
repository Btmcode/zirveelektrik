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
| Veritabanı | Prisma ORM + SQLite |
| Kimlik doğrulama | JWT (jose) + HttpOnly cookie, bcrypt |
| Çalışma zamanı | Bun |

## Kurulum

```bash
bun install

# .env dosyası oluşturun (repo içinde .env.example yoktur, aşağıdaki değişkenler zorunlu)
cat > .env << 'EOF'
DATABASE_URL=file:./db/custom.db
ADMIN_EMAIL=<panel-e-postanız>
ADMIN_PASSWORD=<güçlü-şifre>
ADMIN_SESSION_SECRET=<openssl rand -base64 36 ile üretilmiş değer>
EOF

bun run db:push          # şemayı uygula
bunx prisma db seed      # içerik + admin kullanıcısı
bun run dev              # http://localhost:3000
```

> `prisma/seed.ts` admin şifresini yalnızca `ADMIN_PASSWORD` env değişkeninden okur;
> değişken tanımlı değilse seed bilinçli olarak durur.

## Yönetim Paneli

Panel yolu gizlidir (`ADMIN_PATH` env / `src/lib/admin-path.ts`).
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
db/                    # SQLite dosyası (repoya girmez, seed ile yeniden üretilir)
```

## Notlar

- NAP tutarlılığı (Name/Address/Phone) için tüm sayfalar `settings` tablosunu
  tek kaynak olarak kullanır; değişiklik yalnızca panelden yapılır.
- `db/` ve `.env` repoya girmez; taze klon `db:push` + `seed` ile çalışır duruma gelir.
