"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, ChevronRight, Clock, CheckCircle, XCircle, CircleDashed, BookOpen, Trash2, ArrowRightCircle, LayoutGrid, RotateCcw } from "lucide-react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React from 'react';

// Tip tanımlamaları
type Course = {
  id: string;
  title: string;
  color: string;
};

type QuestionSession = {
  id: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  emptyAnswers: number;
  courseId: string | null;
  course: Course | null;
};

// Çalışma oturumu için tip tanımı
type StudySession = {
  id: string;
  courseId: string;
  topic: string; // Çalışılacak konu
  position: { x: number; y: number };
  targetQuestions: number; // Hedeflenen soru sayısı
  plannedDuration: number; // Planlanan süre (dakika)
  status: 'planned' | 'in-progress' | 'completed'; // Durum
  totalQuestions?: number; // Tamamlanınca toplam soru
  correctAnswers?: number; // Tamamlanınca doğru sayısı
  wrongAnswers?: number; // Tamamlanınca yanlış sayısı
  emptyAnswers?: number; // Tamamlanınca boş sayısı
  duration?: number; // Tamamlanınca geçen süre (saniye)
  date: Date;
  nextSessionId?: string; // Sonraki çalışma oturumu ID'si (ok çizmek için)
};

// Sürükleme öğesi tipi
const ItemTypes = {
  COURSE: 'course',
  STUDY_SESSION: 'studySession'
};

// Silinen son 5 öğeyi tutar - geri alma işlemi için
type DeletedItem = {
  item: StudySession;
  timestamp: number;
};

