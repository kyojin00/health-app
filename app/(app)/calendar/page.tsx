import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export const dynamic = "force-dynamic";

function buildMonth(year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const startWeekday = first.getDay(); // 0=Sun
  const days: { date: string; inMonth: boolean }[] = [];
  // 앞쪽 빈 칸 (이전 달)
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, -i);
    days.push({ date: d.toISOString().slice(0, 10), inMonth: false });
  }
  // 이번 달
  for (let d = 1; d <= last.getDate(); d++) {
    const dt = new Date(year, month - 1, d);
    days.push({ date: dt.toISOString().slice(0, 10), inMonth: true });
  }
  // 뒤쪽 빈 칸
  while (days.length % 7 !== 0) {
    const lastDate = new Date(days[days.length - 1].date);
    lastDate.setDate(lastDate.getDate() + 1);
    days.push({ date: lastDate.toISOString().slice(0, 10), inMonth: false });
  }
  return days;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: { y?: string; m?: string };
}) {
  const today = new Date();
  const year = parseInt(searchParams.y || String(today.getFullYear()));
  const month = parseInt(searchParams.m || String(today.getMonth() + 1));

  const supabase = createClient();
  const { data: statuses } = await supabase
    .from("worker_status")
    .select("id, name, next_due_date, days_until_due, department_name, cycle_months")
    .eq("active", true)
    .not("next_due_date", "is", null);

  // 같은 달 검진 예정 + 지난 미수검도 표시
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEndDate = new Date(year, month, 0);
  const monthEnd = monthEndDate.toISOString().slice(0, 10);

  const dayMap = new Map<string, any[]>();
  (statuses || []).forEach((s: any) => {
    if (!s.next_due_date) return;
    if (s.next_due_date >= monthStart && s.next_due_date <= monthEnd) {
      const list = dayMap.get(s.next_due_date) || [];
      list.push(s);
      dayMap.set(s.next_due_date, list);
    }
  });

  const days = buildMonth(year, month);

  const prevM = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const nextM = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };
  const todayStr = today.toISOString().slice(0, 10);

  // 이번 달 + 지난 미수검 요약
  const overdueAll = (statuses || []).filter((s: any) => s.days_until_due < 0);
  const monthCount = Array.from(dayMap.values()).reduce((a, b) => a + b.length, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">캘린더</h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/calendar?y=${prevM.y}&m=${prevM.m}`}
            className="px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-50"
          >‹</Link>
          <div className="px-4 py-1.5 font-semibold min-w-[120px] text-center">
            {year}년 {month}월
          </div>
          <Link
            href={`/calendar?y=${nextM.y}&m=${nextM.m}`}
            className="px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-50"
          >›</Link>
          <Link
            href={`/calendar?y=${today.getFullYear()}&m=${today.getMonth() + 1}`}
            className="px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-50 text-sm"
          >오늘</Link>
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="text-slate-600">이번 달 예정: <b className="text-slate-900">{monthCount}건</b></div>
        {overdueAll.length > 0 && (
          <div className="text-red-600">지난 미수검: <b>{overdueAll.length}명</b></div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 text-xs font-medium text-slate-500 bg-slate-50">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div key={d} className={`px-2 py-2 text-center ${
              i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : ""
            }`}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const list = dayMap.get(d.date) || [];
            const isToday = d.date === todayStr;
            const dayNum = parseInt(d.date.slice(8));
            const dow = i % 7;
            return (
              <div
                key={i}
                className={`min-h-[110px] border-r border-b border-slate-100 p-1.5 ${
                  !d.inMonth ? "bg-slate-50/50" : ""
                } ${isToday ? "bg-brand-50" : ""}`}
              >
                <div className={`text-xs font-medium mb-1 ${
                  !d.inMonth ? "text-slate-300" :
                  dow === 0 ? "text-red-500" :
                  dow === 6 ? "text-blue-500" :
                  "text-slate-700"
                } ${isToday ? "text-brand-700 font-bold" : ""}`}>
                  {dayNum}
                </div>
                <div className="space-y-0.5">
                  {list.slice(0, 4).map((w: any) => (
                    <Link
                      key={w.id}
                      href={`/workers/${w.id}`}
                      className={`block text-xs px-1.5 py-0.5 rounded truncate ${
                        w.cycle_months === 6 ? "bg-red-100 text-red-700 hover:bg-red-200" :
                        w.cycle_months === 24 ? "bg-blue-100 text-blue-700 hover:bg-blue-200" :
                        "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      title={`${w.name} (${w.department_name || "-"})`}
                    >
                      {w.name}
                    </Link>
                  ))}
                  {list.length > 4 && (
                    <div className="text-xs text-slate-400 px-1">+{list.length - 4}명</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
