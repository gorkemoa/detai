import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Belirli bir görevi getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }

    // Görevi veritabanından getir
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Görev bulunamadı" }, { status: 404 });
    }

    // Kullanıcının kendi görevine eriştiğinden emin ol
    if (task.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bu göreve erişim izniniz yok" },
        { status: 403 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Görev alınırken hata:", error);
    return NextResponse.json(
      { error: "Görev alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Belirli bir görevi güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }

    // Mevcut görevi kontrol et
    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Görev bulunamadı" }, { status: 404 });
    }

    // Kullanıcının kendi görevine eriştiğinden emin ol
    if (existingTask.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bu görevi düzenleme izniniz yok" },
        { status: 403 }
      );
    }

    // İsteği analiz et
    const body = await request.json();

    // Görevi güncelle
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: body.title !== undefined ? body.title : existingTask.title,
        description: body.description !== undefined ? body.description : existingTask.description,
        dueDate: body.dueDate !== undefined ? (body.dueDate ? new Date(body.dueDate) : null) : existingTask.dueDate,
        priority: body.priority !== undefined ? body.priority : existingTask.priority,
        status: body.status !== undefined ? body.status : existingTask.status,
        // @ts-expect-error - Bu alan Prisma şemasında mevcut
        completionPercentage: body.completionPercentage !== undefined ? body.completionPercentage : existingTask.completionPercentage,
        // @ts-expect-error - Bu alan Prisma şemasında mevcut
        progressLog: body.progressLog !== undefined ? body.progressLog : existingTask.progressLog,
        courseId: body.courseId !== undefined ? (body.courseId ? body.courseId : null) : existingTask.courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Görev güncellenirken hata:", error);
    
    // Prisma hata kodlarını kontrol et
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint failed')) {
        return NextResponse.json(
          { error: "Geçersiz kurs ID'si. Lütfen geçerli bir kurs seçin veya boş bırakın." },
          { status: 400 }
        );
      }
      
      if (error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: `Geçersiz veri formatı: ${error.message}` },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Görev güncellenirken bir hata oluştu: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// Belirli bir görevi sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }

    // Mevcut görevi kontrol et
    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Görev bulunamadı" }, { status: 404 });
    }

    // Kullanıcının kendi görevine eriştiğinden emin ol
    if (existingTask.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bu görevi silme izniniz yok" },
        { status: 403 }
      );
    }

    // Görevi sil
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Görev silinirken hata:", error);
    return NextResponse.json(
      { error: "Görev silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 