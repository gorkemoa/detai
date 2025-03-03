import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Tüm dersleri getir
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
    
    // Kullanıcının derslerini getir
    const courses = await prisma.course.findMany({
      where: { userId: user.id },
      orderBy: { title: "asc" }
    });
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Dersleri getirme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

// Yeni ders oluştur
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
    const { title, description, color } = body;
    
    // Verileri doğrula
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Ders başlığı gereklidir." }, 
        { status: 400 }
      );
    }
    
    // Yeni ders oluştur
    const newCourse = await prisma.course.create({
      data: {
        title,
        description: description || null,
        color: color || "#4F46E5", // Varsayılan renk
        userId: user.id,
      }
    });
    
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Ders oluşturma hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
} 