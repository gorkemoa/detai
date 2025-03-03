"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BookOpenIcon, CheckIcon, ClockIcon, PlusIcon, ArrowRightIcon } from "lucide-react";
import { Priority, Status } from "@prisma/client";

// Tip tanımlamaları
type Course = {
  id: string;
  title: string;
  color: string;
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority: Priority;
  status: Status;
  completionPercentage: number;
  courseId?: string | null;
  course?: Course | null;
};

export default function DashboardPage() {
  const { status: sessionStatus } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    coursesCount: 0,
    tasksCount: 0,
    notesCount: 0,
    studyTime: 0, // dakika cinsinden
  });

  // Verileri yükle
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      Promise.all([
        fetch("/api/gorevler").then(res => res.json()),
        fetch("/api/dersler").then(res => res.json()),
      ])
        .then(([tasksData, coursesData]) => {
          setTasks(tasksData);
          
          // İstatistikleri hesapla
          const pendingTasks = tasksData.filter((task: Task) => task.status !== "DONE").length;
          
          setStats({
            coursesCount: coursesData.length,
            tasksCount: pendingTasks,
            notesCount: 0, // Not API'si hazır olduğunda burası güncellenecek
            studyTime: 0, // Çalışma süresi API'si hazır olduğunda güncellenecek
          });
        })
        .catch(error => {
          console.error("Veri yükleme hatası:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [sessionStatus]);

  // Oturum yükleniyor
  if (sessionStatus === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Oturum yoksa giriş sayfasına yönlendir
  if (sessionStatus === "unauthenticated") {
    redirect("/giris");
  }

  // Öncelik rengini belirle
  const getPriorityColor = (priority: Priority): string => {
    switch(priority) {
      case "HIGH": return "text-red-500";
      case "MEDIUM": return "text-yellow-500";
      case "LOW": return "text-green-500";
      default: return "";
    }
  };

  // Öncelik etiketini çevir
  const getPriorityLabel = (priority: Priority): string => {
    switch(priority) {
      case "HIGH": return "Yüksek";
      case "MEDIUM": return "Orta";
      case "LOW": return "Düşük";
      default: return "";
    }
  };

  // Durumu badge'e çevir
  const getStatusBadge = (status: Status) => {
    switch(status) {
      case "TODO": 
        return <Badge variant="outline" className="bg-slate-100">Yapılacak</Badge>;
      case "IN_PROGRESS": 
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Devam Ediyor</Badge>;
      case "DONE": 
        return <Badge variant="outline" className="bg-green-100 text-green-800">Tamamlandı</Badge>;
      default: 
        return null;
    }
  };

  // Tarihi formatla
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'Tarih belirtilmemiş';
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Yaklaşan görevler - tamamlanmamış ve tarihi yakın
  const upcomingTasks = tasks
    .filter(task => task.status !== "DONE")
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5); // İlk 5 görev

  return (
    <div className="flex flex-col min-h-screen">
      {/* Ana İçerik */}
      <main className="flex-1 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Kontrol Paneli</h1>
            <p className="text-muted-foreground">Derslerinize ve görevlerinize genel bakış</p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <Link href="/dashboard/dersler/ekle">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Yeni Ders
              </Button>
            </Link>
            <Link href="/dashboard/gorevler/ekle">
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Yeni Görev
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white hover:shadow-md transition-shadow border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Dersler</CardTitle>
                <BookOpenIcon className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>Toplam ders sayısı</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.coursesCount}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Görevler</CardTitle>
                <CheckIcon className="h-5 w-5 text-yellow-500" />
              </div>
              <CardDescription>Bekleyen görevler</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.tasksCount}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Notlar</CardTitle>
                <BookOpenIcon className="h-5 w-5 text-blue-500" />
              </div>
              <CardDescription>Toplam not sayısı</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.notesCount}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Çalışma Süresi</CardTitle>
                <ClockIcon className="h-5 w-5 text-green-500" />
              </div>
              <CardDescription>Bu hafta</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.studyTime} dk</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard/dersler/yeni">
            <Button className="w-full flex items-center justify-center gap-2 bg-white text-primary hover:bg-primary hover:text-white transition-colors" variant="outline">
              <PlusIcon size={16} /> Yeni Ders Ekle
            </Button>
          </Link>
          <Link href="/dashboard/gorevler/yeni">
            <Button className="w-full flex items-center justify-center gap-2 bg-white text-primary hover:bg-primary hover:text-white transition-colors" variant="outline">
              <PlusIcon size={16} /> Yeni Görev Ekle
            </Button>
          </Link>
          <Link href="/dashboard/notlar/yeni">
            <Button className="w-full flex items-center justify-center gap-2 bg-white text-primary hover:bg-primary hover:text-white transition-colors" variant="outline">
              <PlusIcon size={16} /> Yeni Not Ekle
            </Button>
          </Link>
        </div>
        
        {/* Recent Tasks */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Yaklaşan Görevler</h2>
          <Link href="/dashboard/gorevler">
            <Button variant="ghost" className="flex items-center gap-1 text-primary">
              Tümünü Gör <ArrowRightIcon size={16} />
            </Button>
          </Link>
        </div>
        
        <Card className="mb-8 bg-white shadow-sm">
          <CardContent className="p-0">
            {upcomingTasks.length > 0 ? (
              <div className="divide-y">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{task.title}</h3>
                        {getStatusBadge(task.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        {task.course && (
                          <div className="flex items-center gap-1">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: task.course.color }}
                            ></div>
                            <span>{task.course.title}</span>
                          </div>
                        )}
                        <span>•</span>
                        <span className={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)} öncelik
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <CalendarIcon size={14} />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.completionPercentage > 0 && (
                        <div className="hidden sm:block text-sm text-muted-foreground mr-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-200 rounded-full h-2 w-24">
                              <div 
                                className="bg-primary rounded-full h-2" 
                                style={{ width: `${task.completionPercentage}%` }}
                              ></div>
                            </div>
                            <span>%{task.completionPercentage}</span>
                          </div>
                        </div>
                      )}
                      <Link href={`/dashboard/gorevler/${task.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          Detaylar
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-8 flex flex-col items-center">
                <div className="mb-2 p-4 rounded-full bg-gray-100">
                  <CheckIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p>Tamamlanmamış görev bulunmuyor.</p>
                <Link href="/dashboard/gorevler/yeni" className="mt-4">
                  <Button size="sm" className="flex items-center gap-2">
                    <PlusIcon size={16} /> Görev Ekle
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Study Sessions */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Çalışma Oturumları</h2>
          <Link href="/dashboard/calisma">
            <Button variant="ghost" className="flex items-center gap-1 text-primary">
              Tümünü Gör <ArrowRightIcon size={16} />
            </Button>
          </Link>
        </div>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="text-muted-foreground text-center py-8 flex flex-col items-center">
              <div className="mb-2 p-4 rounded-full bg-gray-100">
                <ClockIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p>Henüz çalışma oturumu bulunmuyor.</p>
              <Link href="/dashboard/calisma" className="mt-4">
                <Button className="flex items-center gap-2">
                  <ClockIcon size={16} /> Çalışma Oturumu Başlat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-white mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 detai. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
} 