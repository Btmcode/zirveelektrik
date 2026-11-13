# Google Ads Arama Terimleri Analizi — Zirve Elektrik

> Kaynak: "Arama terimleri raporu.xml", "Negatif anahtar kelime raporu.xml",
> "Negatif anahtar kelime ayrıntıları raporu.xlsx" (2026).
> Çıktılar: `eklenecek-kelime-listesi.csv` (pozitif), `negatif-kelime-listesi.csv` (negatif).

## 1. Yönetici Özeti

| Metrik | Avrupa Yakası | Anadolu Yakası |
|---|---|---|
| Gösterim (ilçe/mahalle içeren terimler) | 8.257 | 3.287 |
| Tıklama | 495 | 158 |
| Dönüşüm | 19,7 | 5 |
| Maliyet | 15.114 TL | 4.979 TL |

- **Avrupa Yakası para kazanan bölge**: dönüşümün ~%80'i buradan. Bütçe ağırlığı ve GEO içerik önceliği burada olmalı.
- **Kanıtlanan en kârlı niyet aileleri**: "en yakın" (14,3 dönüşüm / 4.748 TL), "acil/7-24" (6 / 1.873 TL), **klima elektrik** ailesi (4,5 / 2.163 TL — kullanıcı onaylı hizmet alanı).
- **En büyük bütçe sızıntıları**: iş ilanı/yevmiyeli aramalar (230 terim, 0 dönüşüm, 2.488 TL), dağıtım şirketi aramaları (Ayedaş/Bedas/Uedaş…), malzeme satın alma aramaları, DIY ("nasıl bağlanır") aramaları.
- **Uydu/çanak/TV ailesi KARAR GEREKTİRİYOR**: 1.629 terim, 11.788 gösterim ama sadece 14 dönüşüm ve 10.859 TL maliyet. Dönüşüm getiren alt küme ("uydu tamircisi" 3 dönüşüm @714 TL, "tv montaj ustası", "tv montaj") tutarlı — hizmet veriliyorsa ayrı kampanya + hizmet sayfası önerilir; verilmiyorsa tamamı negatife çekilmelidir.

## 2. Pozitif Anahtar Kelimeler (Ads'e "Eklenen" olarak işaretlenecek)

Tam liste: `eklenecek-kelime-listesi.csv` (137 satır, ifade eşleme önerilir).

Kanıtlanmış çekirdek (dönüşüm başına maliyet ile):

| Terim | Dönüşüm | Maliyet |
|---|---|---|
| elektrikçi | 11 | 13.022 TL |
| en yakın elektrikçi | 7,3 | 1.829 TL |
| elektrikçi en yakın | 5 | 1.317 TL |
| hemen elektrik | 3 | **83 TL** (en verimli!) |
| beylikdüzü elektrikçi | 2 | 1.341 TL |
| esenyurt elektrikçi | 2 | 1.676 TL |
| klima elektrikçisi | 1,5 | **79 TL** |
| klima elektrik bağlantısı | 1 | 1.111 TL |
| acil elektrikçi | 1 | 494 TL |
| 7 24 elektrikçi | 1 | 291 TL |

Büyüme adayları (gösterim ≥30, "Hiçbiri" işaretli, elektrikçi niyeti):
büyükçekmece, bakırköy, başakşehir, kadıköy, gebze, silivri, şişli, gaziosmanpaşa,
kavaklı, göktürk, merdivenköy, mehterçeşme, avcılar cihangir, karaköy + tüm ilçe
kombinasyonları (CSV'de tam liste).

**Not**: "elektrikçi" geniş eşleme terimi 13.022 TL'de 11 dönüşüm getirdi (CPCA ~1.184 TL);
"en yakın" + "acil" aileleri ~4x daha verimli. Geniş eşleme bütçesi kısıtlanıp ifade/tam
eşlemeye ağırlık verilmesi önerilir.

## 3. Negatif Anahtar Kelimeler

Tam liste: `negatif-kelime-listesi.csv` (992 satır). Kaynak kırılımı:

1. **XLSX blok adayları + raporda zaten hariç tutulanlar** (tam eşleme): dağıtım
   şirketleri (ayedaş, bedas, uedas, trepaş, vedaş, trakya…), kesinti bildirme/irtibat
   numarası aramaları, fatura/sayaç/abonelik aramaları.
2. **Kural tabanlı negatifler** (ifade eşleme):
   - `is-arama`: iş ilanı, yevmiyeli, "ustası arayan", şantiye, maaş, cv…
   - `malzeme-satis`: malzeme, satan, satın al, toptan, mağaza…
   - `dagitim-sirketi`: fatura ödeme, hizmet no, sayaç değişim…
   - `kendin-yap`: "nasıl bağlanır", priz nasıl takılır, klemens…
   - `iss-internet`: internet arıza, modem, wi-fi, kablonet…
   - `insaat-tender`: ihale, proje çizim, ruhsat…

Uygulama: Google Ads → Araçlar → Anahtar kelime listeleri → hesap düzeyinde
negatif liste olarak toplu yükleme (CSV "Kelime" kolonu doğrudan yapıştırılabilir).

## 4. SEO / GEO / AEO Uygulaması

Rapor bulgularının siteye yansıması:

| Bulgu | Site durumu | Sonraki adım |
|---|---|---|
| "en yakın" ailesi = en yüksek dönüşüm | `/en-yakin-elektrikci` sayfası + FAQPage şeması mevcut | İlçe link ağı bu sayfada zaten var; sayfa Google Business Profile CTA metniyle güncel |
| klima elektrik ailesi dönüşümlü (kullanıcı onaylı hizmet) | `/hizmetler/klima-elektrik-hatti` sayfası zengin içerikli | Ana sayfa "öne çıkan hizmetler" içinde; blog yazısı: "Klima için neden ayrı elektrik hattı çekilir?" |
| kombi elektrik bağlantısı dönüşümlü | `/hizmetler/kombi-elektrik-baglantisi` mevcut | Kış sezonu öncesi meta açıklama güncellemesi önerilir |
| Avrupa yakası ağırlıklı dönüşüm | 39 ilçe sayfası `/bolgeler/[slug]` mevcut | Beylikdüzü, Esenyurt, Başakşehir, Bakırköy, Büyükçekmece bölge sayfalarına mahalle/sokak zenginleştirmesi öncelikli |
| "acil/7-24" niyeti dönüşümlü | Ana sayfa H1 + hero CTA'ları acil odaklı | Sorun yok; llms.txt ve JSON-LD bu niyeti zaten taşıyor |
| uydu/TV talebi yüksek (11.788 gösterim) | Site içi sayfa YOK | **Karar bekliyor**: hizmet veriliyorsa `/hizmetler/tv-uydu-montaji` açılmalı; verilmiyorsa negatif liste tüm aileyi kapsamalı |

## 5. Özet Aksiyonlar

1. [ ] `negatif-kelime-listesi.csv` → hesap düzeyi negatif liste olarak Ads'e yükle
2. [ ] `eklenecek-kelime-listesi.csv` → ilgili reklam gruplarına ifade eşlemeyle ekle
3. [ ] "elektrikçi" geniş eşleme bütçesini azalt, "en yakın/acil" ailelerine kaydır
4. [ ] Uydu/çanak hizmet kararı: sayfa aç / negatife çek (mal sahibi kararı)
5. [ ] Blog: klima ayrı hat + kombi bağlantısı yazıları (dönüşüm kanıtlı niyetler)
