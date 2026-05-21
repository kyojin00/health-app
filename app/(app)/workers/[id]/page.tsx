import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import WorkerEditor from "@/components/WorkerEditor";

export const dynamic = "force-dynamic";

export default async function WorkerDetail({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: worker } = await supabase
    .from("worker_status")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!worker) notFound();

  const { data: exams } = await supabase
    .from("examinations")
    .select("*")
    .eq("worker_id", params.id)
    .order("exam_date", { ascending: false });

  const { data: depts } = await supabase.from("departments").select("*").order("name");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/workers" className="text-slate-500 hover:text-slate-900">← 목록</Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{worker.name}</h1>
            <p className="text-slate-500 mt-1">
              {worker.department_name || "부서 없음"}
              {worker.is_foreign && " · 외국인"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">다음 검진</div>
            <div className="text-lg font-semibold">{worker.next_due_date || "-"}</div>
            {worker.days_until_due !== null && (
              <div className={`text-sm font-mono ${
                worker.days_until_due < 0 ? "text-red-600 font-bold" :
                worker.days_until_due <= 30 ? "text-orange-600" :
                "text-slate-600"
              }`}>
                {worker.days_until_due < 0
                  ? `${Math.abs(worker.days_until_due)}일 지남`
                  : worker.days_until_due === 0
                  ? "오늘"
                  : `D-${worker.days_until_due}`}
              </div>
            )}
          </div>
        </div>

        <WorkerEditor worker={worker} departments={depts || []} />
      </div>

      {/* 검진 이력 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">검진 이력</h2>
          <Link
            href={`/examinations/new?worker_id=${worker.id}`}
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm px-3 py-1.5 rounded-md"
          >
            + 검진 추가
          </Link>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-2 font-medium">검진일</th>
                <th className="text-left px-4 py-2 font-medium">형태</th>
                <th className="text-left px-4 py-2 font-medium">종류</th>
                <th className="text-left px-4 py-2 font-medium">구분</th>
                <th className="text-left px-4 py-2 font-medium">주기</th>
                <th className="text-left px-4 py-2 font-medium">유해인자</th>
              </tr>
            </thead>
            <tbody>
              {(exams || []).map((e: any) => (
                <tr key={e.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium">{e.exam_date}</td>
                  <td className="px-4 py-2 text-slate-600">{e.exam_form || "-"}</td>
                  <td className="px-4 py-2 text-slate-600">{e.exam_kind || "-"}</td>
                  <td className="px-4 py-2 text-slate-600">{e.exam_category || "-"}</td>
                  <td className="px-4 py-2">
                    {e.cycle_months ? (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        e.cycle_months === 6 ? "bg-red-100 text-red-700" :
                        e.cycle_months === 24 ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {e.cycle_months}개월
                      </span>
                    ) : <span className="text-slate-400">-</span>}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500 max-w-md truncate" title={e.factors_raw || ""}>
                    {e.factors_raw || "-"}
                  </td>
                </tr>
              ))}
              {(!exams || exams.length === 0) && (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">검진 기록 없음</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
