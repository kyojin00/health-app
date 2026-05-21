import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

type WorkerStatus = {
  id: string;
  name: string;
  department_name: string | null;
  cycle_months: number;
  last_exam_date: string | null;
  next_due_date: string | null;
  days_until_due: number | null;
  last_category: string | null;
};

function bucket(days: number | null): string {
  if (days === null) return "no-exam";
  if (days < 0) return "overdue";
  if (days <= 30) return "soon";
  if (days <= 90) return "upcoming";
  return "later";
}

const bucketMeta: Record<string, { title: string; color: string; bg: string; border: string }> = {
  overdue: { title: "지난 검진 (재검 필요)", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  soon: { title: "30일 이내", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  upcoming: { title: "90일 이내", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  later: { title: "그 이후", color: "text-slate-600", bg: "bg-white", border: "border-slate-200" },
  "no-exam": { title: "검진 기록 없음", color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" },
};

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_status")
    .select("*")
    .eq("active", true)
    .order("days_until_due", { ascending: true, nullsFirst: false });

  if (error) {
    return <p className="text-red-600">DB 오류: {error.message}</p>;
  }

  const workers = (data || []) as WorkerStatus[];
  const grouped: Record<string, WorkerStatus[]> = {
    overdue: [], soon: [], upcoming: [], later: [], "no-exam": [],
  };
  for (const w of workers) grouped[bucket(w.days_until_due)].push(w);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <div className="text-sm text-slate-500">전체 {workers.length}명</div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(["overdue", "soon", "upcoming", "later", "no-exam"] as const).map((k) => (
          <div key={k} className={`${bucketMeta[k].bg} ${bucketMeta[k].border} border rounded-lg p-4`}>
            <div className={`text-2xl font-bold ${bucketMeta[k].color}`}>
              {grouped[k].length}
            </div>
            <div className="text-xs text-slate-600 mt-1">{bucketMeta[k].title}</div>
          </div>
        ))}
      </div>

      {/* 상세 리스트 */}
      {(["overdue", "soon", "upcoming"] as const).map((k) =>
        grouped[k].length > 0 ? (
          <section key={k}>
            <h2 className={`text-sm font-semibold ${bucketMeta[k].color} mb-2`}>
              {bucketMeta[k].title} · {grouped[k].length}명
            </h2>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">이름</th>
                    <th className="text-left px-4 py-2 font-medium">부서</th>
                    <th className="text-left px-4 py-2 font-medium">마지막 검진</th>
                    <th className="text-left px-4 py-2 font-medium">다음 예정일</th>
                    <th className="text-left px-4 py-2 font-medium">주기</th>
                    <th className="text-right px-4 py-2 font-medium">D-day</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[k].map((w) => (
                    <tr key={w.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-2">
                        <Link href={`/workers/${w.id}`} className="text-brand-600 hover:underline font-medium">
                          {w.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-slate-600">{w.department_name || "-"}</td>
                      <td className="px-4 py-2 text-slate-600">{w.last_exam_date || "-"}</td>
                      <td className="px-4 py-2">{w.next_due_date || "-"}</td>
                      <td className="px-4 py-2 text-slate-600">{w.cycle_months}개월</td>
                      <td className={`px-4 py-2 text-right font-mono ${
                        w.days_until_due !== null && w.days_until_due < 0 ? "text-red-600 font-bold" :
                        w.days_until_due !== null && w.days_until_due <= 30 ? "text-orange-600 font-semibold" :
                        "text-slate-700"
                      }`}>
                        {w.days_until_due === null
                          ? "-"
                          : w.days_until_due < 0
                          ? `${Math.abs(w.days_until_due)}일 지남`
                          : w.days_until_due === 0
                          ? "오늘"
                          : `D-${w.days_until_due}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null
      )}

      {grouped.overdue.length === 0 && grouped.soon.length === 0 && grouped.upcoming.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-700">
          🎉 90일 이내 검진이 필요한 근로자가 없습니다
        </div>
      )}
    </div>
  );
}
