import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Status, Prisma } from "@prisma/client";
import { Priority } from "@prisma/client";

// Görevleri getirme API'si
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

    // URL parametrelerini al
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status");
    
    // Sorgu filtrelerini oluştur
    const filters: Prisma.TaskWhereInput = {
      userId: session.user.id,
    };
    
    if (courseId) {
      filters.courseId = courseId;
    }
    
    if (status) {
      filters.status = status as Status;
    }
    
    // Görevleri veritabanından getir
    const tasks = await prisma.task.findMany({
      where: filters,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Görevler alınırken hata:", error);
    return NextResponse.json(
      { error: "Görevler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni görev ekleme API'si
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
        { error: "Görev başlığı gereklidir" },
        { status: 400 }
      );
    }

    // Yeni görevi oluştur
    const taskData: Prisma.TaskCreateInput = {
      title: body.title,
      description: body.description || null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      priority: (body.priority as Priority) || "MEDIUM",
      status: (body.status as Status) || "TODO",
      user: {
        connect: {
          id: session.user.id
        }
      }
    };

    // Opsiyonel alanları ekle
    if (body.courseId) {
      taskData.course = {
        connect: {
          id: body.courseId
        }
      };
    }

    // Not: progressLog alanını Prisma tipinde tanımlanamadığı için veri hazırlıktan çıkarıyoruz

    const taskCreateData = {
      ...taskData,
      completionPercentage: body.completionPercentage ? parseInt(body.completionPercentage.toString()) : 0,
      progressLog: body.progressLog || null,
      userId: session.user.id,
    } as Prisma.TaskCreateInput & { completionPercentage: number; progressLog: string | null };

    const task = await prisma.task.create({
      data: taskCreateData,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Görev oluşturulurken hata:", error);
    return NextResponse.json(
      { error: "Görev oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 