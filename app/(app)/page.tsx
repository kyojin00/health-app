// app/(app)/page.tsx
// 대시보드: 안 받은 사람 포함 전체 현황

import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

type WorkerStatus = {
  id: string;
  name: string;
  department_name: string | null;
  position: string | null;
  hire_date: string | null;
  nationality: string | null;
  cycle_months: number;
  last_exam_date: string | null;
  next_due_date: string | null;
  days_until_due: number | null;
  last_category: string | null;
  needs_initial: boolean;
  requires_special: boolean | null;
  exam_count: number;
};

function bucket(w: WorkerStatus): string {
  if (w.needs_initial) return "needs-initial";
  if (w.days_until_due === null) return "no-exam";
  if (w.days_until_due < 0) return "overdue";
  if (w.days_until_due <= 30) return "soon";
  if (w.days_until_due <= 90) return "upcoming";
  return "later";
}

const bucketMeta: Record<string, { title: string; color: string; bg: string; border: string }> = {
  "needs-initial": { title: "검진 안 받음 (배치전 필요)", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300" },
  overdue: { title: "지난 검진 (재검 필요)", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  soon: { title: "30일 이내", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  upcoming: { title: "90일 이내", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  later: { title: "90일 이후 (정상)", color: "text-slate-600", bg: "bg-white", border: "border-slate-200" },
  "no-exam": { title: "기록 없음 (기타)", color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" },
};

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_status")
    .select("*")
    .eq("active", true)
    .order("hire_date", { ascending: true, nullsFirst: false });

  if (error) {
    return <p className="text-red-600">DB 오류: {error.message}</p>;
  }

  const workers = (data || []) as WorkerStatus[];
  const grouped: Record<string, WorkerStatus[]> = {
    "needs-initial": [], overdue: [], soon: [], upcoming: [], later: [], "no-exam": [],
  };
  for (const w of workers) grouped[bucket(w)].push(w);

  // 마감일 임박 순으로 정렬
  for (const k of ["overdue", "soon", "upcoming", "later"]) {
    grouped[k].sort((a, b) => (a.days_until_due ?? 99999) - (b.days_until_due ?? 99999));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <div className="text-sm text-slate-500">활동 인원 {workers.length}명</div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {(["needs-initial", "overdue", "soon", "upcoming", "later", "no-exam"] as const).map((k) => (
          <div key={k} className={`${bucketMeta[k].bg} ${bucketMeta[k].border} border rounded-lg p-4`}>
            <div className={`text-2xl font-bold ${bucketMeta[k].color}`}>
              {grouped[k].length}
            </div>
            <div className="text-xs text-slate-600 mt-1">{bucketMeta[k].title}</div>
          </div>
        ))}
      </div>

      {/* 검진 안 받은 사람 (최우선) */}
      {grouped["needs-initial"].length > 0 && (
        <section>
          <h2 className="text-base font-bold text-purple-700 mb-2">
            ⚠️ 검진 안 받음 · {grouped["needs-initial"].length}명 (배치전 검진 필요)
          </h2>
          <div className="bg-white border-2 border-purple-300 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-purple-50 text-slate-700">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">이름</th>
                  <th className="text-left px-4 py-2 font-medium">부서</th>
                  <th className="text-left px-4 py-2 font-medium">직급</th>
                  <th className="text-left px-4 py-2 font-medium">입사일자</th>
                  <th className="text-left px-4 py-2 font-medium">국적</th>
                  <th className="text-left px-4 py-2 font-medium">검진 유형</th>
                </tr>
              </thead>
              <tbody>
                {grouped["needs-initial"].map((w) => (
                  <tr key={w.id} className="border-t border-slate-100 hover:bg-purple-50/50">
                    <td className="px-4 py-2">
                      <Link href={`/workers/${w.id}`} className="text-brand-600 hover:underline font-medium">
                        {w.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-slate-600">{w.department_name || "-"}</td>
                    <td className="px-4 py-2 text-slate-600">{w.position || "-"}</td>
                    <td className="px-4 py-2 text-slate-600">{w.hire_date || "-"}</td>
                    <td className="px-4 py-2 text-slate-600 text-xs">
                      {w.nationality && w.nationality !== "한국" ? `외국인(${w.nationality})` : w.nationality || "-"}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                        w.requires_special
                          ? "bg-orange-100 text-orange-700"
                          : "bg-sky-100 text-sky-700"
                      }`}>
                        {w.requires_special ? "배치전(특수)" : "일반검진"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 받은 사람들 (마감 임박순) */}
      {(["overdue", "soon", "upcoming", "later"] as const).map((k) =>
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
                        w.days_until_due !== null && w.days_until_due <= 90 ? "text-amber-600" :
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

      {workers.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center text-slate-500">
          등록된 근로자가 없습니다
        </div>
      )}
    </div>
  );
}