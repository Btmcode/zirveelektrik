"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Inbox,
  AlertTriangle,
  Search,
  Phone,
  Eye,
  Loader2,
  Trash2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/components/admin/api-client";
import { StatusPill } from "@/components/admin/status-pill";
import { EmptyState } from "@/components/admin/empty-state";
import { PageHeader } from "@/components/admin/page-header";
import { Field } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { REQUEST_STATUS, REQUEST_STATUS_ORDER } from "@/lib/site";
import { formatDateTimeTr } from "@/lib/utils-format";

interface AdminRequest {
  id: string;
  code: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  serviceType: string | null;
  message: string;
  status: string;
  notes: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
}

const SOURCE_LABELS: Record<string, string> = {
  WEBSITE: "Web Sitesi",
  WHATSAPP: "WhatsApp",
  PHONE: "Telefon",
};

export default function AdminRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<AdminRequest[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selected, setSelected] = useState<AdminRequest | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowUpdating, setRowUpdating] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const qs = params.toString();
      const data = await apiFetch<{ requests: AdminRequest[] }>(
        `/api/admin/requests${qs ? `?${qs}` : ""}`
      );
      setRequests(data.requests);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Talepler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [q, statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchRequests();
    }, 300);
    return () => clearTimeout(t);
  }, [fetchRequests]);

  async function updateStatus(id: string, status: string) {
    setRowUpdating(id);
    try {
      const data = await apiFetch<{ request: AdminRequest }>(`/api/admin/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setRequests((prev) => prev?.map((r) => (r.id === id ? data.request : r)) ?? null);
      if (selected?.id === id) setSelected(data.request);
      toast.success("Durum güncellendi");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Durum güncellenemedi");
    } finally {
      setRowUpdating(null);
    }
  }

  function openDetail(request: AdminRequest) {
    setSelected(request);
    setNotes(request.notes ?? "");
  }

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    try {
      const data = await apiFetch<{ request: AdminRequest }>(`/api/admin/requests/${selected.id}`, {
        method: "PATCH",
        body: JSON.stringify({ notes }),
      });
      setRequests((prev) => prev?.map((r) => (r.id === data.request.id ? data.request : r)) ?? null);
      setSelected(data.request);
      toast.success("Not kaydedildi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Not kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRequest() {
    if (!selected) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/admin/requests/${selected.id}`, { method: "DELETE" });
      setRequests((prev) => prev?.filter((r) => r.id !== selected.id) ?? null);
      setSelected(null);
      setConfirmOpen(false);
      toast.success("Talep silindi");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Talep silinemedi");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talepler"
        description="Web sitesinden gelen servis taleplerini yönetin"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="İsim, telefon, takip kodu veya ilçe ara..."
            className="pl-9"
            aria-label="Talep ara"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Durum filtresi">
            <SelectValue placeholder="Tüm durumlar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tüm durumlar</SelectItem>
            {REQUEST_STATUS_ORDER.map((status) => (
              <SelectItem key={status} value={status}>
                {REQUEST_STATUS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent>
          {loading && !requests ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="max-h-96 overflow-y-auto rounded-md border">
              <Table>
                <thead className="sticky top-0 z-[1] bg-muted">
                  <tr>
                    <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">Kod</th>
                    <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">Ad Soyad</th>
                    <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">Telefon</th>
                    <th className="hidden h-10 px-2 text-left align-middle font-medium whitespace-nowrap md:table-cell">İlçe</th>
                    <th className="hidden h-10 px-2 text-left align-middle font-medium whitespace-nowrap lg:table-cell">Hizmet</th>
                    <th className="hidden h-10 px-2 text-left align-middle font-medium whitespace-nowrap xl:table-cell">Tarih</th>
                    <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">Durum</th>
                    <th className="h-10 px-2 text-right align-middle font-medium whitespace-nowrap">İşlem</th>
                  </tr>
                </thead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-xs font-medium">{request.code}</TableCell>
                      <TableCell className="max-w-36 truncate font-medium">{request.name}</TableCell>
                      <TableCell>
                        <a
                          href={`tel:${request.phone}`}
                          className="flex items-center gap-1 text-sm tabular-nums hover:underline"
                          aria-label={`${request.name} için ara: ${request.phone}`}
                        >
                          <Phone className="size-3 shrink-0 text-primary" aria-hidden="true" />
                          {request.phone}
                        </a>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{request.district}</TableCell>
                      <TableCell className="hidden max-w-32 truncate lg:table-cell">
                        {request.serviceType || "-"}
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap xl:table-cell">
                        <span className="text-muted-foreground">
                          {formatDateTimeTr(request.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={request.status}
                            onValueChange={(value) => updateStatus(request.id, value)}
                            disabled={rowUpdating === request.id}
                          >
                            <SelectTrigger size="sm" aria-label={`Durum: ${request.code}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {REQUEST_STATUS_ORDER.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {REQUEST_STATUS[status]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {rowUpdating === request.id ? (
                            <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden="true" />
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openDetail(request)}>
                          <Eye aria-hidden="true" />
                          Detay
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={Inbox}
              title="Talep bulunamadı"
              description={
                q || statusFilter !== "ALL"
                  ? "Arama kriterlerinize uyan talep yok. Filtreleri temizleyip tekrar deneyin."
                  : "Henüz hiç talep gelmemiş. Yeni talepler burada görünecek."
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Detay diyaloğu */}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-base">{selected?.code}</span>
              {selected ? <StatusPill status={selected.status} /> : null}
            </DialogTitle>
            <DialogDescription>
              {selected ? `Alındı: ${formatDateTimeTr(selected.createdAt)}` : ""}
            </DialogDescription>
          </DialogHeader>

          {selected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Ad Soyad</p>
                  <p className="font-medium">{selected.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <a
                    href={`tel:${selected.phone}`}
                    className="font-medium tabular-nums hover:underline"
                    aria-label={`Ara: ${selected.phone}`}
                  >
                    {selected.phone}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">İlçe</p>
                  <p className="font-medium">{selected.district}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hizmet</p>
                  <p className="font-medium">{selected.serviceType || "Belirtilmemiş"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Adres</p>
                  <p className="font-medium">{selected.address}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Arıza Mesajı</p>
                  <p className="rounded-md bg-muted p-3 text-sm">{selected.message}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Kaynak</p>
                  <p className="font-medium">{SOURCE_LABELS[selected.source] ?? selected.source}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Durum</p>
                  <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v)}>
                    <SelectTrigger className="mt-1 w-40" aria-label="Durum değiştir">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REQUEST_STATUS_ORDER.map((status) => (
                        <SelectItem key={status} value={status}>
                          {REQUEST_STATUS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Field label="Yönetici Notu" htmlFor="request-notes">
                <Textarea
                  id="request-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Arama notları, randevu bilgisi, tespitler..."
                  className="h-24"
                />
              </Field>
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2 aria-hidden="true" />
              Sil
            </Button>
            <Button onClick={saveNotes} disabled={saving}>
              {saving ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Save aria-hidden="true" />
              )}
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Silme onayı */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Talep silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              {selected?.code} kodlu talep kalıcı olarak silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deleteRequest();
              }}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading && requests && requests.length > 0 ? (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Güncelleniyor...
        </p>
      ) : null}
    </div>
  );
}