// Sürüklenebilir ders elementi
const DraggableCourse = ({ course }: { course: Course }) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COURSE,
    item: { courseId: course.id, title: course.title, color: course.color, type: ItemTypes.COURSE },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Ref'i bağla
  useEffect(() => {
    if (dragRef.current) {
      drag(dragRef.current);
    }
  }, [drag]);

  return (
    <div
      ref={dragRef}
      className={`cursor-move p-3 rounded-md mb-2 flex items-center gap-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ 
        backgroundColor: course.color + '20', 
        border: `1px solid ${course.color}`
      }}
    >
      <BookOpen className="h-4 w-4" style={{ color: course.color }} />
      <span>{course.title}</span>
    </div>
  );
};

// Sürüklenebilir çalışma kartı
const DraggableStudySessionCard = ({ 
  session, 
  onDelete, 
  onStart, 
  onComplete, 
  onConnect,
  courses, 
  formatDuration, 
  formatMinutes, 
  connectingMode,
  setConnectingMode,
  connectingSourceId,
  setConnectingSourceId,
  onMove
}: { 
  session: StudySession, 
  onDelete: (id: string) => void,
  onStart: (id: string) => void,
  onComplete: (id: string, data: { 
    totalQuestions: number, 
    correctAnswers: number, 
    wrongAnswers: number, 
    emptyAnswers: number, 
    duration: number 
  }) => void,
  onConnect: (sourceId: string, targetId: string) => void,
  courses: Course[],
  formatDuration: (seconds: number | null) => string,
  formatMinutes: (minutes: number) => string,
  connectingMode: boolean,
  setConnectingMode: (mode: boolean) => void,
  connectingSourceId: string | null,
  setConnectingSourceId: (id: string | null) => void,
  onMove: (id: string, position: { x: number, y: number }) => void
}) => {
  // Genel değişkenler
  const cardRef = useRef<HTMLDivElement>(null);
  const courseInfo = courses.find((c: Course) => c.id === session.courseId);
  
  // Dialog ve veri yönetimi
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [completionData, setCompletionData] = useState({
    totalQuestions: session.targetQuestions || 0,
    correctAnswers: 0, 
    wrongAnswers: 0,
    emptyAnswers: 0,
    duration: 0
  });
  
  // Bağlantı durumu hesaplama
  const isSource = connectingMode && connectingSourceId === session.id;
  const isTarget = connectingMode && connectingSourceId !== null && connectingSourceId !== session.id;
  
  // Kart sürükleme fonksiyonları
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.STUDY_SESSION,
    item: { sessionId: session.id, type: ItemTypes.STUDY_SESSION },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    // Anlık konum güncellemesi için isDragging durumunda pozisyonu güncelle
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (!dropResult && isDragging) {
        // Sürükleme işlemi tamamlandığında pozisyon güncellemesini yap
        const offset = monitor.getDifferenceFromInitialOffset();
        if (offset) {
          const newPosition = {
            x: session.position.x + offset.x,
            y: session.position.y + offset.y
          };
          // Pozisyonu güncelle
          onMove(session.id, newPosition);
        }
      }
    }
  }));
  
  // Ref'i bağla
  useEffect(() => {
    if (cardRef.current) {
      drag(cardRef.current);
    }
  }, [drag]);
  
  // Mouse takip işlemleri için konum güncellemesi
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        // Fare hareket ettiğinde kart konumunu canlı güncelle
        // Bu sayede sürükleme daha hızlı ve tepkisel olur
        const offset = {
          x: e.clientX - session.position.x - 125, // kartın genişliğinin yarısı
          y: e.clientY - session.position.y - 90  // kartın yüksekliğinin yarısı
        };
        
        onMove(session.id, {
          x: session.position.x + offset.x / 4, // Yavaş takip için böldük
          y: session.position.y + offset.y / 4
        });
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDragging, session.id, session.position, onMove]);
  
  // Kart tamamlama işlevi
  const handleComplete = () => {
    onComplete(session.id, completionData);
    setOpenCompleteDialog(false);
  };
  
  // Bağlantı oluşturma işlevi
  const handleConnectClick = () => {
    if (connectingMode && connectingSourceId) {
      // Zaten bağlantı modundayız ve bu kart hedef kart
      if (connectingSourceId !== session.id) { // Kendisiyle bağlantı yapılmasını engelle
        onConnect(connectingSourceId, session.id);
      } else {
        // Bağlantı modunu iptal et
        setConnectingMode(false);
      }
    } else {
      // Bağlantı modunu başlat ve bu kartı kaynak kart olarak işaretle
      setConnectingMode(true);
      setConnectingSourceId(session.id);
    }
  };
  
  // Kartın stil özellikleri
  const cardStyle = {
    position: 'absolute',
    left: `${session.position.x}px`,
    top: `${session.position.y}px`,
    width: '250px',
    backgroundColor: '#ffffff',
    border: `2px solid ${courseInfo?.color || '#ccc'}`,
    borderRadius: '10px',
    padding: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    zIndex: isDragging ? 100 : (isSource || isTarget ? 50 : 20),
    opacity: isDragging ? 0.6 : 1,
    cursor: 'move',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  } as const;
  
  // Kaynak veya hedef kartlar için özel stiller
  const specialStyles = {
    ...(isSource && {
      boxShadow: `0 0 0 3px ${courseInfo?.color || '#0284c7'}40, 0 4px 10px rgba(0,0,0,0.1)`,
      borderColor: courseInfo?.color || '#0284c7',
    }),
    ...(isTarget && {
      boxShadow: `0 0 0 3px #22c55e40, 0 4px 10px rgba(0,0,0,0.1)`,
      borderColor: '#22c55e',
    }),
  };
  
  // Card render edilir
  return (
    <>
      <div 
        ref={cardRef}
        style={{...cardStyle, ...specialStyles}} 
      >
        <div className="flex justify-between items-center mb-3">
          <div 
            className="text-xs py-1 px-2 rounded-full" 
            style={{ 
              backgroundColor: courseInfo?.color + '20',
              color: courseInfo?.color
            }}
          >
            {courseInfo?.title}
          </div>
          <div className="flex items-center gap-1">
            {session.status === 'planned' && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => onStart(session.id)}
                title="Çalışmayı başlat"
              >
                <Clock className="h-4 w-4 text-blue-500" />
              </Button>
            )}
            {session.status === 'in-progress' && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => setOpenCompleteDialog(true)}
                title="Çalışmayı tamamla"
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleConnectClick}
              title={connectingMode ? "Bu derse bağlan" : "Bu dersten diğerine bağlantı oluştur"}
            >
              <ArrowRightCircle className={`h-4 w-4 ${isSource ? 'text-blue-500' : 
                                                      isTarget ? 'text-green-500' : 
                                                      'text-gray-500'}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => onDelete(session.id)}
              title="Sil"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm font-medium mb-2">{session.topic}</div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div className={`flex flex-col ${session.status === 'completed' ? 'text-gray-500' : 'text-blue-600'}`}>
            <span className="text-xs text-gray-500">Hedef Soru</span>
            <span className="font-semibold">{session.targetQuestions}</span>
          </div>
          <div className={`flex flex-col ${session.status === 'completed' ? 'text-gray-500' : 'text-purple-600'}`}>
            <span className="text-xs text-gray-500">Planlanan Süre</span>
            <span className="font-semibold">{formatMinutes(session.plannedDuration)}</span>
          </div>
          
          {session.status === 'completed' && (
            <>
              <div className="flex flex-col text-green-600 mt-2">
                <span className="text-xs text-gray-500">Doğru</span>
                <span className="font-semibold">{session.correctAnswers}</span>
              </div>
              <div className="flex flex-col text-red-600 mt-2">
                <span className="text-xs text-gray-500">Yanlış</span>
                <span className="font-semibold">{session.wrongAnswers}</span>
              </div>
              <div className="flex flex-col text-yellow-600">
                <span className="text-xs text-gray-500">Boş</span>
                <span className="font-semibold">{session.emptyAnswers}</span>
              </div>
              <div className="flex flex-col text-blue-600">
                <span className="text-xs text-gray-500">Süre</span>
                <span className="font-semibold">{formatDuration(session.duration || null)}</span>
              </div>
            </>
          )}
        </div>
        
        {/* Durum göstergesi */}
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div 
              className={`h-2 w-2 rounded-full ${
                session.status === 'planned' ? 'bg-blue-500' : 
                session.status === 'in-progress' ? 'bg-orange-500' : 'bg-green-500'
              }`} 
            />
            <span className="text-xs text-gray-500">
              {session.status === 'planned' ? 'Planlandı' : 
               session.status === 'in-progress' ? 'Devam Ediyor' : 'Tamamlandı'}
            </span>
          </div>
          <span className="text-xs text-gray-400">{new Date(session.date).toLocaleDateString('tr-TR')}</span>
        </div>
      </div>
      
      {/* Çalışma tamamlama dialog */}
      <Dialog open={openCompleteDialog} onOpenChange={setOpenCompleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Çalışmayı Tamamla</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="totalQuestions">Toplam Soru Sayısı</Label>
              <Input 
                id="totalQuestions" 
                type="number" 
                min={0}
                value={completionData.totalQuestions}
                onChange={(e) => setCompletionData({
                  ...completionData, 
                  totalQuestions: parseInt(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="correctAnswers">Doğru</Label>
                <Input 
                  id="correctAnswers" 
                  type="number" 
                  min={0}
                  value={completionData.correctAnswers}
                  onChange={(e) => setCompletionData({
                    ...completionData, 
                    correctAnswers: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="wrongAnswers">Yanlış</Label>
                <Input 
                  id="wrongAnswers" 
                  type="number" 
                  min={0}
                  value={completionData.wrongAnswers}
                  onChange={(e) => setCompletionData({
                    ...completionData, 
                    wrongAnswers: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emptyAnswers">Boş</Label>
                <Input 
                  id="emptyAnswers" 
                  type="number" 
                  min={0}
                  value={completionData.emptyAnswers}
                  onChange={(e) => setCompletionData({
                    ...completionData, 
                    emptyAnswers: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="duration">Süre (Saniye)</Label>
              <Input 
                id="duration" 
                type="number" 
                min={0}
                value={completionData.duration}
                onChange={(e) => setCompletionData({
                  ...completionData, 
                  duration: parseInt(e.target.value) || 0
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleComplete}>Tamamla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Çalışma Alanı (Drop Zone)
const StudyArea = ({ 
  onDrop, 
  onMove,
  studySessions, 
  onDeleteSession, 
  onRestoreSession,
  onStartSession, 
  onCompleteSession,
  onConnectSessions,
  courses, 
  formatDuration, 
  formatMinutes,
  deletedSessions
}: { 
  onDrop: (item: { courseId: string, title: string, color: string }, position: { x: number, y: number }) => void,
  onMove: (id: string, position: { x: number, y: number }) => void,
  studySessions: StudySession[],
  onDeleteSession: (id: string) => void,
  onRestoreSession: (id: string) => void,
  onStartSession: (id: string) => void,
  onCompleteSession: (id: string, data: { 
    totalQuestions: number, 
    correctAnswers: number, 
    wrongAnswers: number, 
    emptyAnswers: number, 
    duration: number 
  }) => void,
  onConnectSessions: (sourceId: string, targetId: string) => void,
  courses: Course[],
  formatDuration: (seconds: number | null) => string,
  formatMinutes: (minutes: number) => string,
  deletedSessions: DeletedItem[]
}) => {
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [connectingMode, setConnectingMode] = useState(false);
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  
  // Viewport boyutunu takip et 
  useEffect(() => {
    // Pencere boyutu değişikliklerini gözlemle
    const handleResize = () => {
      // Gerekirse ek işlemler burada yapılabilir
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Kurs sürükleme işlemi
  const [, drop] = useDrop(() => ({
    accept: [ItemTypes.COURSE, ItemTypes.STUDY_SESSION],
    drop: (item: { courseId?: string, title?: string, color?: string, sessionId?: string, type: string }, monitor) => {
      const delta = monitor.getClientOffset();
      if (delta && dropAreaRef.current && contentRef.current) {
        const dropAreaRect = dropAreaRef.current.getBoundingClientRect();
        
        // Fare pozisyonunu scale ve translate değerlerini dikkate alarak hesapla
        const x = (delta.x - dropAreaRect.left - position.x) / scale;
        const y = (delta.y - dropAreaRect.top - position.y) / scale;
        
        if (item.type === ItemTypes.STUDY_SESSION) {
          // Mevcut bir çalışma oturumunu taşı
          if (item.sessionId) {
            onMove(item.sessionId, { x, y });
          }
        } else if (item.type === ItemTypes.COURSE) {
          // Yeni bir kurs öğesi bırakılıyor
          if (item.courseId && item.title && item.color) {
            onDrop({ courseId: item.courseId, title: item.title, color: item.color }, { x, y });
          }
        }
      }
      return undefined;
    },
  }));

  // Ref'i bağla
  useEffect(() => {
    if (dropAreaRef.current) {
      drop(dropAreaRef.current);
    }
  }, [drop]);
  
  // Canvas sürükleme işlevleri
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Sadece çalışma alanına tıklanırsa sürüklemeyi başlat (kartlara değil)
    if (e.target === dropAreaRef.current || e.target === contentRef.current) {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      
      // Sürükleme sırasında cursor görünümünü değiştir
      if (contentRef.current) {
        contentRef.current.style.cursor = 'grabbing';
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      // Anlık hızlı tepki için requestAnimationFrame kullan
      requestAnimationFrame(() => {
        const newPosition = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        };
        setPosition(newPosition);
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingCanvas(false);
    
    // Sürükleme bitince cursor'ı sıfırla
    if (contentRef.current) {
      contentRef.current.style.cursor = 'default';
    }
  };

  // Fare tekerleği ile zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Daha hızlı ve hassas zoom için ayarlar
    const zoomSensitivity = 0.001; // Zoom hassasiyeti
    const delta = -e.deltaY * zoomSensitivity;
    
    // Mevcut zoom seviyesini hesapla
    let newScale = scale * (1 + delta);
    
    // Min/max sınırları uygula
    newScale = Math.min(2, Math.max(0.2, newScale));
    
    // Fare pozisyonunda zoom yapmak için hesaplama
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Fare konumunda yakınlaştırma/uzaklaştırma
    const newPosition = {
      x: mouseX - (mouseX - position.x) * (newScale / scale),
      y: mouseY - (mouseY - position.y) * (newScale / scale)
    };
    
    // State'i güncelle
    requestAnimationFrame(() => {
      setScale(newScale);
      setPosition(newPosition);
    });
  };

  // Bağlantı modu işlemleri
  const handleConnect = (sourceId: string, targetId: string) => {
    if (sourceId && targetId && sourceId !== targetId) {
      // Bağlantıyı oluştur
      onConnectSessions(sourceId, targetId);
      
      // Bağlantı modunu kapat
      setConnectingMode(false);
      setConnectingSourceId(null);
      
      // Oturumları yeniden düzenle
      arrangeStudySessions();
    }
  };
  
  // Bağlantı modu değişikliklerini izle
  useEffect(() => {
    if (!connectingMode) {
      // Bağlantı modu kapatıldığında source id'yi temizle
      setConnectingSourceId(null);
    }
  }, [connectingMode]);

  // Otomatik düzenleme için studySessions dizisini ağaç yapısında düzenler
  const arrangeStudySessions = () => {
    // Oturum yoksa işlem yapma
    if (studySessions.length === 0) return;
    
    // Bağlantısı olmayan (kök) oturumları bul
    const rootSessions = studySessions.filter(session => 
      !studySessions.some(s => s.nextSessionId === session.id)
    );
    
    if (rootSessions.length === 0) return;
    
    // Başlangıç pozisyonu
    const startX = 50;
    const startY = 50;
    const horizontalGap = 220;
    const verticalGap = 150;
    
    // Her bir kök için ağaç oluştur ve pozisyonları ayarla
    rootSessions.forEach((rootSession, rootIndex) => {
      // Kök oturumun pozisyonunu ayarla
      const rootX = startX;
      const rootY = startY + (rootIndex * verticalGap);
      
      // Kök oturumu direkt güncelle
      onMove(rootSession.id, { x: rootX, y: rootY });
      
      // Bu kökten başlayan ağacı düzenle (DFS)
      let currentLevel: string[] = [rootSession.id];
      let nextLevel: string[] = [];
      let depth = 1;
      
      while (currentLevel.length > 0) {
        currentLevel.forEach((sessionId) => {
          // Bu oturumdan çıkan bağlantıları bul
          const children = studySessions.filter(s => 
            studySessions.find(parent => parent.id === sessionId)?.nextSessionId === s.id
          );
          
          // Çocukların pozisyonlarını ayarla - direkt onMove ile güncelliyoruz
          children.forEach((child, childIndex) => {
            onMove(child.id, { 
              x: rootX + (depth * horizontalGap), 
              y: rootY + (childIndex * verticalGap) 
            });
            
            nextLevel.push(child.id);
          });
        });
        
        // Sonraki seviyeye geç
        currentLevel = nextLevel;
        nextLevel = [];
        depth++;
      }
    });
  };

  // Study session kartlarını render et
  const renderStudySessions = () => {
    return studySessions.map((session) => (
      <DraggableStudySessionCard 
        key={session.id} 
        session={{
          ...session, 
          // Kartın pozisyonunu değiştirme - gerçek veriyi korumalıyız
          // Pozisyon değişiklikleri sadece görsel olarak renderlanırken uygulanır
        }}
        onDelete={onDeleteSession} 
        onStart={onStartSession}
        onComplete={onCompleteSession}
        onConnect={handleConnect}
        courses={courses}
        formatDuration={formatDuration}
        formatMinutes={formatMinutes}
        connectingMode={connectingMode}
        setConnectingMode={setConnectingMode}
        connectingSourceId={connectingSourceId}
        setConnectingSourceId={setConnectingSourceId}
        onMove={onMove}
      />
    ));
  };

  // Okları çiz
  const renderArrows = () => {
    return studySessions.map((session) => {
      if (!session.nextSessionId) return null;
      
      const sourceSession = session;
      const targetSession = studySessions.find(s => s.id === session.nextSessionId);
      
      if (!targetSession) return null;
      
      // Kartların boyutları
      const cardWidth = 250;
      const cardHeight = 180;
      
      // Kaynak ve hedef kartın konumları
      const sourcePosition = sourceSession.position;
      const targetPosition = targetSession.position;
      
      // Kaynak noktası (kartın sağ kenarı)
      const sourceX = sourcePosition.x + cardWidth;
      // Kaynak Y - kartların göreli konumuna göre bağlantı noktasını ayarla
      const sourceY = sourcePosition.y + (cardHeight / 2);
      
      // Hedef noktası (kartın sol kenarı) 
      const targetX = targetPosition.x;
      // Hedef Y - kartların göreli konumuna göre bağlantı noktasını ayarla
      const targetY = targetPosition.y + (cardHeight / 2);
      
      // Kartlar arasındaki mesafe ve açı
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Bezier curve kontrol noktaları
      let controlPoints;
      
      if (Math.abs(angle) < 30) {
        // Yatay hizalı kartlar - daha düz eğri
        controlPoints = {
          cp1x: sourceX + distance / 3,
          cp1y: sourceY,
          cp2x: targetX - distance / 3,
          cp2y: targetY
        };
      } else if (Math.abs(sourceX - targetX) < 150) {
        // Yakın kartlar - daha belirgin eğri
        const midX = (sourceX + targetX) / 2;
        const offsetY = 50 * (dy > 0 ? 1 : -1);
        
        controlPoints = {
          cp1x: midX,
          cp1y: sourceY + offsetY,
          cp2x: midX,
          cp2y: targetY - offsetY
        };
      } else {
        // Normal mesafede kartlar
        const offsetX = distance / 3;
        
        controlPoints = {
          cp1x: sourceX + offsetX,
          cp1y: sourceY,
          cp2x: targetX - offsetX,
          cp2y: targetY
        };
      }
      
      // Path oluştur
      const path = `M${sourceX},${sourceY} C${controlPoints.cp1x},${controlPoints.cp1y} ${controlPoints.cp2x},${controlPoints.cp2y} ${targetX},${targetY}`;
      
      // Dersin rengini al
      const arrowColor = courses.find(c => c.id === sourceSession.courseId)?.color || "#888";
      
      // Benzersiz ID
      const arrowId = `arrow-${sourceSession.id}-${targetSession.id}`;
      
      // Okun orta noktası
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2;
      
      // Sıra etiketinin konumunu ayarla (biraz yukarı)
      const labelOffsetY = -15;
      
      return (
        <svg 
          key={arrowId}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none', 
            zIndex: 15 
          }}
        >
          <defs>
            <marker
              id={`arrowhead-${arrowId}`}
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={arrowColor} />
            </marker>
          </defs>
          
          {/* Ok çizgisi */}
          <path
            d={path}
            stroke={arrowColor}
            strokeWidth="2.5"
            fill="none"
            markerEnd={`url(#arrowhead-${arrowId})`}
            strokeDasharray="0"
            style={{
              transition: "d 0.3s ease-in-out, stroke 0.3s ease",
              filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.2))`
            }}
          />
          
          {/* Ok üzerindeki etiket arka planı */}
          <circle
            cx={midX}
            cy={midY + labelOffsetY}
            r={14}
            fill={arrowColor}
            style={{
              filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.2))`
            }}
          />
          
          {/* Numara etiketi */}
          <text
            x={midX}
            y={midY + labelOffsetY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontWeight="bold"
            fontSize="12px"
          >
            {studySessions.indexOf(sourceSession) + 1}
          </text>
        </svg>
      );
    }).filter(Boolean);
  };

  const handleAutoDiagram = () => {
    // Otomatik düzenleme
    if (studySessions.length === 0) return;
    
    // Oturumları yeniden düzenle
    arrangeStudySessions();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          Yakınlaştırma: {Math.round(scale * 100)}%
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAutoDiagram}
            title="Otomatik Düzenle"
            className="mr-2"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Otomatik Düzenle
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => {
              const newScale = Math.max(0.2, scale - 0.1);
              setScale(newScale);
            }}
            disabled={scale <= 0.2}
            title="Uzaklaştır"
          >
            <span className="text-lg">-</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            title="Yakınlaştırmayı Sıfırla"
          >
            <span>%{Math.round(scale * 100)}</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {
              const newScale = Math.min(2, scale + 0.1);
              setScale(newScale);
            }}
            disabled={scale >= 2}
            title="Yakınlaştır"
          >
            <span className="text-lg">+</span>
          </Button>
        </div>
      </div>

      {/* Çalışma alanı */}
      <div 
        ref={dropAreaRef}
        style={{
          position: 'relative',
          height: '600px',
          overflow: 'hidden',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        {/* Scale ve position için konteynır */}
        <div
          ref={contentRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: '0 0',
            transition: 'none', // Geçiş efektini kaldırdık
          }}
        >
          {/* Izgara arkaplanı */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'linear-gradient(to right, #e2e8f020 1px, transparent 1px), linear-gradient(to bottom, #e2e8f020 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              zIndex: 0
            }}
          />
          
          {/* Çalışma kartları */}
          {renderStudySessions()}
          
          {/* Oklar */}
          {renderArrows()}
        </div>
        
        {/* Drop alanı */}
        <div ref={(element) => {
          // DndProvider'dan gelen drop ref'i ile HTML element ref'ini birleştiriyoruz
          if (element && drop) {
            // TypeScript'in drop'u bir fonksiyon olarak görmesini sağla
            (drop as unknown as (instance: HTMLDivElement | null) => void)(element);
          }
        }} style={{ width: '100%', height: '100%' }} />
        
        {/* Kontrol butonları */}
        <div 
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            display: 'flex',
            gap: '8px',
            zIndex: 100
          }}
        >
          <Button 
            size="sm" 
            onClick={handleAutoDiagram}
            title="Otomatik Düzenle"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Otomatik Düzenle
          </Button>
        </div>
      </div>

      {/* Diğer içerikler... */}
      
      {/* Silinmiş öğeler bölümü */}
      {deletedSessions.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-muted-foreground flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Son Silinen Çalışma Oturumları
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {deletedSessions.slice(0, 5).map((deleted) => (
              <Card 
                key={deleted.item.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div 
                      className="text-xs py-1 px-2 rounded-full" 
                      style={{ 
                        backgroundColor: courses.find(c => c.id === deleted.item.courseId)?.color + '20',
                        color: courses.find(c => c.id === deleted.item.courseId)?.color
                      }}
                    >
                      {courses.find(c => c.id === deleted.item.courseId)?.title}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => onRestoreSession(deleted.item.id)}
                      title="Geri Yükle"
                    >
                      <RotateCcw className="h-4 w-4 text-blue-500" />
                    </Button>
                  </div>
                  <div className="text-sm font-medium mb-2 truncate">
                    {deleted.item.topic}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(deleted.timestamp).toLocaleTimeString('tr-TR')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function QuestionTrackingPage() {
  const { status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<QuestionSession[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [deletedSessions, setDeletedSessions] = useState<DeletedItem[]>([]);
  const [openNewSession, setOpenNewSession] = useState(false);
  const [openStudySessionDialog, setOpenStudySessionDialog] = useState(false);
  const [newSession, setNewSession] = useState({
    courseId: "",
    totalQuestions: 0,
    correctAnswers: 0, 
    wrongAnswers: 0,
    emptyAnswers: 0,
    duration: 0
  });
  const [activeTab, setActiveTab] = useState("tum-oturumlar");
  const [newStudyPosition, setNewStudyPosition] = useState<{x: number, y: number} | null>(null);
  const [newStudySession, setNewStudySession] = useState({
    courseId: "",
    topic: "",
    targetQuestions: 0,
    plannedDuration: 60, // Varsayılan 60 dakika
    status: 'planned' as const
  });

  // Dersleri ve oturumları getir
  useEffect(() => {
    const fetchData = async () => {
      if (sessionStatus === "authenticated") {
        try {
          // Dersleri getir
          const coursesResponse = await axios.get<Course[]>('/api/courses');
          setCourses(coursesResponse.data);
          
          // Soru oturumlarını getir
          const sessionsResponse = await axios.get<QuestionSession[]>('/api/question-sessions');
          setSessions(sessionsResponse.data);

          // Local storage'dan çalışma oturumlarını getir
          const savedStudySessions = localStorage.getItem('studySessions');
          if (savedStudySessions) {
            setStudySessions(JSON.parse(savedStudySessions));
          }
        } catch (error) {
          console.error("Veri getirme hatası:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [sessionStatus]);

  // Study sessions değiştiğinde local storage'a kaydet
  useEffect(() => {
    if (studySessions.length > 0) {
      localStorage.setItem('studySessions', JSON.stringify(studySessions));
    }
  }, [studySessions]);

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

  // Süreyi formatla - artık saat:dakika:saniye formatında
  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "-";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const padZero = (num: number): string => num.toString().padStart(2, '0');
    
    return `${hours > 0 ? hours + ':' : ''}${padZero(minutes)}:${padZero(remainingSeconds)}`;
  };

  // Dakikayı formatla - saatler ve dakikalar
  const formatMinutes = (minutes: number): string => {
    if (!minutes) return "-";
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours} saat ${remainingMinutes > 0 ? remainingMinutes + ' dk' : ''}`;
    } else {
      return `${remainingMinutes} dk`;
    }
  };

  // Tarihi formatla
  const formatDate = (date: Date | string | null): string => {
    if (!date) return "-";
    
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Yeni soru oturumu oluştur
  const handleCreateSession = async () => {
    try {
      setLoading(true);
      
      // Toplamın doğruluğunu kontrol et
      const total = newSession.correctAnswers + newSession.wrongAnswers + newSession.emptyAnswers;
      if (total !== newSession.totalQuestions) {
        alert("Toplam soru sayısı ile doğru, yanlış ve boş toplamı eşleşmiyor!");
        setLoading(false);
        return;
      }
      
      // API'ye gönder
      const response = await axios.post<QuestionSession>('/api/question-sessions', newSession);
      
      // Yeni oturumu listeye ekle
      setSessions([...sessions, response.data]);
      
      // Formu sıfırla ve kapat
      setNewSession({
        courseId: "",
        totalQuestions: 0,
        correctAnswers: 0, 
        wrongAnswers: 0,
        emptyAnswers: 0,
        duration: 0
      });
      setOpenNewSession(false);
    } catch (error) {
      console.error("Oturum oluşturma hatası:", error);
      alert("Oturum oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Ders sürüklendiğinde
  const handleCourseDrop = (item: { courseId: string, title: string, color: string }, position: { x: number, y: number }) => {
    // Yeni konum bilgisini sakla
    setNewStudyPosition(position);
    
    // Form verisini sıfırlayarak temiz başla
    setNewStudySession({
      courseId: item.courseId,
      topic: "", // Her yeni sürükleme için temiz bir başlangıç
      targetQuestions: 10, // Varsayılan değer
      plannedDuration: 60, // Varsayılan değer (dakika)
      status: 'planned' as const
    });
    
    // Dialog'u aç
    setOpenStudySessionDialog(true);
  };

  // Çalışma oturumunu başlat
  const handleStartStudySession = (id: string) => {
    setStudySessions(studySessions.map(session => 
      session.id === id ? { ...session, status: 'in-progress' as const } : session
    ));
  };

  // Çalışma oturumunu tamamla
  const handleCompleteStudySession = async (id: string, data: { 
    totalQuestions: number, 
    correctAnswers: number, 
    wrongAnswers: number, 
    emptyAnswers: number, 
    duration: number 
  }) => {
    // Çalışma oturumunu güncelle
    const updatedSessions = studySessions.map(session => 
      session.id === id ? { 
        ...session, 
        status: 'completed' as const,
        totalQuestions: data.totalQuestions,
        correctAnswers: data.correctAnswers,
        wrongAnswers: data.wrongAnswers,
        emptyAnswers: data.emptyAnswers,
        duration: data.duration
      } : session
    );
    
    setStudySessions(updatedSessions);
    
    // Tamamlanan çalışma oturumunu bul
    const completedSession = updatedSessions.find(s => s.id === id);
    
    if (completedSession) {
      try {
        // Tamamlanan oturumu API'ye de kaydet
        const sessionData = {
          courseId: completedSession.courseId,
          totalQuestions: completedSession.totalQuestions,
          correctAnswers: completedSession.correctAnswers,
          wrongAnswers: completedSession.wrongAnswers,
          emptyAnswers: completedSession.emptyAnswers,
          duration: completedSession.duration,
          startTime: new Date(completedSession.date),
          endTime: new Date(),
          topic: completedSession.topic
        };
        
        const response = await axios.post<QuestionSession>('/api/question-sessions', sessionData);
        
        // API kaydı başarılı olursa, sessions state'ini güncelle
        setSessions([...sessions, response.data]);
        
      } catch (error) {
        console.error("API kaydı sırasında hata:", error);
        alert("Tamamlanan çalışma kaydedilirken bir hata oluştu.");
      }
    }
  };

  // Çalışma oturumunu sil ve silinen öğeler listesine ekle
  const handleDeleteStudySession = (id: string) => {
    const sessionToDelete = studySessions.find(session => session.id === id);
    if (sessionToDelete) {
      // Silineni listede saklayalım
      setDeletedSessions(prev => {
        // En fazla son 5 silinen öğeyi tutalım
        const newDeletedList = [
          { item: sessionToDelete, timestamp: Date.now() },
          ...prev.slice(0, 4)
        ];
        return newDeletedList;
      });
      
      // Oturumu listeden kaldır
      setStudySessions(studySessions.filter(session => session.id !== id));
      
      // Bağlantıları da temizle
      setStudySessions(prev => prev.map(session => 
        session.nextSessionId === id ? { ...session, nextSessionId: undefined } : session
      ));
    }
  };

  // Silinen çalışma oturumunu geri al
  const handleRestoreStudySession = (id: string) => {
    const deletedSessionItem = deletedSessions.find(item => item.item.id === id);
    if (deletedSessionItem) {
      // Oturumu geri alalım
      setStudySessions([...studySessions, deletedSessionItem.item]);
      
      // Silinen öğeler listesinden kaldır
      setDeletedSessions(deletedSessions.filter(item => item.item.id !== id));
    }
  };

  // Yeni çalışma oturumu ekle
  const handleAddStudySession = () => {
    if (!newStudyPosition) {
      console.error("Pozisyon bilgisi eksik");
      return;
    }
    
    // Konu alanı boş olmamalı
    if (!newStudySession.topic.trim()) {
      alert("Lütfen çalışılacak konuyu belirtin!");
      return;
    }

    // Ders ID kontrolü
    if (!newStudySession.courseId) {
      console.error("Ders ID bilgisi eksik");
      return;
    }

    const newSession: StudySession = {
      id: Date.now().toString(), // Benzersiz ID
      courseId: newStudySession.courseId,
      topic: newStudySession.topic,
      position: newStudyPosition,
      targetQuestions: newStudySession.targetQuestions || 10,
      plannedDuration: newStudySession.plannedDuration || 60,
      status: 'planned',
      date: new Date()
    };

    // Yeni oturumu ekle
    setStudySessions(prev => [...prev, newSession]);
    setOpenStudySessionDialog(false);
    
    // Form verilerini sıfırla
    setNewStudySession({
      courseId: "",
      topic: "",
      targetQuestions: 0,
      plannedDuration: 60,
      status: 'planned'
    });
    setNewStudyPosition(null);
  };

  // Sürüklenen çalışma oturumunu taşı
  const handleMoveStudySession = (id: string, position: { x: number, y: number }) => {
    setStudySessions(studySessions.map(session => 
      session.id === id ? { ...session, position } : session
    ));
  };

  // Çalışma oturumlarını birbirine bağla (ok çizimi için)
  const handleConnectSessions = (sourceId: string, targetId: string) => {
    if (!sourceId || !targetId || sourceId === targetId) {
      console.warn("Geçersiz bağlantı parametreleri");
      return;
    }

    // Durum güncellemesi ve güvenli bağlantı oluşturma
    const updatedSessions = [...studySessions];
    const sourceIndex = updatedSessions.findIndex(s => s.id === sourceId);
    
    if (sourceIndex !== -1) {
      updatedSessions[sourceIndex] = {
        ...updatedSessions[sourceIndex],
        nextSessionId: targetId
      };
      setStudySessions(updatedSessions);
      console.log(`Oturumlar bağlandı: ${sourceId} -> ${targetId}`);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 p-4 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Soru Çözüm Takibi</h2>
            
            <Dialog open={openNewSession} onOpenChange={setOpenNewSession}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Yeni Soru Oturumu</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Yeni Soru Oturumu Ekle</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="course">Ders</Label>
                    <Select 
                      value={newSession.courseId}
                      onValueChange={(value) => setNewSession({...newSession, courseId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ders seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="totalQuestions">Toplam Soru Sayısı</Label>
                    <Input 
                      id="totalQuestions" 
                      type="number" 
                      min={0}
                      value={newSession.totalQuestions}
                      onChange={(e) => setNewSession({...newSession, totalQuestions: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="correctAnswers">Doğru</Label>
                      <Input 
                        id="correctAnswers" 
                        type="number" 
                        min={0}
                        value={newSession.correctAnswers}
                        onChange={(e) => setNewSession({...newSession, correctAnswers: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="wrongAnswers">Yanlış</Label>
                      <Input 
                        id="wrongAnswers" 
                        type="number" 
                        min={0}
                        value={newSession.wrongAnswers}
                        onChange={(e) => setNewSession({...newSession, wrongAnswers: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="emptyAnswers">Boş</Label>
                      <Input 
                        id="emptyAnswers" 
                        type="number" 
                        min={0}
                        value={newSession.emptyAnswers}
                        onChange={(e) => setNewSession({...newSession, emptyAnswers: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Geçen Süre (saniye)</Label>
                    <Input 
                      id="duration" 
                      type="number" 
                      min={0}
                      value={newSession.duration}
                      onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateSession}>Kaydet</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="tum-oturumlar" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="tum-oturumlar">Tüm Oturumlar</TabsTrigger>
              <TabsTrigger value="ders-istatistikleri">Ders İstatistikleri</TabsTrigger>
              <TabsTrigger value="calisma-plani">Çalışma Planı[BETA]</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tum-oturumlar" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Ders</TableHead>
                        <TableHead className="text-center">Toplam Soru</TableHead>
                        <TableHead className="text-center">Doğru</TableHead>
                        <TableHead className="text-center">Yanlış</TableHead>
                        <TableHead className="text-center">Boş</TableHead>
                        <TableHead className="text-center">Süre</TableHead>
                        <TableHead className="text-center">Başarı %</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                            Henüz hiç soru çözüm oturumu eklenmemiş
                          </TableCell>
                        </TableRow>
                      ) : (
                        sessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>{formatDate(session.startTime)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {session.course && (
                                  <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: session.course.color }}
                                  />
                                )}
                                <span>{session.course?.title || "Belirtilmemiş"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{session.totalQuestions}</TableCell>
                            <TableCell className="text-center text-green-500">{session.correctAnswers}</TableCell>
                            <TableCell className="text-center text-red-500">{session.wrongAnswers}</TableCell>
                            <TableCell className="text-center text-yellow-500">{session.emptyAnswers}</TableCell>
                            <TableCell className="text-center">{formatDuration(session.duration)}</TableCell>
                            <TableCell className="text-center">
                              {session.totalQuestions > 0
                                ? Math.round((session.correctAnswers / session.totalQuestions) * 100)
                                : 0}
                              %
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ders-istatistikleri" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => {
                  // Bu derse ait oturumları filtrele
                  const courseSessionsFilter = sessions.filter(s => s.courseId === course.id);
                  
                  // İstatistikleri hesapla
                  const totalQuestions = courseSessionsFilter.reduce((sum, s) => sum + s.totalQuestions, 0);
                  const correctAnswers = courseSessionsFilter.reduce((sum, s) => sum + s.correctAnswers, 0);
                  const wrongAnswers = courseSessionsFilter.reduce((sum, s) => sum + s.wrongAnswers, 0);
                  const emptyAnswers = courseSessionsFilter.reduce((sum, s) => sum + s.emptyAnswers, 0);
                  const totalDuration = courseSessionsFilter.reduce((sum, s) => sum + (s.duration || 0), 0);
                  const successRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
                  
                  return (
                    <Card key={course.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                          {course.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Toplam Soru</span>
                            <span className="text-2xl font-bold">{totalQuestions}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Başarı Oranı</span>
                            <span className="text-2xl font-bold">{successRate}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{correctAnswers} Doğru</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm">{wrongAnswers} Yanlış</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CircleDashed className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{emptyAnswers} Boş</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{formatDuration(totalDuration)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {courses.length === 0 && (
                  <div className="col-span-full flex justify-center py-10 text-muted-foreground">
                    Görüntülenecek ders bulunmuyor
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="calisma-plani" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Sol taraf: Dersler */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Dersler</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Çalışmak istediğiniz dersi planlama alanına sürükleyin
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        {courses.map((course) => (
                          <DraggableCourse key={course.id} course={course} />
                        ))}
                        {courses.length === 0 && (
                          <div className="text-center py-4 text-muted-foreground">
                            Sürüklenecek ders yok
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Sağ taraf: Çalışma planı alanı */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Günlük Çalışma Planım</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Çalışacağınız dersleri sürükleyerek planınızı oluşturun ve oklar ile dersler arası geçişleri belirtin
                      </p>
                    </CardHeader>
                    <CardContent>
                      <StudyArea 
                        onDrop={handleCourseDrop}
                        onMove={handleMoveStudySession}
                        studySessions={studySessions}
                        onDeleteSession={handleDeleteStudySession}
                        onRestoreSession={handleRestoreStudySession}
                        onStartSession={handleStartStudySession}
                        onCompleteSession={handleCompleteStudySession}
                        onConnectSessions={handleConnectSessions}
                        courses={courses}
                        formatDuration={formatDuration}
                        formatMinutes={formatMinutes}
                        deletedSessions={deletedSessions}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Yeni çalışma oturumu ekleme dialog */}
      <Dialog open={openStudySessionDialog} onOpenChange={setOpenStudySessionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Çalışma Detaylarını Girin</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="topic">Konu</Label>
              <Input 
                id="topic" 
                placeholder="Çalışılacak konuyu yazın"
                value={newStudySession.topic}
                onChange={(e) => setNewStudySession({
                  ...newStudySession, 
                  topic: e.target.value
                })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="targetQuestions">Hedeflenen Soru Sayısı</Label>
              <Input 
                id="targetQuestions" 
                type="number" 
                min={0}
                value={newStudySession.targetQuestions}
                onChange={(e) => setNewStudySession({
                  ...newStudySession, 
                  targetQuestions: parseInt(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="plannedDuration">Planlanan Süre (dakika)</Label>
              <Input 
                id="plannedDuration" 
                type="number" 
                min={0}
                value={newStudySession.plannedDuration}
                onChange={(e) => setNewStudySession({
                  ...newStudySession, 
                  plannedDuration: parseInt(e.target.value) || 0
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddStudySession}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndProvider>
  );
} 