"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { calcCycle } from "@/lib/cycle";

export default function NewExamForm({
  workers,
  initialWorkerId,
}: {
  workers: any[];
  initialWorkerId?: string;
}) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    worker_id: initialWorkerId || "",
    exam_date: today,
    exam_form: "내원검진",
    exam_kind: "특수검진",
    exam_category: "일반+특수",
    factors_raw: "",
    notes: "",
    update_worker_cycle: true,
  });
  const [saving, setSaving] = useState(false);

  const computedCycle = useMemo(() => calcCycle(form.factors_raw), [form.factors_raw]);

  async function save() {
    if (!form.worker_id) {
      alert("근로자를 선택하세요");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("examinations").insert({
      worker_id: form.worker_id,
      exam_date: form.exam_date,
      exam_form: form.exam_form,
      exam_kind: form.exam_kind,
      exam_category: form.exam_category,
      factors_raw: form.factors_raw || null,
      cycle_months: computedCycle,
      notes: form.notes || null,
    });

    if (error) {
      setSaving(false);
      alert("저장 실패: " + error.message);
      return;
    }

    // 근로자 주기 자동 업데이트 (locked가 아니고 특수 계열이면)
    if (form.update_worker_cycle && computedCycle) {
      const { data: w } = await supabase
        .from("workers")
        .select("cycle_locked")
        .eq("id", form.worker_id)
        .single();
      if (w && !w.cycle_locked) {
        await supabase
          .from("workers")
          .update({ cycle_months: computedCycle })
          .eq("id", form.worker_id);
      }
    }

    setSaving(false);
    router.push(`/workers/${form.worker_id}`);
    router.refresh();
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-slate-500">근로자</span>
          <select
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md"
            value={form.worker_id}
            onChange={(e) => setForm({ ...form, worker_id: e.target.value })}
          >
            <option value="">선택...</option>
            {workers.map((w: any) => (
              <option key={w.id} value={w.id}>
                {w.name} {w.departments?.name ? `(${w.departments.name})` : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-slate-500">검진일</span>
          <input
            type="date"
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md"
            value={form.exam_date}
            onChange={(e) => setForm({ ...form, exam_date: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-500">검진 형태</span>
          <select
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md"
            value={form.exam_form}
            onChange={(e) => setForm({ ...form, exam_form: e.target.value })}
          >
            <option>내원검진</option>
            <option>출장검진</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-slate-500">검진 종류</span>
          <select
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md"
            value={form.exam_kind}
            onChange={(e) => setForm({ ...form, exam_kind: e.target.value })}
          >
            <option>특수검진</option>
            <option>일반검진</option>
            <option>배치전검진</option>
            <option>배치후검진</option>
            <option>기타검진</option>
          </select>
        </label>

        <label className="block col-span-2">
          <span className="text-sm text-slate-500">검진 구분</span>
          <select
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md"
            value={form.exam_category}
            onChange={(e) => setForm({ ...form, exam_category: e.target.value })}
          >
            <option>일반+특수</option>
            <option>특수</option>
            <option>일반</option>
            <option>배치전</option>
            <option>배치후</option>
            <option>기타</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-slate-500">유해인자 (자동 주기 계산용, +로 구분)</span>
        <textarea
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-xs"
          rows={4}
          placeholder="예: 일반검진(일)+소음(특)+톨루엔(특)"
          value={form.factors_raw}
          onChange={(e) => setForm({ ...form, factors_raw: e.target.value })}
        />
        {computedCycle !== null && (
          <div className="mt-2 text-sm">
            계산된 주기:
            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
              computedCycle === 6 ? "bg-red-100 text-red-700" :
              computedCycle === 24 ? "bg-blue-100 text-blue-700" :
              "bg-slate-100 text-slate-700"
            }`}>
              {computedCycle}개월
            </span>
          </div>
        )}
        {form.factors_raw && computedCycle === null && (
          <div className="mt-2 text-xs text-slate-400">
            특수 유해인자 없음 (일반검진 기록)
          </div>
        )}
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.update_worker_cycle}
          onChange={(e) => setForm({ ...form, update_worker_cycle: e.target.checked })}
        />
        근로자 주기도 이 값으로 업데이트 (수동 고정 안 된 경우)
      </label>

      <label className="block">
        <span className="text-sm text-slate-500">메모</span>
        <textarea
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </label>

      <button
        onClick={save}
        disabled={saving}
        className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md disabled:opacity-50 w-full font-medium"
      >
        {saving ? "저장중..." : "저장"}
      </button>
    </div>
  );
}
