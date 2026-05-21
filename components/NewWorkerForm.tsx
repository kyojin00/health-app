"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function NewWorkerForm({ departments }: { departments: any[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    department_id: "",
    is_foreign: false,
    cycle_months: 12,
    notes: "",
  });
  const [newDept, setNewDept] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.name.trim()) {
      alert("이름을 입력하세요");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    let deptId = form.department_id ? Number(form.department_id) : null;
    if (newDept.trim()) {
      const { data: d } = await supabase
        .from("departments")
        .insert({ name: newDept.trim() })
        .select()
        .single();
      if (d) deptId = d.id;
    }
    const { data, error } = await supabase
      .from("workers")
      .insert({
        name: form.name.trim(),
        department_id: deptId,
        is_foreign: form.is_foreign,
        cycle_months: form.cycle_months,
        notes: form.notes || null,
      })
      .select()
      .single();
    setSaving(false);
    if (error) {
      alert("저장 실패: " + error.message);
      return;
    }
    router.push(`/workers/${data!.id}`);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
      <label className="block">
        <span className="text-sm text-slate-500">이름</span>
        <input
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          autoFocus
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-500">부서</span>
        <select
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md"
          value={form.department_id}
          onChange={(e) => setForm({ ...form, department_id: e.target.value })}
        >
          <option value="">선택 없음</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <input
          className="mt-2 w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm"
          placeholder="또는 새 부서명 입력 후 저장"
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-500">초기 주기</span>
        <select
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md"
          value={form.cycle_months}
          onChange={(e) => setForm({ ...form, cycle_months: Number(e.target.value) })}
        >
          <option value={6}>6개월</option>
          <option value={12}>12개월 (1년)</option>
          <option value={24}>24개월</option>
        </select>
        <span className="text-xs text-slate-400 mt-1 block">
          검진 등록시 유해인자에 따라 자동 조정됩니다
        </span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_foreign}
          onChange={(e) => setForm({ ...form, is_foreign: e.target.checked })}
        />
        <span className="text-sm">외국인 근로자</span>
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
