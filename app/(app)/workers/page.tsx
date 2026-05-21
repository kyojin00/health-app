// app/(app)/workers/page.tsx
// 근로자 목록 + 인라인 삭제/추가 + 선택 항목 엑셀 다운로드

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";

type WorkerStatus = {
  id: string;
  name: string;
  department_name: string | null;
  position: string | null;
  phone: string | null;
  hire_date: string | null;
  nationality: string | null;
  is_foreign: boolean;
  cycle_months: number;
  cycle_locked: boolean;
  last_exam_date: string | null;
  last_category: string | null;
  next_due_date: string | null;
  days_until_due: number | null;
  needs_initial: boolean;
  requires_special: boolean | null;
  exam_count: number;
};

// ────────────────────────────────────────────────
// CSV 생성 (UTF-8 BOM 포함, 엑셀에서 한글 정상 표시)
// ────────────────────────────────────────────────
function downloadCSV(rows: WorkerStatus[], filename: string) {
  const headers = [
    "부서", "이름", "직급", "입사일자", "연락처",
    "국적", "외국인여부", "검진유형",
    "배치전필요", "마지막검진일", "마지막검진구분",
    "주기(개월)", "다음예정일", "D-day",
  ];

  const lines = [headers.join(",")];
  for (const w of rows) {
    const examType = w.requires_special ? "특수+일반" : "일반";
    const initialKind = w.requires_special ? "배치전(특수)" : "일반검진";
    const dDay =
      w.days_until_due === null
        ? ""
        : w.days_until_due < 0
        ? `${Math.abs(w.days_until_due)}일 지남`
        : w.days_until_due === 0
        ? "오늘"
        : `D-${w.days_until_due}`;
    const cells = [
      w.department_name || "",
      w.name,
      w.position || "",
      w.hire_date || "",
      w.phone || "",
      w.nationality || "",
      w.is_foreign ? "Y" : "N",
      examType,
      w.needs_initial ? initialKind : "",
      w.last_exam_date || "",
      w.last_category || "",
      String(w.cycle_months),
      w.next_due_date || "",
      dDay,
    ];
    // 쉼표/따옴표/줄바꿈 들어간 셀은 큰따옴표로 감싸기
    lines.push(cells.map(esc).join(","));
  }

  const BOM = "\uFEFF"; // 엑셀 한글 깨짐 방지
  const blob = new Blob([BOM + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function esc(s: string) {
  if (s === "" || s == null) return "";
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// 오늘 날짜 YYYYMMDD
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

// ────────────────────────────────────────────────
// 페이지
// ────────────────────────────────────────────────
export default function WorkersPage() {
  const [workers, setWorkers] = useState<WorkerStatus[]>([]);
  const [depts, setDepts] = useState<{ name: string }[]>([]);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState("");
  const [examType, setExamType] = useState(""); // 검진유형 (특수/일반)
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from("worker_status").select("*").eq("active", true);
    if (dept) query = query.eq("department_name", dept);
    if (q) query = query.ilike("name", `%${q}%`);
    if (status === "needs_initial") query = query.eq("needs_initial", true);
    if (status === "due_30") query = query.lte("days_until_due", 30).gte("days_until_due", -3650);
    if (status === "due_90") query = query.lte("days_until_due", 90).gte("days_until_due", -3650);
    if (status === "overdue") query = query.lt("days_until_due", 0);
    if (examType === "special") query = query.eq("requires_special", true);
    if (examType === "general") query = query.eq("requires_special", false);
    const { data } = await query
      .order("department_name", { nullsFirst: false })
      .order("hire_date", { nullsFirst: false });

    const { data: d } = await supabase.from("departments").select("name").order("id");
    setWorkers((data as WorkerStatus[]) || []);
    setDepts(d || []);
    setLoading(false);
    // 필터 바뀌면 선택 초기화
    setSelected(new Set());
  }, [q, dept, status, examType]);

  useEffect(() => {
    load();
  }, [load]);

  async function deleteWorker(w: WorkerStatus) {
    const msg =
      w.exam_count > 0
        ? `${w.name}을(를) 삭제할까요?\n검진 기록 ${w.exam_count}건도 함께 삭제됩니다.\n\n(퇴직자 보관이 목적이라면 '퇴직' 버튼을 사용하세요)`
        : `${w.name}을(를) 삭제할까요?`;
    if (!confirm(msg)) return;
    setDeleting(w.id);
    const supabase = createClient();
    const { error } = await supabase.from("workers").delete().eq("id", w.id);
    setDeleting(null);
    if (error) {
      alert("삭제 실패: " + error.message);
      return;
    }
    load();
  }

  async function deactivate(w: WorkerStatus) {
    if (!confirm(`${w.name}을(를) 퇴직 처리할까요?\n검진 기록은 보존됩니다.`)) return;
    setDeleting(w.id);
    const supabase = createClient();
    const { error } = await supabase.from("workers").update({ active: false }).eq("id", w.id);
    setDeleting(null);
    if (error) {
      alert("처리 실패: " + error.message);
      return;
    }
    load();
  }

  // 선택 관련
  function toggleOne(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }
  function toggleAll() {
    if (selected.size === workers.length) setSelected(new Set());
    else setSelected(new Set(workers.map((w) => w.id)));
  }
  const allChecked = workers.length > 0 && selected.size === workers.length;
  const someChecked = selected.size > 0 && selected.size < workers.length;

  // 다운로드 대상: 선택 있으면 선택분, 없으면 현재 필터링된 전체
  const rowsToExport = useMemo(() => {
    if (selected.size === 0) return workers;
    return workers.filter((w) => selected.has(w.id));
  }, [selected, workers]);

  function exportSelected() {
    if (rowsToExport.length === 0) {
      alert("내려받을 인원이 없습니다");
      return;
    }
    const tag = [
      examType === "special" ? "특수" : examType === "general" ? "일반" : "",
      status === "needs_initial" ? "배치전" :
      status === "overdue" ? "기한지남" :
      status === "due_30" ? "30일이내" :
      status === "due_90" ? "90일이내" : "",
      dept,
    ].filter(Boolean).join("_");
    const filename = `근로자명단${tag ? "_" + tag : ""}_${todayStr()}.csv`;
    downloadCSV(rowsToExport, filename);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">근로자 목록</h1>
        <div className="flex gap-2">
          <button
            onClick={exportSelected}
            disabled={rowsToExport.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            title={
              selected.size > 0
                ? `선택한 ${selected.size}명 내려받기`
                : `필터된 ${workers.length}명 전체 내려받기`
            }
          >
            📊 엑셀 다운로드 ({selected.size > 0 ? `선택 ${selected.size}` : `전체 ${workers.length}`}명)
          </button>
          <Link
            href="/workers/new"
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + 근로자 추가
          </Link>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex gap-2 flex-wrap items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="이름 검색"
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
        />
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
        >
          <option value="">전체 부서</option>
          {depts.map((d) => (
            <option key={d.name} value={d.name}>{d.name}</option>
          ))}
        </select>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
        >
          <option value="">검진유형 전체</option>
          <option value="special">특수검진 대상 (생산부)</option>
          <option value="general">일반검진만 (사무실/출하)</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
        >
          <option value="">상태 전체</option>
          <option value="needs_initial">배치전 필요</option>
          <option value="overdue">검진 기한 지남</option>
          <option value="due_30">30일 이내 마감</option>
          <option value="due_90">90일 이내 마감</option>
        </select>
        <button
          onClick={() => { setQ(""); setDept(""); setStatus(""); setExamType(""); }}
          className="text-xs text-slate-500 hover:text-slate-900 ml-1"
        >
          필터 초기화
        </button>
        <span className="text-sm text-slate-500 ml-auto">
          {loading ? "..." : `총 ${workers.length}명`}
          {selected.size > 0 && <span className="ml-2 text-brand-600 font-medium">선택 {selected.size}명</span>}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="w-10 px-3 py-2">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => { if (el) el.indeterminate = someChecked; }}
                  onChange={toggleAll}
                />
              </th>
              <th className="text-left px-4 py-2 font-medium">이름</th>
              <th className="text-left px-4 py-2 font-medium">부서</th>
              <th className="text-left px-4 py-2 font-medium">직급</th>
              <th className="text-left px-4 py-2 font-medium">입사일</th>
              <th className="text-left px-4 py-2 font-medium">주기</th>
              <th className="text-left px-4 py-2 font-medium">마지막 검진</th>
              <th className="text-left px-4 py-2 font-medium">다음 예정일</th>
              <th className="text-right px-4 py-2 font-medium">D-day</th>
              <th className="text-right px-4 py-2 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr
                key={w.id}
                className={`border-t border-slate-100 hover:bg-slate-50 ${
                  selected.has(w.id) ? "bg-brand-50/50" : ""
                }`}
              >
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selected.has(w.id)}
                    onChange={() => toggleOne(w.id)}
                  />
                </td>
                <td className="px-4 py-2">
                  <Link href={`/workers/${w.id}`} className="text-brand-600 hover:underline font-medium">
                    {w.name}
                  </Link>
                  {w.needs_initial && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                      배치전
                    </span>
                  )}
                  {w.nationality && w.nationality !== "한국" && (
                    <span className="ml-2 text-xs text-slate-400" title={w.nationality}>외</span>
                  )}
                </td>
                <td className="px-4 py-2 text-slate-600">{w.department_name || "-"}</td>
                <td className="px-4 py-2 text-slate-600">{w.position || "-"}</td>
                <td className="px-4 py-2 text-slate-600 text-xs">{w.hire_date || "-"}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    w.requires_special === false ? "bg-sky-100 text-sky-700" :
                    w.cycle_months === 6 ? "bg-red-100 text-red-700" :
                    w.cycle_months === 24 ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {w.requires_special === false ? "일반" : `${w.cycle_months}개월`}
                    {w.cycle_locked && w.requires_special !== false && " 🔒"}
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
                <td className="px-4 py-2 text-right whitespace-nowrap">
                  <button
                    onClick={() => deactivate(w)}
                    disabled={deleting === w.id}
                    className="text-xs text-slate-500 hover:text-slate-900 mr-2 disabled:opacity-50"
                    title="검진 기록은 남기고 퇴직 처리"
                  >
                    퇴직
                  </button>
                  <button
                    onClick={() => deleteWorker(w)}
                    disabled={deleting === w.id}
                    className="text-xs text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
                    title="완전 삭제 (검진 기록도 함께 삭제)"
                  >
                    {deleting === w.id ? "삭제중..." : "삭제"}
                  </button>
                </td>
              </tr>
            ))}
            {!loading && workers.length === 0 && (
              <tr><td colSpan={10} className="text-center py-8 text-slate-400">데이터 없음</td></tr>
            )}
            {loading && workers.length === 0 && (
              <tr><td colSpan={10} className="text-center py-8 text-slate-400">불러오는 중...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-500">
        💡 팁: 필터 + 체크박스로 원하는 인원 골라 엑셀 받기. 예) 검진유형=특수검진 + 상태=배치전 필요 → 전체 선택 → 다운로드
      </div>
    </div>
  );
}