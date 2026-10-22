import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

/**
 * Dashboard layout: oturum yoksa 404 döndürür (login'e yönlendirme yapılmaz,
 * panelin varlığı dışarıya sızmaz; birincil koruma middleware'dadır).
 * Login sayfası (auth) route grubunda olduğu için bu layout oradan geçmez.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    notFound();
  }

  let pendingCount = 0;
  try {
    pendingCount = await db.serviceRequest.count({ where: { status: "NEW" } });
  } catch {
    pendingCount = 0;
  }

  return (
    <AdminShell
      user={{ name: session.name, email: session.email, role: session.role }}
      pendingCount={pendingCount}
    >
      {children}
    </AdminShell>
  );
}
