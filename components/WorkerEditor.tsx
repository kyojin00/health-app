"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function WorkerEditor({
  worker,
  departments,
}: {
  worker: any;
  departments: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: worker.name,
    department_id: worker.department_id || "",
    is_foreign: worker.is_foreign,
    cycle_months: worker.cycle_months,
    cycle_locked: worker.cycle_locked,
    notes: worker.notes || "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("workers")
      .update({
        name: form.name,
        department_id: form.department_id || null,
        is_foreign: form.is_foreign,
        cycle_months: Number(form.cycle_months),
        cycle_locked: form.cycle_locked,
        notes: form.notes,
      })
      .eq("id", worker.id);
    setSaving(false);
    if (error) {
      alert("저장 실패: " + error.message);
      return;
    }
    setEditing(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`${worker.name}을(를) 삭제할까요? (검진 기록도 함께 삭제됩니다)`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("workers").delete().eq("id", worker.id);
    if (error) {
      alert("삭제 실패: " + error.message);
      return;
    }
    router.push("/workers");
  }

  if (!editing) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-slate-500">주기</div>
          <div className="font-medium">{worker.cycle_months}개월 {worker.cycle_locked && "(수동)"}</div>
        </div>
        <div>
          <div className="text-slate-500">마지막 검진</div>
          <div className="font-medium">{worker.last_exam_date || "-"}</div>
        </div>
        <div>
          <div className="text-slate-500">마지막 구분</div>
          <div className="font-medium">{worker.last_category || "-"}</div>
        </div>
        <div className="md:col-start-4 flex gap-2 justify-end">
          <button onClick={() => setEditing(true)} className="text-brand-600 hover:underline text-sm">
            수정
          </button>
          <button onClick={remove} className="text-red-600 hover:underline text-sm">
            삭제
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-slate-500">이름</span>
          <input
            className="mt-1 w-full px-3 py-1.5 border border-slate-300 rounded-md"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-slate-500">부서</span>
          <select
            className="mt-1 w-full px-3 py-1.5 border border-slate-300 rounded-md"
            value={form.department_id}
            onChange={(e) => setForm({ ...form, department_id: e.target.value })}
          >
            <option value="">없음</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-slate-500">주기 (개월)</span>
          <select
            className="mt-1 w-full px-3 py-1.5 border border-slate-300 rounded-md"
            value={form.cycle_months}
            onChange={(e) => setForm({ ...form, cycle_months: Number(e.target.value) })}
          >
            <option value={6}>6개월</option>
            <option value={12}>12개월 (1년)</option>
            <option value={24}>24개월 (2년)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            checked={form.cycle_locked}
            onChange={(e) => setForm({ ...form, cycle_locked: e.target.checked })}
          />
          <span className="text-slate-700">주기 수동 고정</span>
        </label>
      </div>
      <label className="block">
        <span className="text-slate-500">메모</span>
        <textarea
          className="mt-1 w-full px-3 py-1.5 border border-slate-300 rounded-md"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </label>
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-md disabled:opacity-50"
        >
          {saving ? "저장중..." : "저장"}
        </button>
        <button onClick={() => setEditing(false)} className="px-4 py-1.5 rounded-md border border-slate-300">
          취소
        </button>
      </div>
    </div>
  );
}
