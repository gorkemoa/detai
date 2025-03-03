"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, PieChart, CheckCircle, CircleEllipsis, Circle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

// Görev, öncelik ve durum için tip tanımlamaları
type Priority = "HIGH" | "MEDIUM" | "LOW";
type Status = "TODO" | "IN_PROGRESS" | "DONE";

interface Course {
  title: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  course?: Course;
  courseId?: string;
  completionPercentage: number;
  progressLog?: string;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [showChartView, setShowChartView] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Görevleri API'den yükleme
  useEffect(() => {
    const fetchTasks = async () => {
      if (status !== "authenticated") return;
      
      try {
        const response = await fetch('/api/gorevler');
        
        if (!response.ok) {
          throw new Error('Görevler yüklenemedi');
        }
        
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Görev yükleme hatası:', error);
        toast({
          title: "Hata",
          description: "Görevler yüklenirken bir sorun oluştu.",
          variant: "destructive",
        });
      }
    };
    
    fetchTasks();
  }, [status]);

  // Görevin ilerleme yüzdesini belirle
  const getTaskProgress = (task: Task): number => {
    // Artık kullanıcının belirttiği ilerleme yüzdesini kullanıyoruz
    return task.completionPercentage;
  };

  // İlerleme durumu için renk belirle
  const getProgressColor = (task: Task): string => {
    const percentage = task.completionPercentage;
    
    if (percentage === 100) {
      return "bg-green-500";
    } else if (percentage >= 50) {
      return "bg-blue-500";
    } else if (percentage > 0) {
      return "bg-yellow-500";
    } else {
      return "bg-slate-500";
    }
  };

  // Durum simgesi belirle
  const getStatusIcon = (taskStatus: Status): React.ReactNode => {
    switch(taskStatus) {
      case "TODO": 
        return <Circle className="h-5 w-5 text-slate-500" />;
      case "IN_PROGRESS": 
        return <CircleEllipsis className="h-5 w-5 text-blue-500" />;
      case "DONE": 
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: 
        return null;
    }
  };

  // Görev durumu açıklamasını belirle
  const getStatusDescription = (task: Task): string => {
    if (task.progressLog) {
      return `İlerleme: %${task.completionPercentage} - ${task.progressLog}`;
    } else {
      return `İlerleme: %${task.completionPercentage}`;
    }
  };

  // Oturum yükleniyor
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Yükleniyor...</p>
      </div>
    );
  }

  // Oturum yoksa giriş sayfasına yönlendir
  if (status === "unauthenticated") {
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

  // Durum etiketini ve rengini belirle
  const getStatusBadge = (status: Status): React.ReactNode => {
    switch(status) {
      case "TODO":
        return <Badge variant="outline" className="bg-slate-100">Yapılacak</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="outline" className="bg-blue-100">Devam Ediyor</Badge>;
      case "DONE":
        return <Badge variant="outline" className="bg-green-100">Tamamlandı</Badge>;
      default:
        return null;
    }
  };

  // Filtrelenmiş görevleri getir
  const getFilteredTasks = (): Task[] => {
    if (statusFilter === "ALL") return tasks;
    return tasks.filter(task => task.status === statusFilter);
  };

  // Tarihi formatla
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
          detai
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Merhaba, {session?.user?.name}
            </span>
            <Link href="/api/auth/signout">
              <Button variant="outline" size="sm">
                Çıkış Yap
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Görevler</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowChartView(!showChartView)}
              className={showChartView ? "bg-muted" : ""}
              title={showChartView ? "Tablo görünümüne geç" : "Analiz görünümüne geç"}
            >
              {showChartView ? <BarChart className="h-5 w-5" /> : <PieChart className="h-5 w-5" />}
            </Button>
            <Link href="/dashboard/gorevler/yeni">
              <Button>
                Yeni Görev Ekle
              </Button>
            </Link>
          </div>
        </div>

        {/* Görev Detay Modal */}
        <Dialog open={selectedTask !== null} onOpenChange={(open) => !open && setSelectedTask(null)}>
          {selectedTask && (
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <DialogDescription>
                  {selectedTask.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-6">
                {/* İlerleme Durumu Dashboard */}
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h3 className="font-medium text-base mb-4">Görev İlerleme Durumu</h3>
                  
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(selectedTask.status)}
                    <span className="font-medium">{getStatusBadge(selectedTask.status)}</span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>İlerleme</span>
                      <span>{getTaskProgress(selectedTask)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(selectedTask)} rounded-full transition-all duration-500`} 
                        style={{width: `${getTaskProgress(selectedTask)}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    {getStatusDescription(selectedTask)}
                  </p>
                </div>
                
                {/* Detaylar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Öncelik:</span>
                    <span className={getPriorityColor(selectedTask.priority)}>
                      {getPriorityLabel(selectedTask.priority)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Son Tarih:</span>
                    <span>{formatDate(selectedTask.dueDate)}</span>
                  </div>
                  
                  {selectedTask.course && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ders:</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: selectedTask.course.color }}
                        ></div>
                        <span>{selectedTask.course.title}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  Kapat
                </Button>
                <Link href={`/dashboard/gorevler/${selectedTask.id}`}>
                  <Button variant="default">
                    Düzenle
                  </Button>
                </Link>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>

        {/* Filtreler */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={statusFilter === "ALL" ? "default" : "outline"} 
            onClick={() => setStatusFilter("ALL")}
          >
            Tümü
          </Button>
          <Button 
            variant={statusFilter === "TODO" ? "default" : "outline"} 
            onClick={() => setStatusFilter("TODO")}
          >
            Yapılacak
          </Button>
          <Button 
            variant={statusFilter === "IN_PROGRESS" ? "default" : "outline"} 
            onClick={() => setStatusFilter("IN_PROGRESS")}
          >
            Devam Eden
          </Button>
          <Button 
            variant={statusFilter === "DONE" ? "default" : "outline"} 
            onClick={() => setStatusFilter("DONE")}
          >
            Tamamlanan
          </Button>
        </div>

        {/* Görev Tablosu */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Görev</TableHead>
                  <TableHead>Ders</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Öncelik</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredTasks().length > 0 ? (
                  getFilteredTasks().map((task) => (
                    <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedTask(task)}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{task.title}</div>
                          <div className="text-sm text-muted-foreground">{task.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.course && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: task.course.color }}
                            ></div>
                            <span>{task.course.title}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(task.dueDate)}</TableCell>
                      <TableCell>
                        <span className={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/gorevler/${task.id}`} onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              Düzenle
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Filtreye uygun görev bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 detai. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
} 