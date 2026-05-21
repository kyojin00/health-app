import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export const dynamic = "force-dynamic";

type WorkerStatus = {
  id: string;
  name: string;
  department_name: string | null;
  is_foreign: boolean;
  cycle_months: number;
  cycle_locked: boolean;
  last_exam_date: string | null;
  next_due_date: string | null;
  days_until_due: number | null;
  active: boolean;
};

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: { dept?: string; q?: string };
}) {
  const supabase = createClient();
  let query = supabase.from("worker_status").select("*").eq("active", true);
  if (searchParams.dept) query = query.eq("department_name", searchParams.dept);
  if (searchParams.q) query = query.ilike("name", `%${searchParams.q}%`);

  const { data, error } = await query.order("name");
  const { data: depts } = await supabase.from("departments").select("name").order("name");

  if (error) return <p className="text-red-600">{error.message}</p>;
  const workers = (data || []) as WorkerStatus[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">근로자 목록</h1>
        <Link
          href="/workers/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + 근로자 추가
        </Link>
      </div>

      {/* 필터 */}
      <form className="flex gap-2 flex-wrap items-center">
        <input
          name="q"
          defaultValue={searchParams.q || ""}
          placeholder="이름 검색"
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
        />
        <select
          name="dept"
          defaultValue={searchParams.dept || ""}
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
        >
          <option value="">전체 부서</option>
          {depts?.map((d) => (
            <option key={d.name} value={d.name}>{d.name}</option>
          ))}
        </select>
        <button className="bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-md text-sm">
          조회
        </button>
        <span className="text-sm text-slate-500 ml-auto">총 {workers.length}명</span>
      </form>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-2 font-medium">이름</th>
              <th className="text-left px-4 py-2 font-medium">부서</th>
              <th className="text-left px-4 py-2 font-medium">주기</th>
              <th className="text-left px-4 py-2 font-medium">마지막 검진</th>
              <th className="text-left px-4 py-2 font-medium">다음 예정일</th>
              <th className="text-right px-4 py-2 font-medium">D-day</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2">
                  <Link href={`/workers/${w.id}`} className="text-brand-600 hover:underline font-medium">
                    {w.name}
                  </Link>
                  {w.is_foreign && <span className="ml-2 text-xs text-slate-400">외</span>}
                </td>
                <td className="px-4 py-2 text-slate-600">{w.department_name || "-"}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    w.cycle_months === 6 ? "bg-red-100 text-red-700" :
                    w.cycle_months === 24 ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {w.cycle_months}개월{w.cycle_locked && " 🔒"}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-600">{w.last_exam_date || "-"}</td>
                <td className="px-4 py-2">{w.next_due_date || "-"}</td>
                <td className={`px-4 py-2 text-right font-mono ${
                  w.days_until_due === null ? "text-slate-400" :
                  w.days_until_due < 0 ? "text-red-600 font-bold" :
                  w.days_until_due <= 30 ? "text-orange-600 font-semibold" :
                  w.days_until_due <= 90 ? "text-amber-600" :
                  "text-slate-600"
                }`}>
                  {w.days_until_due === null ? "-" :
                   w.days_until_due < 0 ? `${Math.abs(w.days_until_due)}일 지남` :
                   w.days_until_due === 0 ? "오늘" :
                   `D-${w.days_until_due}`}
                </td>
              </tr>
            ))}
            {workers.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">데이터 없음</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
