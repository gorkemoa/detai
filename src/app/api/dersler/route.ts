import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Varsayılan dersler listesi
const TEMEL_DERSLER = [
  { title: "Matematik", color: "#FF5733" },
  { title: "Fizik", color: "#33FF57" },
  { title: "Kimya", color: "#3357FF" },
  { title: "Biyoloji", color: "#F033FF" },
  { title: "Türkçe", color: "#FF3333" },
  { title: "Tarih", color: "#33FFF3" },
  { title: "Coğrafya", color: "#FFB533" },
  { title: "İngilizce", color: "#335FFF" },
  { title: "Felsefe", color: "#9933FF" },
  { title: "Edebiyat", color: "#FF3380" }
];

// Dersleri getirme API'si
export async function GET(request: NextRequest) {
  try {
    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }

    // Dersleri veritabanından getir
    const courses = await prisma.course.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        color: true,
      },
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Dersler alınırken hata:", error);
    return NextResponse.json(
      { error: "Dersler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Temel dersleri yükleme API'si
export async function PATCH(request: NextRequest) {
  try {
    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }

    // Kullanıcının mevcut derslerini kontrol et
    const existingCourses = await prisma.course.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        title: true,
      },
    });

    const existingTitles = existingCourses.map(course => course.title);

    // Sadece kullanıcının henüz eklemediği dersleri ekle
    const coursesToCreate = TEMEL_DERSLER.filter(
      course => !existingTitles.includes(course.title)
    );

    if (coursesToCreate.length === 0) {
      return NextResponse.json({
        message: "Tüm temel dersler zaten eklenmiş",
        addedCount: 0
      });
    }

    // Dersleri toplu olarak ekle
    const createdCourses = await prisma.course.createMany({
      data: coursesToCreate.map(course => ({
        title: course.title,
        color: course.color,
        userId: session.user.id,
      })),
    });

    return NextResponse.json({
      message: "Temel dersler başarıyla eklendi",
      addedCount: createdCourses.count
    });
  } catch (error) {
    console.error("Temel dersler eklenirken hata:", error);
    return NextResponse.json(
      { error: "Temel dersler eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni ders ekleme API'si
export async function POST(request: NextRequest) {
  try {
    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }

    // İsteği analiz et
    const body = await request.json();
    
    // Gerekli alanları doğrula
    if (!body.title) {
      return NextResponse.json(
        { error: "Ders başlığı gereklidir" },
        { status: 400 }
      );
    }

    // Yeni dersi oluştur
    const course = await prisma.course.create({
      data: {
        title: body.title,
        description: body.description,
        color: body.color || "#4F46E5", // Varsayılan renk
        userId: session.user.id,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Ders oluşturulurken hata:", error);
    return NextResponse.json(
      { error: "Ders oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 