import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// İlerleme kayıtlarını getir
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const taskId = context.params.id;

    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }

    // Görevin var olduğunu ve kullanıcıya ait olduğunu kontrol et
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Görev bulunamadı" }, { status: 404 });
    }

    if (task.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bu göreve erişim izniniz yok" },
        { status: 403 }
      );
    }

    // İlerleme kayıtlarını getir (tarih sırasına göre)
    const progressEntries = await prisma.taskProgress.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(progressEntries);
  } catch (error) {
    console.error("İlerleme kayıtları alınırken hata:", error);
    return NextResponse.json(
      { error: "İlerleme kayıtları alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni ilerleme kaydı ekle
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const taskId = context.params.id;

    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }

    // Görevin var olduğunu ve kullanıcıya ait olduğunu kontrol et
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Görev bulunamadı" }, { status: 404 });
    }

    if (task.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bu göreve ilerleme eklemek için izniniz yok" },
        { status: 403 }
      );
    }

    // İsteği analiz et
    const body = await request.json();

    // İlerleme yüzdesi ve açıklamasını doğrula
    if (
      typeof body.percentage !== "number" ||
      body.percentage < 0 ||
      body.percentage > 100
    ) {
      return NextResponse.json(
        { error: "Geçersiz ilerleme yüzdesi. 0-100 arasında bir değer olmalıdır." },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== "string") {
      return NextResponse.json(
        { error: "İlerleme açıklaması gereklidir" },
        { status: 400 }
      );
    }

    // Yeni ilerleme kaydı oluştur
    const newProgressEntry = await prisma.taskProgress.create({
      data: {
        percentage: body.percentage,
        description: body.description,
        taskId,
      },
    });

    // Görevin ilerleme yüzdesini de güncelle
    await prisma.task.update({
      where: { id: taskId },
      data: { completionPercentage: body.percentage },
    });

    return NextResponse.json(newProgressEntry, { status: 201 });
  } catch (error) {
    console.error("İlerleme kaydı eklenirken hata:", error);
    return NextResponse.json(
      { error: "İlerleme kaydı eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 