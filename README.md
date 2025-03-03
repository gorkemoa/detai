# 📚 DETAİ - Öğrenci Ders Takip Uygulaması

![detai logo](https://via.placeholder.com/800x200?text=DETAİ+LOGO)

## 🤔 Bu Uygulama Ne İşe Yarar?

DETAİ, öğrencilerin:
- 📝 Derslerini düzenlemesine
- ⏰ Ödevlerini takip etmesine
- 📊 Sınavlarını planlamasına
- 🔍 Çalışma alışkanlıklarını geliştirmesine

yardımcı olan **ÜCRETSİZ** bir uygulamadır.

## ⭐ Neler Yapabilirsin?

### 👤 Hesap Oluşturabilirsin
- Kolayca kayıt ol ve giriş yap
- Bilgilerini güvenle sakla

### 📚 Derslerini Ekleyebilirsin
- İstediğin dersi ekle
- Dersleri renklerle ayır
- Ders programını düzenle

### ✅ Görevlerini Takip Edebilirsin
- Ödevleri not et
- Proje teslim tarihlerini kaydet
- Sınavlarına hazırlan

### 📝 Not Alabilirsin
- Her ders için ayrı notlar
- Resim ve dosya ekleyebilme
- Notlarını düzenleme

### ⏱️ Verimli Çalışabilirsin
- Pomodoro tekniği ile çalış (25 dk çalış, 5 dk dinlen)
- Çalışma sürelerini ölç
- Molalarını düzenle

### 🧠 Öğrenme Kartları Yapabilirsin
- Soru-cevap kartları oluştur
- Öğrenmeni hızlandır
- Sınavlara daha iyi hazırlan

### 📊 İstatistiklerini Görebilirsin
- Ne kadar çalıştığını gör
- Hangi derslere daha çok zaman ayırdığını öğren
- Gelişimini takip et

## 💻 Kullanılan Teknolojiler

- **Ön yüz**: Next.js, React, TailwindCSS
- **Arka yüz**: Next.js API
- **Veritabanı**: SQLite (Prisma)
- **Giriş Sistemi**: NextAuth.js

## 🚀 Nasıl Kurulur?

### 1️⃣ Kodu İndir
```bash
git clone https://github.com/kullanici/ders-takip.git
cd ders-takip
```

### 2️⃣ Gereken Programları Yükle
```bash
npm install
```

### 3️⃣ Veritabanını Hazırla
```bash
npx prisma migrate dev
```

### 4️⃣ Uygulamayı Çalıştır
```bash
npm run dev
```

### 5️⃣ Tarayıcıda Aç
Tarayıcında şu adrese git: [http://localhost:3000](http://localhost:3000)

## ⚙️ Ayarlar Dosyası

Uygulamayı çalıştırmak için `.env` dosyası oluştur ve şunları içine yaz:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="gizli-anahtarin"
NEXTAUTH_URL="http://localhost:3000"
```

## 🤝 Nasıl Katkıda Bulunabilirsin?

1. Bu projeyi "fork" et
2. Yeni bir dal oluştur: `git checkout -b yeni-ozellik`
3. Değişikliklerini kaydet: `git commit -m 'Harika bir özellik ekledim'`
4. Değişikliklerini yükle: `git push origin yeni-ozellik`
5. Birleştirme isteği gönder

## 📄 Lisans

Bu proje MIT lisansı altında dağıtılmaktadır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsin.

## 📱 İletişim

Sorularınız için: ornek@email.com

---

### 🌟 DETAİ ile derslerine daha kolay hâkim ol! 🌟
