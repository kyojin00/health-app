import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: { year?: string; category?: string; q?: string };
}) {
  const supabase = createClient();
  let query = supabase
    .from("examinations")
    .select("*, workers(id, name, departments(name))")
    .order("exam_date", { ascending: false });

  if (searchParams.year) {
    query = query
      .gte("exam_date", `${searchParams.year}-01-01`)
      .lte("exam_date", `${searchParams.year}-12-31`);
  }
  if (searchParams.category) query = query.eq("exam_category", searchParams.category);

  const { data, error } = await query.limit(500);
  if (error) return <p className="text-red-600">{error.message}</p>;

  let exams = data || [];
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    exams = exams.filter((e: any) => e.workers?.name?.toLowerCase().includes(q));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">검진 기록</h1>
        <Link
          href="/examinations/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + 검진 기록 추가
        </Link>
      </div>

      <form className="flex gap-2 flex-wrap items-center">
        <input
          name="q"
          defaultValue={searchParams.q || ""}
          placeholder="이름 검색"
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
        />
        <select
          name="year"
          defaultValue={searchParams.year || ""}
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
        >
          <option value="">전체 년도</option>
          <option value="2024">2024년</option>
          <option value="2025">2025년</option>
          <option value="2026">2026년</option>
        </select>
        <select
          name="category"
          defaultValue={searchParams.category || ""}
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
        >
          <option value="">전체 구분</option>
          <option value="배치전">배치전</option>
          <option value="배치후">배치후</option>
          <option value="일반">일반</option>
          <option value="특수">특수</option>
          <option value="일반+특수">일반+특수</option>
          <option value="기타">기타</option>
        </select>
        <button className="bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-md text-sm">
          조회
        </button>
        <span className="text-sm text-slate-500 ml-auto">총 {exams.length}건</span>
      </form>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-2 font-medium">검진일</th>
              <th className="text-left px-4 py-2 font-medium">이름</th>
              <th className="text-left px-4 py-2 font-medium">부서</th>
              <th className="text-left px-4 py-2 font-medium">형태</th>
              <th className="text-left px-4 py-2 font-medium">구분</th>
              <th className="text-left px-4 py-2 font-medium">주기</th>
              <th className="text-left px-4 py-2 font-medium">유해인자</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((e: any) => (
              <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2 font-medium">{e.exam_date}</td>
                <td className="px-4 py-2">
                  <Link href={`/workers/${e.workers?.id}`} className="text-brand-600 hover:underline">
                    {e.workers?.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-slate-600">{e.workers?.departments?.name || "-"}</td>
                <td className="px-4 py-2 text-slate-600">{e.exam_form || "-"}</td>
                <td className="px-4 py-2 text-slate-600">{e.exam_category || "-"}</td>
                <td className="px-4 py-2">
                  {e.cycle_months ? (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      e.cycle_months === 6 ? "bg-red-100 text-red-700" :
                      e.cycle_months === 24 ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>{e.cycle_months}m</span>
                  ) : <span className="text-slate-300">-</span>}
                </td>
                <td className="px-4 py-2 text-xs text-slate-500 max-w-xs truncate" title={e.factors_raw || ""}>
                  {e.factors_raw || "-"}
                </td>
              </tr>
            ))}
            {exams.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-slate-400">데이터 없음</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
