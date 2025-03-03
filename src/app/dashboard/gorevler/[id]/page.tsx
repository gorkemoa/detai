"use client";

import { useState, useEffect } from "react";
import React, { use } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

// Form şeması
const formSchema = z.object({
  title: z.string().min(2, "Başlık en az 2 karakter olmalıdır.").max(100, "Başlık en fazla 100 karakter olabilir."),
  description: z.string().max(500, "Açıklama en fazla 500 karakter olabilir.").optional(),
  dueDate: z.date().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  courseId: z.string().nullable(),
});

// Task için tip tanımı
interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  courseId?: string | null;
  completionPercentage: number;
  progressLog?: string;
}

// İlerleme kaydı için tip tanımı
interface ProgressEntry {
  id: string;
  taskId: string;
  percentage: number;
  description: string;
  createdAt: string;
}

// Ders tipi tanımı
interface Course {
  id: string;
  title: string;
  color: string;
}

interface TaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditTaskPage({ params }: TaskPageProps) {
  // params'ı React.use() ile açarak kullanıyoruz
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  
  // State tanımları
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // İlerleme kayıtları için state'ler
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [isAddingProgress, setIsAddingProgress] = useState(false);
  const [newProgressPercentage, setNewProgressPercentage] = useState<number>(0);
  const [newProgressDescription, setNewProgressDescription] = useState<string>("");
  // Görev tamamlama onay diyaloğu için state
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  // Görevin tamamlanmış olup olmadığını takip eden state
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

