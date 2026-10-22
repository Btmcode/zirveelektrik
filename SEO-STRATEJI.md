# Zirve Elektrik - SEO / AEO / GEO Strateji Dokümanı

Hedef: **Google Ads kullanmadan, yalnızca organik arama ve Google Haritalar'dan
telefon araması almak.** İşletme Google Haritalar'da (GBP) kayıtlı; bu doküman
mevcut profili optimize etme, siteyi arama niyetine tam eşleştirme ve sürdürülebilir
bir arama hacmi kurma planını içerir. 2026 güncel araştırma bulgularına (Google
resmi dokümantasyonu + local SEO kaynakları) dayanır.

**Gerçek işletme bilgisi (NAP - her yerde birebir aynı):**

```
İşletme adı : Zirve Elektrik
Telefon     : +90 537 720 13 45
E-posta     : zirveeneeji@gmail.com
Adres       : Eski Habipler Mah. Sümbüller Sk. A Blok No: 17-21A İç Kapı No: 11,
              Sultangazi / İstanbul
Merkez      : Sultangazi, Eski Habipler Mah. (Google Haritalar kaydı: mevcut)
```

NAP tutarlılığı kuralı: bu blok; site footer'ı, iletişim sayfası, JSON-LD şeması
ve GBP kaydı arasında **harf harf aynı** olmalıdır. Farklı yazımlar (ör. "Zirve
Elektrik İstanbul", farklı sokak kısaltmaları) yerel sıralamayı düşürür.

---

## 1. Araştırma Bulguları (2026)

### Yerel sıralama sinyalleri
- Local SEO sinyal dağılımı (2026): **GBP sinyalleri ~%32, sayfa içi ~%19,
  yorum sinyalleri ~%16** (clickrank.ai, brightlocal.com 2026 anketleri).
  Ads'siz büyüme için bu üç başlık planın omurgasıdır.
- Google'ın resmi üçlü faktörü: **Relevance, Distance, Prominence**
  (support.google.com/business/answer/7091).
- **Birincil kategori (Primary category) Local Pack'in #1 faktörü**;
  ikinci derecede işletme adındaki anahtar kelime ve yakınlık etkili
  (direction.com 2026).
- **10 yorum eşiği**: GBP'de ilk 10 yorum olmadan Local Pack görünürlüğü
  belirgin şekilde düşük (localdominator.co 2026).
- Apple Maps ve ChatGPT üzerinden gelen talepler 2026'da ölçülebilir büyüklüğe
  ulaştı; sadece Google'a bağlı kalmayın.

### AEO (Answer Engine Optimization)
- Google'ın resmi AI optimizasyon rehberi
  (developers.google.com/search/docs/fundamentals/ai-optimization-guide):
  sıralama mantığı değişmedi; **taranabilir, güvenilir, güncel, arama
  niyetiyle eşleşen içerik** AI Overviews'a da giriyor.
- Öne çıkan snippet'ler AI cevaplarının "provası"dır: **soru biçimli başlık +
  40-60 kelimelik doğrudan cevap** formülü her iki kanalda da çalışır.
- İçeriği AI'nın anlamasına, bulmasına ve güvenmesine yardım edin:
  yapısal veri (schema), net varlık tanımı, kaynak/kanıt.

### GEO (Generative Engine Optimization)
- ChatGPT/Perplexity **yakınlık önyargısı (recency bias)** gösteriyor:
  alıntılanan kaynaklar ortalamada ~%26 daha yeni (llmpulse.ai). Bu yüzden
  içerikte tarih/2026 vurgusu ve düzenli güncelleme kritik.
- AI motorları sayfalardan **kısa, alıntılanabilir pasajlar** çeker:
  her H2 altına net cevap paragrafı koyun (seotuners.com, digitalapplied.com).
- Yapısal veri + tutarlı NAP AI motorlarının işletme bilgisini doğrulamasını
  kolaylaştırır (searchengineland.com 2026).

### Kritik güncelleme
- **FAQPage zengin sonuçları Google'da 7 Mayıs 2026'da kaldırıldı.**
  FAQPage işaretlemesi hâlâ geçerli ve AI motorları okuyor; ancak görünür
  soru-cevap içeriği artık asıl değer (getpassionfruit.com, seostrategy.co.uk).

---

## 2. NAP ve Haritalar Tutarlılığı (Saha Kontrol Listesi)

Site tarafı tamamdır (footer, iletişim, JSON-LD, not-found hepsi DB settings'ten
tek kaynaktan okur). Şunlar site dışı saha işidir:

1. **GBP adresi** yukarıdaki blokla birebir aynı olsun (sokak kısaltması dahil).
2. **Telefon:** GBP telefonu +90 537 720 13 45. Siteye eklenmiş ayrı bir numara
   kullanmayın; tek numara tüm kanalların sinyalini birleştirir.
3. **Şema doğrulama:** ana sayfadaki Electrician JSON-LD'sinde adres + geo
   koordinatları gerçek konumu işaret eder (Eski Habipler, 41.1329/28.8317).
   Rich Results Test ile doğrulayın.
4. **Dizin kayıtları (citation):** aynı NAP ile en az şu listeye girin:
   - Yelp Türkiye, Yellow Pages Türkiye (sariyer rehberi değil; yellowpages.com.tr)
   - Sahibinden hizmet ilan profili, Armut.com
   - Yerel rehber siteleri (İstanbul ilçe rehberleri), sektör dizinleri
   - Facebook/Instagram işletme sayfaları (aynı NAP)
   Citation sayısı ve tutarlılığı Prominence sinyalinin ucunudur.
5. **İletişim sayfasındaki gömülü harita** gerçek GBP konumuna işaret eder;
   Google bunu adres teyidi olarak okur.

---

## 3. Sitede Yapılan İyileştirmeler (Bu Sürüm)

1. **Gerçek iletişim verisi işlendi:** telefon 0537 720 13 45 (tel: ve WhatsApp
   aynı numara), adres Eski Habipler Mah. Sümbüller Sk., e-posta
   zirveeneeji@gmail.com. Tüm sayfalar tek DB kaynağından okur.
2. **İletişim sayfasına Google Haritalar gömmesi + Yol Tarifi Al butonu** eklendi.
3. **LocalBusiness şeması zenginleştirildi:** Electrician tipi, gerçek geo
   koordinatları, 39 ilçe `areaServed`, `openingHoursSpecification` (7/24),
   `knowsAbout` + `hasOfferCatalog` (12 hizmet), onaylı müşteri yorumlarından
   üretilen `aggregateRating` + `review`, `slogan`, `priceRange`.
4. **Sultangazi bölge sayfası güçlendirildi:** Eski Habipler, Gazi, Cebeci,
   Habibler, 50. Yıl, Yayla, Esentepe, Salavatı Islam mahalleleri listelendi
   (merkez ilçe olarak öne çıkarıldı).
5. **Hizmet sayfalarına AEO SSS bölümü:** keşif ücreti / aynı gün servis /
   garanti soruları + eşleşen FAQPage JSON-LD + Service şeması.
6. **SSS akordeonu h3 semantiğine geçirildi:** cevaplar kapalıyken de DOM'da.
7. **12 yüksek niyetli blog yazısı** yayında (fiyat tablosu, gece elektrikçisi,
   pano yenileme vb.).
8. Mevcut zemin: 12 hizmet sayfası, 39 ilçe sayfası (mahalle listeleriyle),
   mobil sabit arama çubuğu, sitemap.xml, markalı 404, hızlı Core Web Vitals.

---

## 4. Kelime Haritası (Öncelik Sırasıyla)

Servis modelimiz tüm 39 ilçeye aynı gün ulaşır; halkalar mesafeye göre değil,
**arama hacmi ve dönüşüm niyetine göre** sıralanır. Merkezimiz Sultangazi'de
olsa da yaygın ekip ve araç filomuz sayesinde şehrin her noktası bizim için
aynı yakınlıktadır; hız vaadimiz ilçeden ilçeye değişmez. Haritalar'da fiziksel
yakınlık Google'ın değerlendirdiği bir faktördür; bu yüzden GBP servis alanı
tüm ilçeleri kapsar ve her ilçe sayfası yerel içerikle (mahalleler,
referanslar) güçlendirilir.

### Halka 0: Marka ve acil niyet (tüm İstanbul, en yüksek dönüşüm)
- `acil elektrikçi`, `7/24 elektrikçi istanbul` → ana sayfa + GBP kategorisi
- `gece elektrikçisi`, `hafta sonu elektrikçi` → blog + GBP
- `zirve elektrik` (marka aramaları; GBP + organik birlikte)
- Bu aramalar işlem niyetlidir: arayan kişi bugün ustayı çağırmak istiyor.

### Halka 1: Yüksek hacimli ilçeler (nüfus/arama hacmi sırası)
- Bağcılar, Esenyurt, Pendik, Küçükçekmece, Bahçelievler, Ümraniye,
  Gaziosmanpaşa, Sultangazi (merkez ilçemiz)
- `elektrikçi [ilçe]` / `[ilçe] elektrikçi` kombinasyonları → ilçe sayfaları
- `gaziosmanpaşa acil elektrikçi`, `bağcılar 7/24 elektrikçi` gibi
  ilçe + niyet kombinasyonları

### Halka 2: Uzun kuyruk: ilçe + mahalle kombinasyonları
- `[mahalle] elektrikçi`, `[ilçe] acil elektrikçi`, `[ilçe] gece elektrikçisi`
- Düşük rekabet, yüksek dönüşüm: ilçe sayfalarındaki mahalle içerikleri bu
  aramaları yakalar.

### Ticari araştırma
- `elektrikçi fiyatları 2026`, `elektrikçi saat ücreti` → fiyat blog yazısı
- `keşif ücreti alıyor mu` → keşif blogu + hizmet SSS
- `pano yenileme`, `sigorta kutusu değişimi` → pano blogu + hizmet sayfası
- `elektrik kaçağı tespiti ücreti` → kaçaak blogu + hizmet sayfası

### Soru aramaları (AEO)
- "sigorta sürekli atıyor neden" (mevcut, sıralamada)
- "elektrik kaçağı nasıl tespit edilir" (mevcut)
- "topraklama zorunlu mu", "priz neden ısınır", "fatura neden yüksek" (mevcut)

---

## 5. GBP (Google İşletme Profili) Oyun Planı - En Yüksek Öncelik

Profil Haritalar'da kayıtlı; sıra optimizasyonda. GBP sinyalleri yerel
görünürlüğün ~%32'si - Ads'siz büyümede 1 numaralı kaldıraç.

1. **Profil tipi kontrolü:** Servis alanı işletmesi (SAB) olarak tanımlı olsun;
   adres görünür (mağaza varsa) veya servis alanı modu doğru ayarlansın.
   Servis alanı: **tüm 39 ilçe** (halkalar hacim sırasına göre önceliklendirilir).
2. **Kategori:** Birincil: **Electrician (Elektrikçi)**. İkincil:
   Emergency electrician service, Electric utility company.
3. **Ad alanı:** "Zirve Elektrik" (anahtar kelime eklemek risklidir; meşru
   alt başlık kabul edilebilir).
4. **NAP birebir eşleşme:** Bölüm 2'deki blokla aynı.
5. **Hizmetler:** 12 hizmeti tek tek tanımlayın; her birine açıklama + fiyat
   aralığı.
6. **Fotoğraf:** Haftada 2-3 gerçek iş fotoğrafı (pano öncesi/sonrası, ekip,
   araç). Coğrafi etiketli fotoğrafların hafif sinyal etkisi vardır.
7. **Google Posts:** Haftada 1 gönderi (kampanya/uyarı/içerik). Aktivite
   sinyali sayılır.
8. **Q&A seeding:** GBP'de 10 soru-cevabı kendiniz sorun ve cevaplayın
   (keşif ücreti, 7/24 mü, hangi ilçeler...).
9. **Mesajlaşma:** GBP mesajlaşmasını açın; "Web sitemizden yazanlara hızlı
   dönüş" oto cevabı + telefon yönlendirme.
10. **UTM:** Site linki `?utm_source=gbp&utm_medium=organic` ile ölçülür
    (Analytics'te GBP ayrıştırılır; Ads dönüşüm izleme gerekmez).

---

## 6. Yorum Motoru (Ads'siz Büyümenin Motoru)

Yorum sinyalleri ~%16; ayrıca 10 yorum eşiği Local Pack kapısıdır.

1. **Her iş bitiminde SMS/WhatsApp:** "Hizmetimizden memnun kaldıysanız 30
   saniyenizi ayırın: [GBP yorum linki]". Gönderimi ustaya değil, ofis/şef
   attıysa otomatikleşir.
2. **Hedef:** ilk 30 gün 15+ yorum, ardından ayda 5-10.
3. **Yanıt disiplini:** tüm yorumlara (olumlu/olumsuz) 24 saat içinde yanıt;
   yanıtlar anahtar kelime içermez, doğal olur.
4. **Puan koruması:** 4,7+ altına düşmemek için sorunlu işleri önce telefonla
   kapatın, yorumu sonra bekleyin.
5. **İş araçlarına tabela + QR (GBP yorum linki)**; her iş = 1 yorum potansiyeli.

---

## 7. Faz Planı (Google Ads Yok, Organik Büyüme)

### Faz 1 - Temel (0-30 gün): "Doğru kurulmuş olsun"
1. GBP optimizasyonu (Bölüm 5): kategori, hizmetler, foto, NAP eşleşmesi
2. İlk 15 GBP yorumu (eski müşterilere SMS/WhatsApp)
3. Google Search Console + Bing Webmaster kaydı; sitemap gönderimi
4. Citation seti (Bölüm 2 madde 4): en az 10 dizin kaydı, birebir NAP
5. GBP Q&A seeding (10 soru)
6. Haftalık GBP post ritmine başlangıç

### Faz 2 - Tüm İstanbul hacim halkası (31-60 gün)
Tüm İstanbul bizim servis alanımız; bu fazda yakınlık değil, **hacim ve
niyet** önceliğine göre şehir geneli görünürlük inşa edilir.
1. Ayda 8 blog yazısı (Bölüm 8 sırasıyla)
2. GBP'de yüksek hacimli ilçelerde arama/haritalar gösterim artışı izleme
   (GBP istatistik ekranı)
3. İlçe sayfalarına ilçeye özgü içerik zenginleştirme (referanslar, mahalle
   notları) - nüfus/arama hacmi sırasına göre
4. Yorum hızı: ayda 10+; puan 4,7+
5. İlk "hizmet + ilçe" sayfaları: bağcılar, esenyurt, pendik, küçükçekmece,
   bahçelievler, ümraniye, gaziosmanpaşa + sultangazi (merkez) kesişimleri

### Faz 3 - Hacim genişlemesi (61-90 gün)
1. Ayda 8-10 blog yazısı + 4 hizmet+ilçe sayfası
2. GBP fotoğraf arşivi 50+ (aynı gün tamamlanan işlerden)
3. İç link ağı denetimi: her blog en az 2 hizmet + 1 ilçe sayfasına link
4. Core Web Vitals denetimi (Lighthouse mobil > 90)
5. GSC'de ilk 100 tıklama/gün eşiği

### Faz 4 - Ölçek ve savunma (4-12 ay)
1. İçerik kütüphanesi 40+ yazıya çıkarma; her çeyrekte 5 eski yazıyı tazeleme
   (GEO recency bias gereği)
2. Tüm ilçe sayfalarında 3-pack görünürlüğü için yorum hacmini aylık 15+ tutma
3. Tekrar müşteri / komşu tavsiyesi döngüsü: her işte magnet kart + QR
4. AI motoru görünürlüğü izleme (ChatGPT/Perplexity'de "istanbul acil elektrikçi"
   sorularını ayda bir test et)
5. Mevsimsel içerik (kış kombi sigortası, yaz klima hattı) takvimi

---

## 8. Organik Huni Matematiği (Ads'siz Gerçekçi Hedef)

Ads'siz 500 arama/gün, kanalların bileşik büyümesiyle 9-18 aylık bir yoldur.
Kısa vade hedefi: 90. günde **100-140 arama/gün**, 6. ayda **200+**, 12. ayda
**400-500**. Zincir (90. gün tahmini):

```
Google Haritalar/Arama Local Pack gösterimi:   30.000/ay
-> GBP profil tıklama + telefon:               ~%5  => 1.500 temas/ay
-> Web sitesi organik (ilçe+hizmet+blog):      20.000 oturum/ay
-> Mobil "Hemen Ara" tıklama oranı:            ~%6  => 1.200 arama/ay
-> AI motorları (ChatGPT/Perplexity/AIO):       600 yönlendirme/ay
-> Doğrudan arama / tekrar müşteri:               900/ay
                                   TOPLAM:    ~4.200 arama/ay = 140/gün
```

Hız artıran kaldıraçlar (Ads yerine):
- **GBP 3-pack girişi** yüksek hacimli ilçelerde (yorum + foto + post disiplini)
- **Yorum hızı**: ayda 15+ yorum, rakip ortalamasının üstünde
- **İçerik hacmi**: 40+ blog + hizmet+ilçe kesişim sayfaları
- **Telefon yanıt oranı**: %90+ cevaplanan arama; kaçan arama = kaçan sıralama
  sinyali değil ama kaçan paradır - cevapsız aramaya 10 dk içinde dönüş kuralı
- **İş başına içerik**: her tamamlanan işten 1 foto + 1 yorum talebi

Not: Organik yolda 500/gün hedefinin tek başına SEO ile 12+ ay sürmesi
normaldir; bu süre yorum hacmi ve 3-pack girişlerine bağlıdır. Aylık hedef
ileri kayarsa öncelikle GBP istatistiklerinden darboğazı bulun (gösterim var
ama tıklama yoksa: foto/puan sorunu; gösterim yoksa: kategori/servis alanı
sorunu).

---

## 9. İçerik Yol Haritası (Sıradaki 20 Konu)

### Hizmet + ilçe kesişimleri (sheer hacim)
1. "hizmet + ilçe" sayfaları (12 hizmet x 39 ilçe = 468 potansiyel; önce
   nüfus/arama hacmi en yüksek ilçeler)

### Blog (yıllık plan örneği)
2. elektrikçi çağırırken sorulacak 10 soru
3. elektrik tesisatı kaç yılda bir yenilenir
4. kombi sigortası neden atıyor
5. klima montajı elektrik tesisatı gereksinimleri
6. yeni ev elektrik kontrol listesi (taşınma sezonu)
7. elektrik faturası düşürme (mevcut fatura-yuksek'in güncellenmiş hali)
8. ankastre spot arızaları
9. zil/diafon arızası kendiniz çözebilir misiniz
10. apartman ortak elektrik kompanzasyon rehberi
11. elektrikçi usta çırak farkı; belgelendirme (E-E-A-T sinyali)
12. EV şarj istasyonu montajı İstanbul (yükselen arama)
13. TV/internet kablolama (koaksiyel) arızaları
14. jeneratör/UPS bağlantısı ne zaman gerekir
15. mutfak priz düzeni standartları (yenilenen mutfaklar)
16. banyo prizleri güvenlik kuralları
17. yazlık/köy tesisatında topraklama
18. elektrik sigortası ile kaçak akım rölesi farkı (zaten kısmen var; genişlet)
19. İstanbul'da elektrik kesintisi ne yapmalı (BEDAŞ/Ayedaş ayrımı)
20. garanti belgesi ve fatura neden şart (güvenlik içeriği)

**Kural:** Her yazıda (1) "Kısa cevap" paragrafı, (2) soru biçimli H2'ler,
(3) liste/tablo, (4) ilgili hizmet sayfasına iç link, (5) yıl etiketi
(2026/2027) ve düzenli güncelleme tarihi.

---

## 10. GEO (AI Motorları) Kontrol Listesi

- [x] Yapısal veri: LocalBusiness + Service + FAQPage + Article + Breadcrumb
- [x] Tutarlı NAP: footer, iletişim, şema aynı veri kaynağından (DB settings)
- [x] Gerçek geo koordinatları: Eski Habipler konumu şemada
- [x] Alıntılanabilir pasajlar: her blog "Kısa cevap" ile açılıyor
- [x] Tazelik: 2026 vurgulu başlıklar, `dateModified` şemada
- [x] Varlık netliği: knowsAbout + hasOfferCatalog + 39 ilçe areaServed
- [ ] Dış referanslar: yerel dizinlere kayıt (Bölüm 2 madde 4) - saha işi
- [ ] GBP yorumlarının siteye özetlenmesi (AI motorları GBP'yi de tarar)

---

## 11. Ölçüm (Ads'siz Kanal Ayrımı)

- **GSC:** gösterim/tıklama; ilçe sorgularında ortalama konum. Ads olmadığı
  için organik görünen her tıklama gerçekten organiktir.
- **GBP içi istatistik:** arama gösterimi, telefon tıklaması, yol tarifi
  (haftalık bakılır; trend GBP sağlığını gösterir)
- **Site içi:** mobil organik oturumda "Hemen Ara" tıklama oranı >= %6
- **Operasyonel ölçüm:** telefon operatörünün çağrı listesi günlük sayılır;
  GBP istatistiği + site tıklaması ile karşılaştırma organik/toplam oranı verir
- **Form takip kodları:** ZR-XXXXXX kodu form kanalını sayar
- **İş hedefi (Ads'siz):** ay 1-2: 30-60 arama/gün, ay 3: 100-140,
  ay 6: 200+, ay 12: 400-500 (GBP + organik + AI + tekrar müşteri toplamı)

---

*Doküman: Zirve Elektrik projesi. Son güncelleme: 2026. Kanal stratejisi:
yalnızca organik arama + GBP + AI motorları (Google Ads planlanmadı). Kaynaklar:
Google Search Central AI optimizasyon rehberi, Google Business Profile yardım,
BrightLocal 2026 Local Search Ranking Factors, clickrank.ai, localdominator.co,
searchengineland.com (2026), llmpulse.ai GEO rehberi.*
