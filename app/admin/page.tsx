import { redirect } from "next/navigation";
import { desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, wallets } from "@/lib/schema";
import { isAdmin } from "@/lib/auth";

export default async function AdminPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/dashboard");
  }

  const [userStats, walletStats, recentUsers] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)`,
      })
      .from(users),

    db
      .select({
        totalBalance: sql<string>`coalesce(sum(${wallets.balance}), 0)`,
      })
      .from(wallets),

    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10),
  ]);

  const totalUsers = Number(userStats[0]?.total ?? 0);
  const totalBalance = Number(walletStats[0]?.totalBalance ?? 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Rivo Surveys
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Administration
            </h1>
          </div>

          <a
            href="/dashboard"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back to Dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitor your Rivo Surveys platform.
          </p>
        </div>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Users
            </p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {totalUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Wallet Balance
            </p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              ${totalBalance.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Administrator
            </p>
            <p className="mt-3 truncate text-lg font-semibold text-gray-900">
              gatapro901@gmail.com
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Users
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              The latest accounts registered on the platform.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Registered
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.name || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}

                {recentUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
