"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Form şeması
const formSchema = z.object({
  title: z.string().min(2, "Başlık en az 2 karakter olmalıdır.").max(100, "Başlık en fazla 100 karakter olabilir."),
  description: z.string().max(500, "Açıklama en fazla 500 karakter olabilir.").optional(),
  dueDate: z.date().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  courseId: z.string().nullable(),
});

// Ders tipi tanımı
interface Course {
  id: string;
  title: string;
  color: string;
}

export default function NewTaskPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isAddingBasicCourses, setIsAddingBasicCourses] = useState(false);

  // Form tanımını hook kurallarına uygun şekilde en üst seviyeye taşıdık
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      courseId: null,
    },
  });

  // Dersleri getir
  useEffect(() => {
    const fetchCourses = async () => {
      if (status !== "authenticated") return;
      
      try {
        setIsLoadingCourses(true);
        const response = await fetch('/api/dersler');
        
        if (!response.ok) {
          throw new Error('Dersler yüklenemedi');
        }
        
        const coursesData = await response.json();
        setCourses(coursesData);
      } catch (error) {
        console.error('Dersler yüklenirken hata:', error);
        toast({
          title: "Hata",
          description: "Dersler yüklenirken bir sorun oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCourses(false);
      }
    };
    
    fetchCourses();
  }, [status]);

  // Temel dersleri yükle
  const addBasicCourses = async () => {
    if (status !== "authenticated") return;
    
    try {
      setIsAddingBasicCourses(true);
      const response = await fetch('/api/dersler', {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error('Temel dersler yüklenemedi');
      }
      
      const result = await response.json();
      
      // Dersleri yeniden yükle
      const coursesResponse = await fetch('/api/dersler');
      
      if (!coursesResponse.ok) {
        throw new Error('Dersler yüklenemedi');
      }
      
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);
      
      toast({
        title: "Başarılı",
        description: `${result.addedCount} temel ders başarıyla eklendi.`,
      });
    } catch (error) {
      console.error('Temel dersler yüklenirken hata:', error);
      toast({
        title: "Hata",
        description: "Temel dersler yüklenirken bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsAddingBasicCourses(false);
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

  // Form gönderildiğinde
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // API'ye gönderilecek veri
    const taskData = {
      ...values,
      // Eğer courseId "none" veya null ise, null olarak gönder
      courseId: values.courseId === "none" ? null : values.courseId,
      status: "TODO",
      userId: session?.user?.id,
    };
    
    try {
      // API'ye görev ekleme isteği gönderiyoruz
      const response = await fetch('/api/gorevler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        throw new Error('Görev eklenirken bir hata oluştu');
      }
      
      toast({
        title: "Görev oluşturuldu",
        description: "Görev başarıyla eklendi.",
      });
      router.push("/dashboard/gorevler");
    } catch (error) {
      console.error('Görev ekleme hatası:', error);
      toast({
        title: "Hata",
        description: "Görev eklenirken bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/gorevler">
            <Button variant="ghost" size="sm">
              ← Geri
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Yeni Görev Ekle</h1>
        </div>

        <div className="max-w-2xl mx-auto">
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
                      <Input placeholder="Görev başlığını girin" {...field} />
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
                    <FormLabel>Görev Açıklaması</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Görev ile ilgili ayrıntıları girin"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
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
                    <FormLabel>İlgili Ders (Opsiyonel)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bir ders seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Ders Seçilmedi</SelectItem>
                        {isLoadingCourses ? (
                          <SelectItem value="loading" disabled>Yükleniyor...</SelectItem>
                        ) : courses.length > 0 ? (
                          courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }}></div>
                                <span>{course.title}</span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-courses" disabled>
                            Ders bulunamadı. Temel dersleri ekleyin.
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {courses.length === 0 && (
                      <div className="mt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={addBasicCourses} 
                          disabled={isAddingBasicCourses}
                          className="w-full"
                        >
                          {isAddingBasicCourses ? 'Dersler Ekleniyor...' : 'Temel Dersleri Ekle'}
                        </Button>
                      </div>
                    )}
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
                    <FormLabel>Bitiş Tarihi (Opsiyonel)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bir öncelik seçin" />
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

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Ekleniyor..." : "Görev Ekle"}
                </Button>
              </div>
            </form>
          </Form>
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