  // Form tanımı
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      courseId: null,
      dueDate: undefined
    },
  });

  // Tüm veri yükleme işlemlerini tek bir useEffect içinde toplayalım
  useEffect(() => {
    // Oturum kontrolü
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated") {
      redirect("/giris");
    }

    // Görev bilgilerini getir
    const fetchTask = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/gorevler/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "Görev bulunamadı",
              description: "Aradığınız görev bulunamadı.",
              variant: "destructive",
            });
            router.push("/dashboard/gorevler");
            return;
          }
          throw new Error("Görev yüklenirken bir sorun oluştu");
        }

        const data = await response.json();
        setTask(data);
        
        // Görevin tamamlanmış olup olmadığını kontrol et
        setIsTaskCompleted(data.status === "DONE");

        // Form varsayılan değerlerini ayarla
        form.reset({
          title: data.title,
          description: data.description || "",
          priority: data.priority,
          status: data.status,
          courseId: data.courseId,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        });
      } catch (error) {
        console.error("Görev yüklenirken hata:", error);
        toast({
          title: "Hata",
          description: "Görev yüklenirken bir sorun oluştu.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Dersleri getir
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/dersler");
        if (!response.ok) {
          throw new Error("Dersler yüklenirken bir sorun oluştu");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Dersler yüklenirken hata:", error);
        toast({
          title: "Hata",
          description: "Dersler yüklenirken bir sorun oluştu.",
          variant: "destructive",
        });
      }
    };

    // İlerleme kayıtlarını getir
    const fetchProgressEntries = async () => {
      setIsLoadingProgress(true);
      try {
        const response = await fetch(`/api/gorevler/${id}/ilerleme`);
        if (!response.ok) {
          throw new Error("İlerleme kayıtları getirilemedi");
        }
        const data = await response.json();
        setProgressEntries(data);
      } catch (error) {
        console.error("İlerleme kayıtları yüklenirken hata:", error);
        toast({
          title: "Hata",
          description: "İlerleme kayıtları yüklenirken bir sorun oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProgress(false);
      }
    };

    // Verileri getir
    fetchTask();
    fetchCourses();
    fetchProgressEntries();
  }, [id, form, sessionStatus, router]);

  // Görev güncelleme
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSaving(true);
    
    try {
      // Değerleri hazırla - courseId için null kontrolü yapıyoruz
      const updatedValues = {
        ...values,
        courseId: values.courseId === "none" ? null : values.courseId,
      };
      
      // API'ye güncelleme isteği gönderiyoruz
      const response = await fetch(`/api/gorevler/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedValues),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API hata yanıtı:', errorData);
        throw new Error(`Görev güncellenemedi: ${errorData.error || response.statusText}`);
      }
      
      const updatedTask = await response.json();
      setTask(updatedTask);
      
      toast({
        title: "Görev güncellendi",
        description: "Görev başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Görev güncellenirken hata:", error);
      toast({
        title: "Hata",
        description: "Görev güncellenirken bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Görev silme
  const deleteTask = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/gorevler/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Görev silinemedi");
      }

      toast({
        title: "Görev silindi",
        description: "Görev başarıyla silindi.",
      });

      // Listeye geri dön
      router.push("/dashboard/gorevler");
    } catch (error) {
      console.error("Görev silinirken hata:", error);
      toast({
        title: "Hata",
        description: "Görev silinirken bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Yeni ilerleme kaydı ekle
  const addProgressEntry = async () => {
    if (!newProgressDescription.trim()) {
      toast({
        title: "Hata",
        description: "İlerleme açıklaması boş olamaz.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingProgress(true);
    try {
      const response = await fetch(`/api/gorevler/${id}/ilerleme`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          percentage: newProgressPercentage,
          description: newProgressDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "İlerleme kaydedilemedi");
      }

      // Yeni ilerleme kaydını ekleyelim
      const newEntry = await response.json();
      
      // State'i güncelleyelim
      setProgressEntries((prev) => [...prev, newEntry]);
      
      // Task'in ilerleme yüzdesini güncelle
      if (task) {
        setTask({
          ...task,
          completionPercentage: newProgressPercentage,
        });
        
        // Eğer ilerleme %100 ve görev durumu henüz DONE değilse onay diyaloğunu göster
        if (newProgressPercentage === 100 && task.status !== "DONE") {
          setShowCompletionDialog(true);
        }
      }

      // Formu temizleyelim
      setNewProgressDescription("");
      
      toast({
        title: "Başarılı",
        description: "İlerleme kaydı başarıyla eklendi.",
      });
    } catch (error) {
      console.error("İlerleme eklenirken hata:", error);
      toast({
        title: "Hata",
        description: "İlerleme kaydedilirken bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsAddingProgress(false);
    }
  };

  // Görevi tamamlandı olarak işaretle
  const markTaskAsCompleted = async () => {
    if (!task) return;
    
    setSaving(true);
    try {
      // Görev durumunu DONE olarak güncelle
      const updatedValues = {
        ...task,
        status: "DONE" as const,
      };
      
      const response = await fetch(`/api/gorevler/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedValues),
      });
      
      if (!response.ok) {
        throw new Error("Görev durumu güncellenemedi");
      }
      
      const updatedTask = await response.json();
      setTask(updatedTask);
      
      // Form değerlerini güncelle
      form.setValue("status", "DONE");
      
      // Görevin tamamlanmış olduğunu belirt
      setIsTaskCompleted(true);
      
      toast({
        title: "Görev tamamlandı",
        description: "Görev başarıyla tamamlandı olarak işaretlendi.",
      });
    } catch (error) {
      console.error("Görev durumu güncellenirken hata:", error);
      toast({
        title: "Hata",
        description: "Görev durumu güncellenirken bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setShowCompletionDialog(false);
    }
  };

  // Oturum yükleniyor
  if (sessionStatus === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Sayfa içeriği
  return (
    <div className="flex min-h-screen flex-col">
      {/* Onay Diyaloğu */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Görev Tamamlandı mı?</AlertDialogTitle>
            <AlertDialogDescription>
              İlerleme %100&apos;e ulaştı. Görevi tamamlandı olarak işaretlemek ister misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hayır, Şimdi Değil</AlertDialogCancel>
            <AlertDialogAction onClick={markTaskAsCompleted}>
              Evet, Tamamlandı Olarak İşaretle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold text-primary">detai</span>
          </Link>
          <nav className="ml-auto flex gap-4">
            <Link href="/dashboard/gorevler" className="text-sm font-medium">
              Görevler
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {isTaskCompleted ? "Tamamlanan Görev Özeti" : "Görev Düzenle"}
            </h1>
            <Link href="/dashboard/gorevler" className="text-sm text-muted-foreground hover:underline">
              Görevlere Dön
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Tamamlanan görev için özet sayfası */}
              {isTaskCompleted ? (
                <div className="space-y-8">
                  {/* Görev Özet Bilgileri */}
                  <div className="rounded-lg border p-6 space-y-5">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold">{task?.title}</h2>
                      {task?.description && (
                        <p className="text-muted-foreground">{task.description}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Öncelik</p>
                        <div className="flex items-center">
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-md ${
                            task?.priority === "HIGH" ? "bg-red-100 text-red-800" :
                            task?.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {task?.priority === "HIGH" ? "Yüksek" :
                             task?.priority === "MEDIUM" ? "Orta" : "Düşük"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Durum</p>
                        <div className="flex items-center">
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-800">
                            Tamamlandı
                          </span>
                        </div>
                      </div>
                      
                      {task?.dueDate && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Bitiş Tarihi</p>
                          <p>{format(new Date(task.dueDate), "PPP", { locale: tr })}</p>
                        </div>
                      )}
                      
                      {task?.courseId && courses.find(c => c.id === task.courseId) && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">İlgili Ders</p>
                          <div className="flex items-center">
                            {(() => {
                              const course = courses.find(c => c.id === task?.courseId);
                              return course ? (
                                <>
                                  <div 
                                    className="mr-2 h-3 w-3 rounded-full" 
                                    style={{ backgroundColor: course.color }}
                                  ></div>
                                  {course.title}
                                </>
                              ) : null;
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Tamamlanma Durumu</p>
                        <p className="text-sm font-medium">100%</p>
                      </div>
                      <Progress value={100} className="h-2 w-full" />
                    </div>
                  </div>
                  
                  {/* İlerleme Kayıtları Özeti */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">İlerleme Geçmişi</h3>
                    
                    {isLoadingProgress ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : progressEntries.length === 0 ? (
                      <div className="bg-muted p-4 rounded-lg text-center text-muted-foreground">
                        <p>Kaydedilmiş ilerleme bulunmuyor.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {progressEntries.map((entry) => (
                          <div key={entry.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">İlerleme: {entry.percentage}%</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(entry.createdAt).toLocaleString('tr-TR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <Progress value={entry.percentage} className="h-2 w-full mb-3" />
                            <p className="text-sm">{entry.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Görev Düzenleme Formu */}
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Başlık */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Görev Başlığı</FormLabel>
                            <FormControl>
                              <Input placeholder="Görev başlığı girin" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Açıklama */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Açıklama</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Görev açıklaması girin (opsiyonel)"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Bitiş Tarihi */}
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Bitiş Tarihi</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: tr })
                                    ) : (
                                      <span>Tarih seçin</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Öncelik */}
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Öncelik</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Öncelik seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="LOW">Düşük</SelectItem>
                                <SelectItem value="MEDIUM">Orta</SelectItem>
                                <SelectItem value="HIGH">Yüksek</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Durum */}
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Durum</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Durum seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="TODO">Yapılacak</SelectItem>
                                <SelectItem value="IN_PROGRESS">Devam Ediyor</SelectItem>
                                <SelectItem value="DONE">Tamamlandı</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* İlgili Ders */}
                      <FormField
                        control={form.control}
                        name="courseId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>İlgili Ders</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value || "none"}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Ders seçin (opsiyonel)" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">
                                  <span className="text-muted-foreground">Ders seçilmedi</span>
                                </SelectItem>
                                {courses.map((course) => (
                                  <SelectItem key={course.id} value={course.id}>
                                    <div className="flex items-center">
                                      <div 
                                        className="mr-2 h-3 w-3 rounded-full" 
                                        style={{ backgroundColor: course.color }}
                                      ></div>
                                      {course.title}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between">
                        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive">
                              {deleting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Siliniyor...
                                </>
                              ) : (
                                "Görevi Sil"
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Bu görevi silmek istediğinize emin misiniz?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu işlem geri alınamaz. Bu görev ve tüm ilerleme kayıtları kalıcı olarak silinecektir.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction onClick={deleteTask} className="bg-destructive text-destructive-foreground">
                                Görevi Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        <Button type="submit" disabled={saving}>
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Kaydediliyor...
                            </>
                          ) : (
                            "Değişiklikleri Kaydet"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>

                  {/* İlerleme Bölümü */}
                  <div className="mt-10 space-y-6">
                    <div className="rounded-lg border p-6 space-y-5">
                      <h3 className="text-lg font-semibold">Görev İlerlemesi</h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">Tamamlanma Durumu</p>
                          <p className="text-sm font-medium">{task?.completionPercentage}%</p>
                        </div>
                        <Progress value={task?.completionPercentage} className="h-2 w-full" />
                      </div>
                      
                      {/* Yeni İlerleme Ekle */}
                      <div className="space-y-4 mt-4">
                        <h4 className="text-md font-medium">Yeni İlerleme Ekle</h4>
                        
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <label htmlFor="progress-slider" className="text-sm font-medium">
                              İlerleme Yüzdesi: {newProgressPercentage}%
                            </label>
                            <input
                              id="progress-slider"
                              type="range"
                              min="0"
                              max="100"
                              value={newProgressPercentage}
                              onChange={(e) => setNewProgressPercentage(parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <label htmlFor="progress-description" className="text-sm font-medium">
                              İlerleme Açıklaması
                            </label>
                            <Textarea
                              id="progress-description"
                              placeholder="Bu aşamada ne yaptığınızı açıklayın"
                              value={newProgressDescription}
                              onChange={(e) => setNewProgressDescription(e.target.value)}
                              rows={3}
                            />
                          </div>
                          
                          <Button 
                            onClick={addProgressEntry} 
                            disabled={isAddingProgress || !newProgressDescription.trim()}
                            className="w-full"
                          >
                            {isAddingProgress ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Kaydediliyor...
                              </>
                            ) : (
                              "İlerleme Kaydet"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* İlerleme Kayıtları Listesi */}
                    <div className="space-y-4 mt-6">
                      <h3 className="font-semibold text-lg">İlerleme Geçmişi</h3>
                      
                      {isLoadingProgress ? (
                        <div className="flex justify-center p-4">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : progressEntries.length === 0 ? (
                        <div className="bg-muted p-4 rounded-lg text-center text-muted-foreground">
                          <p>Henüz kaydedilmiş ilerleme bulunmuyor.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {progressEntries.map((entry) => (
                            <div key={entry.id} className="border rounded-lg p-4 transition-all hover:border-primary/50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">İlerleme: {entry.percentage}%</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(entry.createdAt).toLocaleString('tr-TR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <Progress value={entry.percentage} className="h-2 w-full mb-3" />
                              <p className="text-sm">{entry.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
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