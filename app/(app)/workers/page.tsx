// app/(app)/workers/page.tsx
// 근로자 목록 + 인라인 삭제/추가 + 엑셀 다운로드 + 검진 진행 단계 표시

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

type ExamFlags = {
  initial: boolean;     // 배치전 받음
  followup: boolean;    // 배치후 받음
  regular: boolean;     // 정기 특수 받음
  general: boolean;     // 일반 받음
};

// ────────────────────────────────────────────────
// CSV 생성
// ────────────────────────────────────────────────
function downloadCSV(rows: WorkerStatus[], flagsMap: Map<string, ExamFlags>, filename: string) {
  const headers = [
    "부서", "이름", "직급", "입사일자", "연락처",
    "국적", "외국인여부", "검진유형",
    "배치전", "배치후", "정기특수", "일반",
    "현재단계", "마지막검진일", "마지막검진구분",
    "주기(개월)", "다음예정일", "D-day",
  ];

  const lines = [headers.join(",")];
  for (const w of rows) {
    const f = flagsMap.get(w.id) || { initial: false, followup: false, regular: false, general: false };
    const isOverdue = w.days_until_due !== null && w.days_until_due < 0;
    // 정기 받았으면 배치전/배치후 자동 완료, 단 정기/일반은 주기 지나면 미실시
    const initialDone = f.initial || f.regular;
    const followupDone = f.followup || f.regular;
    const regularCurrent = f.regular && !isOverdue;
    const generalCurrent = f.general && !isOverdue;
    const examType = w.requires_special ? "특수+일반" : "일반";
    const stage = computeStage(w, f);
    const dDay =
      w.days_until_due === null ? "" :
      w.days_until_due < 0 ? `${Math.abs(w.days_until_due)}일 지남` :
      w.days_until_due === 0 ? "오늘" : `D-${w.days_until_due}`;
    const cells = [
      w.department_name || "",
      w.name,
      w.position || "",
      w.hire_date || "",
      w.phone || "",
      w.nationality || "",
      w.is_foreign ? "Y" : "N",
      examType,
      w.requires_special ? (initialDone ? "O" : "X") : "해당없음",
      w.requires_special ? (followupDone ? "O" : "X") : "해당없음",
      w.requires_special ? (regularCurrent ? "O" : "X") : "해당없음",
      generalCurrent ? "O" : "X",
      stage,
      w.last_exam_date || "",
      w.last_category || "",
      String(w.cycle_months),
      w.next_due_date || "",
      dDay,
    ];
    lines.push(cells.map(esc).join(","));
  }

  const BOM = "\uFEFF";
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

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

// ────────────────────────────────────────────────
// 검진 진행 단계 계산
// ────────────────────────────────────────────────
function computeStage(w: WorkerStatus, f: ExamFlags): string {
  const isOverdue = w.days_until_due !== null && w.days_until_due < 0;
  if (!w.requires_special) {
    // 사무직/출하 - 일반검진만
    if (!f.general) return "배치전 필요";
    if (isOverdue) return "일반 주기 지남";
    return "일반 수검";
  }
  // 생산직
  if (!f.initial && !f.regular) return "배치전 필요";
  if (f.regular && isOverdue) return "정기 주기 지남";
  if (f.regular) return "정기 특수";
  if (f.initial && !f.regular) return "배치전 완료 (정기 대기)";
  return "-";
}

// 진행 단계 배지
function StageBadges({ w, f }: { w: WorkerStatus; f: ExamFlags }) {
  const isOverdue = w.days_until_due !== null && w.days_until_due < 0;

  if (!w.requires_special) {
    // 사무직: 일반검진 받음 여부 (주기 지났으면 미실시로 표시)
    const generalCurrent = f.general && !isOverdue;
    return generalCurrent ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-500 text-white">
        <span>✓</span><span>일반</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-500 text-white"
        title={f.general ? "주기 지남 - 재검 필요" : "일반검진 미실시"}>
        <span>✗</span><span>일반</span>
      </span>
    );
  }

  // 생산직 - 배치전/배치후는 1회성이므로 한 번 받았으면 영구 완료
  // 정기는 주기가 지나면 미실시로 표시
  const initialDone = f.initial || f.regular;
  const followupDone = f.followup || f.regular;
  const regularCurrent = f.regular && !isOverdue;

  const cell = (label: string, done: boolean, overdue = false) => (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
        done ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
      }`}
      title={done ? `${label} 완료` : overdue ? `${label} 주기 지남 - 재검 필요` : `${label} 미실시`}
    >
      <span>{done ? "✓" : "✗"}</span>
      <span>{label}</span>
    </span>
  );
  return (
    <div className="flex gap-1 flex-wrap">
      {cell("배치전", initialDone)}
      {cell("배치후", followupDone)}
      {cell("정기", regularCurrent, f.regular /* 받았는데 주기 지난 케이스 */)}
    </div>
  );
}

// ────────────────────────────────────────────────
// 페이지
// ────────────────────────────────────────────────
export default function WorkersPage() {
  const [workers, setWorkers] = useState<WorkerStatus[]>([]);
  const [flagsMap, setFlagsMap] = useState<Map<string, ExamFlags>>(new Map());
  const [depts, setDepts] = useState<{ name: string }[]>([]);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState("");
  const [examType, setExamType] = useState("");
  const [stageFilter, setStageFilter] = useState("");
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
    if (status === "due_30") query = query.gte("days_until_due", 0).lte("days_until_due", 30);
    if (status === "due_90") query = query.gte("days_until_due", 0).lte("days_until_due", 90);
    if (status === "overdue") query = query.lt("days_until_due", 0);
    if (examType === "special") query = query.eq("requires_special", true);
    if (examType === "general") query = query.eq("requires_special", false);

    const { data } = await query
      .order("department_name", { nullsFirst: false })
      .order("hire_date", { nullsFirst: false });

    const { data: d } = await supabase.from("departments").select("name").order("id");

    // 검진 진행 단계 계산용: 활동 근로자의 모든 검진 기록 가져오기
    const { data: exams } = await supabase
      .from("examinations")
      .select("worker_id, exam_category, exam_kind")
      .limit(10000);

    const fm = new Map<string, ExamFlags>();
    for (const e of exams || []) {
      const cur = fm.get(e.worker_id) || { initial: false, followup: false, regular: false, general: false };
      const cat = e.exam_category || "";
      const kind = e.exam_kind || "";
      if (cat.includes("배치전") || kind.includes("배치전")) cur.initial = true;
      if (cat.includes("배치후") || kind.includes("배치후")) cur.followup = true;
      if (cat === "특수" || cat === "일반+특수") cur.regular = true;
      if (cat === "일반" || cat === "일반+특수") cur.general = true;
      fm.set(e.worker_id, cur);
    }

    let rows = (data as WorkerStatus[]) || [];

    // 진행 단계 필터 (클라이언트 사이드)
    if (stageFilter) {
      rows = rows.filter((w) => {
        const f = fm.get(w.id) || { initial: false, followup: false, regular: false, general: false };
        if (stageFilter === "all_no_exam") return !f.initial && !f.followup && !f.regular && !f.general;
        if (stageFilter === "no_initial") return !f.initial && !f.regular && w.requires_special;
        if (stageFilter === "initial_only") return w.requires_special && f.initial && !f.regular;
        if (stageFilter === "regular") return w.requires_special && f.regular;
        if (stageFilter === "office_no_general") return !w.requires_special && !f.general;
        if (stageFilter === "office_general") return !w.requires_special && f.general;
        return true;
      });
    }

    setWorkers(rows);
    setFlagsMap(fm);
    setDepts(d || []);
    setLoading(false);
    setSelected(new Set());
  }, [q, dept, status, examType, stageFilter]);

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
    if (error) { alert("삭제 실패: " + error.message); return; }
    load();
  }

  async function deactivate(w: WorkerStatus) {
    if (!confirm(`${w.name}을(를) 퇴직 처리할까요?\n검진 기록은 보존됩니다.`)) return;
    setDeleting(w.id);
    const supabase = createClient();
    const { error } = await supabase.from("workers").update({ active: false }).eq("id", w.id);
    setDeleting(null);
    if (error) { alert("처리 실패: " + error.message); return; }
    load();
  }

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

  const rowsToExport = useMemo(() => {
    if (selected.size === 0) return workers;
    return workers.filter((w) => selected.has(w.id));
  }, [selected, workers]);

  function exportSelected() {
    if (rowsToExport.length === 0) { alert("내려받을 인원이 없습니다"); return; }
    const tag = [
      examType === "special" ? "특수" : examType === "general" ? "일반" : "",
      status === "needs_initial" ? "배치전" :
      status === "overdue" ? "기한지남" :
      status === "due_30" ? "30일이내" :
      status === "due_90" ? "90일이내" : "",
      stageFilter === "all_no_exam" ? "검진안받음" :
      stageFilter === "no_initial" ? "배치전필요" :
      stageFilter === "initial_only" ? "배치전만완료" :
      stageFilter === "regular" ? "정기수검중" :
      stageFilter === "office_no_general" ? "일반미실시" :
      stageFilter === "office_general" ? "일반수검" : "",
      dept,
    ].filter(Boolean).join("_");
    const filename = `근로자명단${tag ? "_" + tag : ""}_${todayStr()}.csv`;
    downloadCSV(rowsToExport, flagsMap, filename);
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
          {depts.map((d) => (<option key={d.name} value={d.name}>{d.name}</option>))}
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
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
        >
          <option value="">진행 단계 전체</option>
          <option value="all_no_exam">⚠️ 검진 한 번도 안 받음</option>
          <option value="no_initial">생산직 - 배치전 필요</option>
          <option value="initial_only">생산직 - 배치전만 완료 (정기 미실시)</option>
          <option value="regular">생산직 - 정기 특수 수검중</option>
          <option value="office_no_general">사무직 - 일반 미실시</option>
          <option value="office_general">사무직 - 일반 수검</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
        >
          <option value="">마감 전체</option>
          <option value="overdue">검진 기한 지남</option>
          <option value="due_30">30일 이내 마감</option>
          <option value="due_90">90일 이내 마감</option>
        </select>
        <button
          onClick={() => { setQ(""); setDept(""); setStatus(""); setExamType(""); setStageFilter(""); }}
          className="text-xs text-slate-500 hover:text-slate-900 ml-1"
        >
          필터 초기화
        </button>
        <span className="text-sm text-slate-500 ml-auto">
          {loading ? "..." : `총 ${workers.length}명`}
          {selected.size > 0 && <span className="ml-2 text-brand-600 font-medium">선택 {selected.size}명</span>}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
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
              <th className="text-left px-3 py-2 font-medium">이름</th>
              <th className="text-left px-3 py-2 font-medium">부서</th>
              <th className="text-left px-3 py-2 font-medium">직급</th>
              <th className="text-left px-3 py-2 font-medium">입사일</th>
              <th className="text-left px-3 py-2 font-medium">검진 진행</th>
              <th className="text-left px-3 py-2 font-medium">주기</th>
              <th className="text-left px-3 py-2 font-medium">마지막 검진</th>
              <th className="text-left px-3 py-2 font-medium">다음 예정일</th>
              <th className="text-right px-3 py-2 font-medium">D-day</th>
              <th className="text-right px-3 py-2 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => {
              const f = flagsMap.get(w.id) || { initial: false, followup: false, regular: false, general: false };
              return (
                <tr key={w.id} className={`border-t border-slate-100 hover:bg-slate-50 ${selected.has(w.id) ? "bg-brand-50/50" : ""}`}>
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" checked={selected.has(w.id)} onChange={() => toggleOne(w.id)} />
                  </td>
                  <td className="px-3 py-2">
                    <Link href={`/workers/${w.id}`} className="text-brand-600 hover:underline font-medium">
                      {w.name}
                    </Link>
                    {w.nationality && w.nationality !== "한국" && (
                      <span className="ml-2 text-xs text-slate-400" title={w.nationality}>외</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{w.department_name || "-"}</td>
                  <td className="px-3 py-2 text-slate-600">{w.position || "-"}</td>
                  <td className="px-3 py-2 text-slate-600 text-xs">{w.hire_date || "-"}</td>
                  <td className="px-3 py-2"><StageBadges w={w} f={f} /></td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      w.requires_special === false ? "bg-sky-100 text-sky-700" :
                      w.cycle_months === 6 ? "bg-red-100 text-red-700" :
                      w.cycle_months === 24 ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {w.requires_special === false ? "일반" : `${w.cycle_months}개월`}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-600">{w.last_exam_date || "-"}</td>
                  <td className="px-3 py-2">{w.next_due_date || "-"}</td>
                  <td className={`px-3 py-2 text-right font-mono ${
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
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <button
                      onClick={() => deactivate(w)}
                      disabled={deleting === w.id}
                      className="text-xs text-slate-500 hover:text-slate-900 mr-2 disabled:opacity-50"
                    >퇴직</button>
                    <button
                      onClick={() => deleteWorker(w)}
                      disabled={deleting === w.id}
                      className="text-xs text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
                    >{deleting === w.id ? "삭제중..." : "삭제"}</button>
                  </td>
                </tr>
              );
            })}
            {!loading && workers.length === 0 && (
              <tr><td colSpan={11} className="text-center py-8 text-slate-400">데이터 없음</td></tr>
            )}
            {loading && workers.length === 0 && (
              <tr><td colSpan={11} className="text-center py-8 text-slate-400">불러오는 중...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-500 space-y-1">
        <div>💡 <strong>검진 진행 컬럼 보는 법</strong>:</div>
        <div className="ml-4 flex items-center gap-2 flex-wrap">
          <span>완료:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-500 text-white"><span>✓</span><span>배치전</span></span>
          <span className="mx-2">/</span>
          <span>미실시:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-500 text-white"><span>✗</span><span>배치전</span></span>
        </div>
        <div className="ml-4">• 정기 특수 수검 중인 사람은 배치전·배치후 자동으로 완료 처리됨</div>
        <div className="ml-4">• 사무직/출하는 일반검진 받았는지 하나만 표시</div>
      </div>
    </div>
  );
}