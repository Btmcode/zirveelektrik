"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  CalendarClock,
  Sparkles,
  Plug,
  FileText,
  Star,
  MapPin,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  InboxIcon,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/components/admin/api-client";
import { StatCard } from "@/components/admin/stat-card";
import { StatusPill } from "@/components/admin/status-pill";
import { EmptyState } from "@/components/admin/empty-state";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { REQUEST_STATUS, REQUEST_STATUS_ORDER } from "@/lib/site";
import { formatDateTimeTr } from "@/lib/utils-format";

interface RecentRequest {
  id: string;
  code: string;
  name: string;
  phone: string;
  district: string;
  serviceType: string | null;
  status: string;
  createdAt: string;
}

interface StatsData {
  totalRequests: number;
  todayRequests: number;
  byStatus: Record<string, number>;
  recentRequests: RecentRequest[];
  serviceCount: number;
  blogCount: number;
  districtCount: number;
  approvedTestimonialCount: number;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "border-amber-300 bg-amber-50",
  CONTACTED: "border-teal-300 bg-teal-50",
  SCHEDULED: "border-violet-300 bg-violet-50",
  COMPLETED: "border-emerald-300 bg-emerald-50",
  CANCELLED: "border-zinc-300 bg-zinc-50",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const stats = await apiFetch<StatsData>("/api/admin/stats");
      setData(stats);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "İstatistikler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Kontrol Paneli" description="Yükleniyor..." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Kontrol Paneli" />
        <EmptyState
          icon={AlertTriangle}
          title="Veriler yüklenemedi"
          description="Sunucuya erişilemedi. Lütfen tekrar deneyin."
          action={
            <Button variant="outline" onClick={load}>
              <RefreshCw aria-hidden="true" />
              Tekrar Dene
            </Button>
          }
        />
      </div>
    );
  }

  const newCount = data.byStatus["NEW"] ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kontrol Paneli"
        description="Talepler ve site içeriği genel görünümü"
        action={
          <Button asChild variant="outline">
            <Link href="/admin/talepler">
              Tüm Talepler
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <section aria-label="Özet istatistikler" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Toplam Talep" value={data.totalRequests} icon={Inbox} />
        <StatCard title="Bugün Gelen" value={data.todayRequests} icon={CalendarClock} />
        <StatCard title="Yeni Talepler" value={newCount} icon={Sparkles} />
        <StatCard
          title="Onaylı Yorum"
          value={data.approvedTestimonialCount}
          icon={Star}
          hint="Sitede görünen yorumlar"
        />
      </section>

      <section aria-label="Durum dağılımı" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {REQUEST_STATUS_ORDER.map((status) => (
          <div
            key={status}
            className={`rounded-lg border p-4 ${STATUS_COLORS[status] ?? "border-zinc-300 bg-zinc-50"}`}
          >
            <p className="text-sm font-medium">{REQUEST_STATUS[status]}</p>
            <p className="text-2xl font-bold tabular-nums">{data.byStatus[status] ?? 0}</p>
          </div>
        ))}
      </section>

      <section aria-label="İçerik sayıları" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Hizmet Sayfası" value={data.serviceCount} icon={Plug} />
        <StatCard title="Blog Yazısı" value={data.blogCount} icon={FileText} />
        <StatCard title="İlçe Sayfası" value={data.districtCount} icon={MapPin} />
      </section>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Son Talepler</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/talepler">
              Tümü
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {data.recentRequests.length === 0 ? (
            <EmptyState
              icon={InboxIcon}
              title="Henüz talep yok"
              description="Web sitesinden yeni talep geldiğinde burada görünecek."
            />
          ) : (
            <div className="max-h-96 overflow-y-auto rounded-md border">
              <Table>
                <thead className="sticky top-0 z-[1] bg-muted">
                  <tr>
                    <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">Kod</th>
                    <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">Ad Soyad</th>
                    <th className="hidden h-10 px-2 text-left align-middle font-medium whitespace-nowrap sm:table-cell">Telefon</th>
                    <th className="hidden h-10 px-2 text-left align-middle font-medium whitespace-nowrap md:table-cell">İlçe</th>
                    <th className="hidden h-10 px-2 text-left align-middle font-medium whitespace-nowrap lg:table-cell">Tarih</th>
                    <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">Durum</th>
                  </tr>
                </thead>
                <TableBody>
                  {data.recentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-xs font-medium">{request.code}</TableCell>
                      <TableCell className="max-w-40 truncate font-medium">{request.name}</TableCell>
                      <TableCell className="hidden tabular-nums sm:table-cell">
                        {request.phone}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{request.district}</TableCell>
                      <TableCell className="hidden whitespace-nowrap lg:table-cell">
                        <span className="text-muted-foreground">
                          {formatDateTimeTr(request.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusPill status={request.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
