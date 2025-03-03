import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Tüm soru oturumlarını getir
export async function GET() {
  try {
    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Yetkilendirme hatası" }, { status: 401 });
    }
    
    // Kullanıcının ID'sini al
    const userEmail = session.user.email as string;
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });
    
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }
    
    // Kullanıcının soru oturumlarını getir
    const questionSessions = await prisma.questionSession.findMany({
      where: { userId: user.id },
      include: { course: true },
      orderBy: { startTime: "desc" }
    });
    
    return NextResponse.json(questionSessions);
  } catch (error) {
    console.error("Soru oturumlarını getirme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

// Yeni soru oturumu oluştur
export async function POST(request: Request) {
  try {
    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Yetkilendirme hatası" }, { status: 401 });
    }
    
    // Kullanıcının ID'sini al
    const userEmail = session.user.email as string;
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });
    
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }
    
    // Request body'den verileri al
    const body = await request.json();
    const { courseId, totalQuestions, correctAnswers, wrongAnswers, emptyAnswers, duration } = body;
    
    // Verileri doğrula
    if (
      typeof totalQuestions !== "number" || 
      typeof correctAnswers !== "number" || 
      typeof wrongAnswers !== "number" || 
      typeof emptyAnswers !== "number" || 
      typeof duration !== "number"
    ) {
      return NextResponse.json(
        { error: "Geçersiz veri formatı. Sayısal değerler gerekli." }, 
        { status: 400 }
      );
    }
    
    // Toplam kontrolü
    if (correctAnswers + wrongAnswers + emptyAnswers !== totalQuestions) {
      return NextResponse.json(
        { error: "Doğru, yanlış ve boş toplamı, toplam soru sayısına eşit olmalıdır." }, 
        { status: 400 }
      );
    }
    
    // Yeni soru oturumu oluştur
    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 1000); // Saniye cinsinden duration
    
    const newQuestionSession = await prisma.questionSession.create({
      data: {
        startTime: now,
        endTime: endTime,
        duration: duration,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        emptyAnswers: emptyAnswers,
        userId: user.id,
        courseId: courseId || null,
      },
      include: { course: true }
    });
    
    return NextResponse.json(newQuestionSession, { status: 201 });
  } catch (error) {
    console.error("Soru oturumu oluşturma hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
} 