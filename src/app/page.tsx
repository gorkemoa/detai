import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Animasyon ve CSS değişken tanımlamaları
const styles = {
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 }
  },
  '@keyframes floatUp': {
    '0%': { transform: 'translateY(20px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 }
  },
  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 }
  },
  '@keyframes subtleZoom': {
    '0%': { transform: 'scale(1)' },
    '100%': { transform: 'scale(1.05)' }
  },
  '@keyframes shimmer': {
    '0%': { backgroundPosition: '-1000px 0' },
    '100%': { backgroundPosition: '1000px 0' }
  },
  
  // Premium renkler
  gold: {
    300: '#FADA80',
    400: '#F5CE62',
    500: '#E5AE49',
  },
  amber: {
    300: '#FFD700',
    500: '#FFC107',
    600: '#FF9800',
  }
};

// TailwindCSS için ek renkler ve animasyonlar
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _tailwindExtensions = {
  gold: styles.gold,
  'animate-pulse-slow': 'pulse 3s infinite ease-in-out',
  'animate-pulse-subtle': 'pulse 2s infinite ease-in-out',
  'animate-subtle-zoom': 'subtleZoom 25s infinite alternate ease-in-out',
  'shimmer': 'shimmer 2s infinite linear',
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header - Apple tarzı minimal header */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white flex items-center relative group hover:scale-105 transition-transform duration-500">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-white to-blue-400 mr-1 transition-all duration-500 group-hover:from-blue-400 group-hover:via-white group-hover:to-gold-400">
                <span className="animate-shimmer inline-block">d</span>
                <span className="animate-shimmer inline-block" style={{animationDelay: "100ms"}}>e</span>
                <span className="animate-shimmer inline-block" style={{animationDelay: "200ms"}}>t</span>
                <span className="animate-shimmer inline-block" style={{animationDelay: "300ms"}}>a</span>
                <span className="animate-shimmer inline-block" style={{animationDelay: "400ms"}}>i</span>
              </span>
              <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse-subtle group-hover:bg-blue-500 transition-colors duration-300 shadow-[0_0_10px_rgba(245,206,98,0.7)] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]"></div>
              <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-2 left-0 right-0 h-[10px] w-[10px] rounded-full bg-gold-400/30 filter blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[3] -z-10"></div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="#ozellikler" className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300 group overflow-hidden">
                <span className="relative z-10">Özellikler</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="#nasil-calisir" className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300 group overflow-hidden">
                <span className="relative z-10">Nasıl Çalışır</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="#fiyatlandirma" className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300 group overflow-hidden">
                <span className="relative z-10">Fiyatlandırma</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>
            
            <div className="flex gap-3 items-center">
              <Link href="/giris">
                <Button variant="ghost" className="text-zinc-400 hover:text-white transition-colors duration-300">Giriş Yap</Button>
              </Link>
              <Link href="/kayit">
                <Button className="bg-white text-black hover:bg-white/90 transition-colors duration-300 font-medium">Kayıt Ol</Button>
              </Link>
              
              {/* Mobil Menü Düğmesi */}
              <button className="md:hidden p-2 text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Apple tarzı etkileyici hero bölümü */}
      <section className="relative py-24 min-h-screen flex items-center overflow-hidden">
        {/* Video Arka Plan */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover opacity-30"
            style={{ filter: 'brightness(0.4) saturate(1.2)' }}
          >
            <source src="https://cdn.pixabay.com/video/2021/02/20/65772-515379427_large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black"></div>
          
          {/* Modern Işık Efektleri */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 filter blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 filter blur-[150px] animate-pulse-slow" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-violet-500/10 filter blur-[130px] animate-pulse-slow" style={{animationDelay: '4s'}}></div>
          </div>
        </div>

        {/* Modern Işık Çizgileri */}
        <div className="absolute top-0 left-1/2 h-[800px] w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent transform -translate-x-1/2 animate-glow"></div>
        <div className="absolute top-1/3 left-1/4 h-[600px] w-[1px] bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent animate-glow-delayed"></div>
        <div className="absolute top-1/4 right-1/4 h-[500px] w-[1px] bg-gradient-to-b from-transparent via-violet-500/20 to-transparent animate-glow-delayed-2"></div>

        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div 
            className="text-white/90 font-medium text-sm md:text-base mb-8 px-8 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 inline-block shadow-2xl hover:scale-105 transition-all duration-500"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              animation: "fadeIn 0.8s ease-out, floatUp 0.8s ease-out",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)"
            }}
          >
            <span className="mr-2 inline-block w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 animate-pulse"></span>
            Eğitimde Yapay Zeka Devrimi
          </div>
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-10 max-w-5xl leading-tight"
            style={{
              animation: "fadeIn 1s ease-out 0.3s both, floatUp 1s ease-out 0.3s both",
              textShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-violet-300">
              Geleceğin Eğitim Platformu
            </span>
          </h1>
          <p 
            className="text-xl md:text-2xl text-zinc-300 mb-14 max-w-3xl leading-relaxed"
            style={{
              animation: "fadeIn 1s ease-out 0.6s both, floatUp 1s ease-out 0.6s both"
            }}
          >
            <span className="text-indigo-400">detai</span> ile çalışmalarınızı organize edin, zamanınızı verimli kullanın ve akademik başarınızı zirveye taşıyın. Yapay zeka teknolojimiz, eğitim yolculuğunuzda sizinle.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            style={{
              animation: "fadeIn 1s ease-out 0.9s both, floatUp 1s ease-out 0.9s both"
            }}
          >
            <Link href="/kayit">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-10 py-7 rounded-full text-lg font-medium shadow-xl transition-all duration-300 hover:shadow-indigo-500/20 hover:scale-105">
                Hemen Başla
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="#demo-video">
              <Button size="lg" className="bg-white/10 backdrop-blur-xl hover:bg-white/15 text-white px-10 py-7 rounded-full text-lg font-medium shadow-xl transition-all duration-300 hover:shadow-white/20 hover:scale-105 border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Demo İzle
              </Button>
            </Link>
          </div>
          
          {/* Modern Uygulama Arayüzü */}
          <div 
            className="w-full max-w-6xl mx-auto relative perspective-2000"
            style={{
              animation: "fadeIn 1.2s ease-out 1.2s both, floatUp 1.2s ease-out 1.2s both"
            }}
          >
            {/* Gölge ve Parıltı Efekti */}
            <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-transparent rounded-3xl blur-2xl -z-10"></div>
            
            <div className="relative shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)] rounded-2xl overflow-hidden border border-white/10 transform hover:scale-[1.02] transition-transform duration-700 hover:shadow-indigo-500/10 group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
              
              <Image
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=3840&h=2160&auto=format&fit=crop&q=100"
                alt="detai uygulaması arayüzü"
                width={3840}
                height={2160}
                className="rounded-xl w-full transition-transform duration-10000 group-hover:scale-[1.03]"
                quality={100}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
              />
              
              {/* Modern Bilgi Kartı */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-max bg-white/10 backdrop-blur-2xl border border-white/20 px-8 py-4 rounded-2xl text-white shadow-2xl z-30 hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span className="inline-block w-2 h-2 rounded-full bg-violet-500 animate-pulse" style={{animationDelay: '0.2s'}}></span>
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{animationDelay: '0.4s'}}></span>
                  </div>
                  <span className="font-medium">7 günlük ücretsiz deneme • Kredi kartı gerektirmez</span>
                </div>
              </div>
              
              {/* Modern Nokta Deseni */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px] opacity-30 mix-blend-overlay z-20"></div>
            </div>
            
            {/* Modern Işık Efektleri */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-indigo-500/20 filter blur-[100px] animate-pulse-slow"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-violet-500/20 filter blur-[100px] animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          </div>
          
          {/* Modern Özellik Göstergeleri */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 items-center" style={{animation: "fadeIn 1.5s ease-out 1.5s both"}}>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-pulse"></div>
              <span className="text-white/80">AI Destekli Öğrenme</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 animate-pulse"></div>
              <span className="text-white/80">Kişiselleştirilmiş Deneyim</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-pulse"></div>
              <span className="text-white/80">Gelişmiş Analitikler</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 animate-pulse"></div>
              <span className="text-white/80">7/24 Erişim</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fiyatlandırma Planları Bölümü */}
      <section id="fiyatlandirma" className="py-32 relative overflow-hidden">
        {/* Arka plan efektleri */}
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 filter blur-[100px]"></div>
          <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-white/5 filter blur-[80px]"></div>
          <div className="absolute top-1/2 left-1/4 w-1 h-32 bg-gradient-to-b from-white/0 via-white/10 to-white/0"></div>
          <div className="absolute top-1/4 right-1/3 w-1 h-32 bg-gradient-to-b from-white/0 via-white/10 to-white/0"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div 
            className="text-center mb-20"
            style={{
              animation: "fadeIn 1s ease-out, floatUp 1s ease-out"
            }}
          >
            <span className="inline-block px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-zinc-300 text-sm font-medium mb-4">ESNEK PLANLAR</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">Her İhtiyaca Uygun Çözümler</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Bütçenize ve gereksinimlerinize göre uyarlanmış fiyatlandırma planlarımız ile detai&apos;nin gücünü keşfedin.</p>
          </div>
          
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            style={{
              animation: "fadeIn 1.2s ease-out 0.3s both, floatUp 1.2s ease-out 0.3s both"
            }}
          >
            {/* Ücretsiz Plan */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-500 hover:shadow-lg hover:shadow-white/5 group">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-bold">Ücretsiz</h3>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <p className="text-zinc-400 mb-6">Temel özellikleri keşfetmek ve denemek için ideal.</p>
              <div className="mb-10 relative">
                <span className="text-5xl font-bold">0₺</span>
                <span className="text-zinc-400 ml-2">/ aylık</span>
                <div className="absolute -bottom-4 left-0 w-16 h-[1px] bg-gradient-to-r from-white/20 to-transparent"></div>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-300">5 ders limiti</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: "50ms" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-300">Temel görev yönetimi</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: "100ms" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-300">Basit çalışma istatistikleri</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: "150ms" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-300">Sınırlı topluluk erişimi</span>
                </li>
              </ul>
              <Link href="/kayit">
              <Button className="w-full py-6 bg-white text-black hover:bg-white/90 transition-all duration-300 group-hover:translate-y-[-2px]">
              <span>Ücretsiz Başla</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/20 rounded-2xl p-8 transform md:scale-110 relative z-10 shadow-xl shadow-white/5 group hover:shadow-white/10 transition-all duration-500">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full text-xs text-white font-medium backdrop-blur-md border border-white/20 bg-white/10">
                EN POPÜLER
              </div>
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-zinc-300 mb-6">Ciddi öğrenciler ve profesyoneller için ideal.</p>
              <div className="mb-10 relative">
                <span className="text-5xl font-bold">39₺</span>
                <span className="text-zinc-400 ml-2">/ aylık</span>
                <div className="absolute -bottom-4 left-0 w-16 h-[1px] bg-gradient-to-r from-white/20 to-transparent"></div>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-200">Sınırsız ders ve görev</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: "50ms" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-200">Tam yapay zeka özellikleri</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: "100ms" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-200">Gelişmiş çalışma analitikleri</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: "150ms" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-200">Flashcard sistemi</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: "200ms" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-200">Öncelikli e-posta desteği</span>
                </li>
              </ul>
              <Link href="/kayit">
                <Button className="w-full py-6 bg-white text-black hover:bg-white/90 transition-all duration-300 group-hover:translate-y-[-2px]">
                  <span>Şimdi Başla</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </Link>
              
              {/* Vurgu Efekti */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-white/20 via-white/40 to-white/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10"></div>
            </div>
            
            {/* Kurumsal Plan */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-500 hover:shadow-lg hover:shadow-white/5 group">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-bold">Kurumsal</h3>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <p className="text-zinc-400 mb-6">Okullar ve eğitim kurumları için ideal.</p>
              <div className="mb-10 relative">
                <span className="text-2xl font-bold">Özel Fiyatlandırma</span>
                <div className="absolute -bottom-4 left-0 w-16 h-[1px] bg-gradient-to-r from-white/20 to-transparent"></div>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-300">Pro planın tüm özellikleri</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: "50ms" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-300">Öğrenci grupları yönetimi</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: "100ms" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-300">Okul LMS entegrasyonu</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: "150ms" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-300">Özelleştirilebilir özellikler</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: "200ms" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-300">7/24 öncelikli destek</span>
                </li>
              </ul>
              <Link href="/kurumsal-iletisim">
              <Button className="w-full py-6 bg-white text-black hover:bg-white/90 transition-all duration-300 group-hover:translate-y-[-2px]">
                <span>İletişime Geçin</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
          
          <div 
            className="text-center mt-16 max-w-3xl mx-auto bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
            style={{
              animation: "fadeIn 1.5s ease-out 0.6s both, floatUp 1.5s ease-out 0.6s both"
            }}
          >
            <p className="text-zinc-300">
              Tüm planlar 14 günlük para iade garantisi ile sunulmaktadır. İhtiyacınız olan planı seçin ve detai&apos;nin akademik başarınızı nasıl artırdığını görün.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-zinc-400">Sorularınız mı var?</span>
              <a href="mailto:info@detai.com" className="text-white hover:text-zinc-300 transition-colors duration-300 flex items-center gap-1">
                info@detai.com
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Çağrı Bölümü */}
      <section className="py-32 relative overflow-hidden">
        {/* Arka plan efektleri */}
        <div className="absolute inset-0 bg-black">
          <Image 
            src="https://images.unsplash.com/photo-1610366398516-46da9dec5931?q=80&w=3870&auto=format&fit=crop"
            alt="Abstract Background"
            fill
            quality={100}
            className="object-cover mix-blend-overlay opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90"></div>
        </div>
        
        {/* Dekoratif Işık Efektleri */}
        <div className="absolute top-0 left-1/4 h-[500px] w-[1px] bg-gradient-to-b from-white/0 via-white/20 to-white/0"></div>
        <div className="absolute top-0 right-1/4 h-[300px] w-[1px] bg-gradient-to-b from-white/0 via-white/10 to-white/0"></div>
        <div className="absolute bottom-0 left-1/3 h-[200px] w-[1px] bg-gradient-to-t from-white/0 via-white/10 to-white/0"></div>
        
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-white/5 filter blur-[100px]"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-white/5 filter blur-[100px]"></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16" style={{ animation: "fadeIn 1s ease-out, floatUp 1s ease-out" }}>
              <span className="inline-block px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-zinc-300 text-sm font-medium mb-6">EĞİTİMDE GÜVENİLEN ÇÖZÜM ORTAĞI</span>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">Akademik başarınızı bir üst seviyeye taşımaya hazır mısınız?</h2>
              <p className="text-xl text-zinc-400 mb-8 max-w-3xl mx-auto">
                Detai ile çalışma alışkanlıklarınızı geliştirin, zamanınızı verimli kullanın ve akademik potansiyelinizi maksimuma çıkarın.
              </p>
            </div>
            
            {/* Çizgi */}
            <div className="w-24 h-[1px] bg-gradient-to-r from-white/0 via-white/40 to-white/0 mx-auto mb-16"></div>
            
            {/* Özellik Kutuları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16" style={{ animation: "fadeIn 1.2s ease-out 0.3s both, floatUp 1.2s ease-out 0.3s both" }}>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className="mb-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Zaman Tasarrufu</h3>
                <p className="text-zinc-400 mb-6">Akıllı programlama ve hatırlatıcılar ile zamanınızı daha verimli kullanın. Hedeflerinize uygun özelleştirilmiş çalışma planları oluşturun.</p>
                <Link href="/ozellikler/zaman-yonetimi" className="text-white flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                  <span>Daha fazla bilgi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className="mb-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Yapay Zeka Asistanı</h3>
                <p className="text-zinc-400 mb-6">Kişiselleştirilmiş öneriler ve analitik içgörüler ile çalışma alışkanlıklarınızı optimize edin. AI destekli öğrenme yolculuğu.</p>
                <Link href="/ozellikler/yapay-zeka" className="text-white flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                  <span>Daha fazla bilgi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* CTA Düğmesi */}
            <div className="text-center" style={{ animation: "fadeIn 1.5s ease-out 0.6s both, floatUp 1.5s ease-out 0.6s both" }}>
              <Link href="/kayit">
                <Button className="bg-white text-black py-7 px-12 rounded-full text-lg font-medium hover:bg-white/90 transition-all duration-300 hover:shadow-white/20 hover:scale-105 group">
                  <span>Hemen Şimdi Başlayın</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </Link>
              
              <p className="mt-6 text-zinc-500 max-w-md mx-auto">
                7 günlük ücretsiz deneme ile başlayın. Kredi kartı bilgisi gerektirmez ve istediğiniz zaman iptal edebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Elite Deneyim Bölümü - YENİ */}
      <section className="py-32 relative overflow-hidden">
        {/* Arka plan efektleri */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/40 to-black">
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-500/5 filter blur-[120px]"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-500/5 filter blur-[120px]"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-20" style={{ animation: "fadeIn 1s ease-out, floatUp 1s ease-out" }}>
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-white/10 rounded-full text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-sm font-medium mb-4">ELITE DENEYIM</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">Premium Üyelere Özel Ayrıcalıklar</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Sınırlı sayıda kullanıcıya sunulan elit özelliklere erişim sağlayın, kendini seçilmiş hissedin.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
            {/* Işıldayan Arka Plan Efekti */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl blur-xl -z-10 animate-pulse-slow"></div>
            
            {/* Elite Kart 1 */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-xl p-8 backdrop-blur-xl shadow-xl hover:shadow-purple-500/10 transition-all duration-500 hover:translate-y-[-5px] group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-3xl"></div>
              
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl flex items-center justify-center mb-6 relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">VIP Erişim</h3>
              <p className="text-zinc-400 mb-6">Sistemimizin en çarpıcı ve gelişmiş özelliklerine öncelikli ve ayrıcalıklı erişim elde edin.</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300 group-hover:text-white transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></div>
                  Beta özelliklere erken erişim
                </li>
                <li className="flex items-center text-zinc-300 group-hover:text-white transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></div>
                  Özel VIP topluluk grupları
                </li>
                <li className="flex items-center text-zinc-300 group-hover:text-white transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></div>
                  Gelişmiş profil özelleştirme seçenekleri
                </li>
              </ul>
              
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Elite Kart 2 */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-xl p-8 backdrop-blur-xl shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:translate-y-[-5px] group relative overflow-hidden md:transform md:translate-y-[-20px]">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-3xl"></div>
              
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl flex items-center justify-center mb-6 relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Premium İçerikler</h3>
              <p className="text-zinc-400 mb-6">Yalnızca premier üyelerimize özel içerikler ve kaynaklar ile eğitim deneyiminizi zenginleştirin.</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300 group-hover:text-white transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></div>
                  Özel masterclass webinarları
                </li>
                <li className="flex items-center text-zinc-300 group-hover:text-white transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></div>
                  Uzmanlardan özel ders notları
                </li>
                <li className="flex items-center text-zinc-300 group-hover:text-white transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></div>
                  Sınav hazırlık paketleri
                </li>
              </ul>
              
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Elite Kart 3 */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-xl p-8 backdrop-blur-xl shadow-xl hover:shadow-purple-500/10 transition-all duration-500 hover:translate-y-[-5px] group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-3xl"></div>
              
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl flex items-center justify-center mb-6 relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">Kişisel Danışmanlık</h3>
              <p className="text-zinc-400 mb-6">Bireysel ihtiyaçlarınıza özel hazırlanmış danışmanlık hizmetleri ile potansiyelinizi maksimuma çıkarın.</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300 group-hover:text-white transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></div>
                  Birebir öğrenme koçluğu
                </li>
                <li className="flex items-center text-zinc-300 group-hover:text-white transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></div>
                  Haftalık ilerleme değerlendirmeleri
                </li>
                <li className="flex items-center text-zinc-300 group-hover:text-white transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></div>
                  Kişiselleştirilmiş çalışma planları
                </li>
              </ul>
              
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          
          {/* Elite CTA */}
          <div className="mt-16 text-center">
            <Link href="/elite-uyelik">
              <Button className="bg-transparent border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 py-7 px-12 rounded-full text-lg font-medium group overflow-hidden relative">
                <span className="relative z-10">Elite Üyeliğe Yükselt</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></span>
              </Button>
            </Link>
            
            <p className="mt-6 text-zinc-500">
              <span className="inline-flex items-center text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sınırlı sayıda kontenjan
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Premium Avantajlar - YENİ */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-black to-zinc-950">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1557264305-7e2764da873b?q=80&w=3870&auto=format&fit=crop" 
            alt="Premium Texture" 
            fill 
            quality={100}
            className="object-cover opacity-10 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-black/50"></div>
        </div>
        
        {/* Dekoratif Elementler */}
        <div className="absolute top-40 left-1/4 h-40 w-40 rounded-full bg-gradient-to-br from-gold-300/10 to-gold-500/5 blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 h-60 w-60 rounded-full bg-gradient-to-br from-gold-300/10 to-gold-500/5 blur-3xl"></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-20">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-gold-500/20 to-amber-500/20 backdrop-blur-md border border-gold-500/10 rounded-full text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-amber-300 text-sm font-medium mb-4">PREMIUM AVANTAJLAR</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gold-200 to-amber-300">Ayrıcalıklı Deneyimler</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Premium üyelerimize özel avantajlar ve hizmetler ile eğitim yolculuğunuzu mükemmelleştirin.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-8">
              {/* Premium Özellik 1 */}
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500/20 to-transparent flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gold-200 group-hover:to-gold-300 transition-all duration-300">Zaman Tasarrufu</h3>
                  <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">Özelleştirilmiş yapay zeka algoritmaları ile öğrenme sürenizi %40&apos;a kadar azaltın. Önemli noktaları vurgulayan akıllı öğrenme yöntemleri ile zamanınızı en verimli şekilde kullanın.</p>
                </div>
              </div>
              
              {/* Premium Özellik 2 */}
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500/20 to-transparent flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg> 

                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gold-200 group-hover:to-gold-300 transition-all duration-300">Özel Güvenlikli Notlar</h3>
                  <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">Gelişmiş şifreleme teknolojisiyle korunan not sistemi. Çalışmalarınızı ve bilgilerinizi her zaman güvende tutun. Bulut senkronizasyonu ile istediğiniz cihazdan erişim sağlayın.</p>
                </div>
              </div>
              
              {/* Premium Özellik 3 */}
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500/20 to-transparent flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gold-200 group-hover:to-gold-300 transition-all duration-300">Öncelikli Destek</h3>
                  <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">7/24 öncelikli müşteri desteği. Sorularınız için beklemeyin, premium üyeliğiniz ile her zaman önceliklisiniz. Hızlı çözümler için özel destek ekibi.</p>
                </div>
              </div>
            </div>
            
            {/* Premium Görsel Bölüm */}
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-300/20 to-amber-500/20 rounded-3xl blur-2xl -z-10 opacity-70 transform translate-x-5 translate-y-5 group-hover:translate-x-4 group-hover:translate-y-4 transition-all duration-500"></div>
              
              <div className="relative border border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-gold-500/5 transform hover:scale-[1.02] transition-all duration-700 group-hover:shadow-gold-500/20">
                <Image
                  src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=3870&auto=format&fit=crop"
                  alt="Premium Deneyim"
                  width={600}
                  height={800}
                  className="rounded-xl w-full object-cover"
                  quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"></div>
                
                {/* Premium Overlay Bilgi */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
                    <span className="text-gold-300 text-sm font-medium">Premium Deneyim</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">En değerli varlığınız: Zamanınız</h3>
                  <p className="text-zinc-300">Detai Premium ile bir adım önde olun ve diğerlerinden farklılaşın.</p>
                  
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Premium Rozet/Madalya Gösterimi */}
          <div className="mt-24 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-zinc-300">%99.9 Kesintisiz Erişim</span>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-zinc-300">Güvenli Veri Koruması</span>
            </div>
          </div>
        </div>
      </section>

      {/* Çağrı Bölümü */}
      <section className="py-32 relative overflow-hidden">
        {/* Arka plan efektleri */}
        <div className="absolute inset-0 bg-black">
          <Image 
            src="https://images.unsplash.com/photo-1610366398516-46da9dec5931?q=80&w=3870&auto=format&fit=crop"
            alt="Abstract Background"
            fill
            quality={100}
            className="object-cover mix-blend-overlay opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90"></div>
        </div>
        
        {/* Dekoratif Elementler */}
        <div className="absolute top-40 left-1/4 h-40 w-40 rounded-full bg-gradient-to-br from-gold-300/10 to-gold-500/5 blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 h-60 w-60 rounded-full bg-gradient-to-br from-gold-300/10 to-gold-500/5 blur-3xl"></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16" style={{ animation: "fadeIn 1s ease-out, floatUp 1s ease-out" }}>
              <span className="inline-block px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-zinc-300 text-sm font-medium mb-6">EĞİTİMDE GÜVENİLEN ÇÖZÜM ORTAĞI</span>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">Akademik başarınızı bir üst seviyeye taşımaya hazır mısınız?</h2>
              <p className="text-xl text-zinc-400 mb-8 max-w-3xl mx-auto">
                Detai ile çalışma alışkanlıklarınızı geliştirin, zamanınızı verimli kullanın ve akademik potansiyelinizi maksimuma çıkarın.
              </p>
            </div>
            
            {/* Çizgi */}
            <div className="w-24 h-[1px] bg-gradient-to-r from-white/0 via-white/40 to-white/0 mx-auto mb-16"></div>
            
            {/* Özellik Kutuları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16" style={{ animation: "fadeIn 1.2s ease-out 0.3s both, floatUp 1.2s ease-out 0.3s both" }}>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className="mb-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Zaman Tasarrufu</h3>
                <p className="text-zinc-400 mb-6">Akıllı programlama ve hatırlatıcılar ile zamanınızı daha verimli kullanın. Hedeflerinize uygun özelleştirilmiş çalışma planları oluşturun.</p>
                <Link href="/ozellikler/zaman-yonetimi" className="text-white flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                  <span>Daha fazla bilgi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className="mb-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Yapay Zeka Asistanı</h3>
                <p className="text-zinc-400 mb-6">Kişiselleştirilmiş öneriler ve analitik içgörüler ile çalışma alışkanlıklarınızı optimize edin. AI destekli öğrenme yolculuğu.</p>
                <Link href="/ozellikler/yapay-zeka" className="text-white flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                  <span>Daha fazla bilgi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* CTA Düğmesi */}
            <div className="text-center" style={{ animation: "fadeIn 1.5s ease-out 0.6s both, floatUp 1.5s ease-out 0.6s both" }}>
              <Link href="/kayit">
                <Button className="bg-white text-black py-7 px-12 rounded-full text-lg font-medium hover:bg-white/90 transition-all duration-300 hover:shadow-white/20 hover:scale-105 group">
                  <span>Hemen Şimdi Başlayın</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </Link>
              
              <p className="mt-6 text-zinc-500 max-w-md mx-auto">
                7 günlük ücretsiz deneme ile başlayın. Kredi kartı bilgisi gerektirmez ve istediğiniz zaman iptal edebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Modern, Premium Görünüm */}
      <footer className="relative bg-black text-white py-16 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo ve açıklama */}
            <div>
              <a href="#" className="inline-block mb-6 group relative">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-500">
                  Ders<span className="text-purple-500 group-hover:text-blue-400 transition-colors duration-500">.</span>
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-500"></span>
              </a>
              <p className="text-zinc-400 mb-6 group-hover:text-zinc-300 transition-colors duration-300">
                Eğitim deneyiminizi dönüştüren modern öğrenme platformu. Bilgiyi keşfedin, paylaşın ve büyüyün.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Ürün */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ürün</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Özellikler</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Entegrasyonlar</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Fiyatlandırma</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Güncellemeler</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Yol Haritası</a></li>
              </ul>
            </div>
            
            {/* Şirket */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Şirket</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Hakkımızda</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Kariyer</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Basın</a></li>
              </ul>
            </div>
            
            {/* Destek */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Destek</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Yardım Merkezi</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Topluluk</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">İletişim</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300">Durum</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center relative">
            <div className="absolute top-0 inset-x-0">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
            </div>
            
            <p className="text-zinc-500 text-sm group hover:text-zinc-400 transition-colors duration-300">
              © 2023 Ders. <span className="text-purple-500/70 group-hover:text-purple-400 transition-colors duration-300">Tüm hakları saklıdır.</span>
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors duration-300 relative group">
                <span>Kullanım Şartları</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors duration-300 relative group">
                <span>Gizlilik Politikası</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors duration-300 relative group">
                <span>Çerez Politikası</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
