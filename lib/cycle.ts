// 6개월 주기 유해인자 (카테고리 1-3)
export const SHORT_CYCLE_KEYS = [
  "N,N-디메틸아세트아미드",
  "디메틸포름아미드",
  "벤젠",
  "1,1,2,2-테트라클로로에탄",
  "사염화탄소",
  "아크릴로니트릴",
  "염화비닐",
];

// 24개월 주기 유해인자 (단독 노출시)
export const LONG_CYCLE_KEYS = ["광물성분진", "목재분진", "소음", "충격소음"];

const NON_SPECIAL_TAGS = ["(일)", "(야)", "(기)"];

/**
 * 유해인자 텍스트 → 주기 개월 자동 계산
 * - 6개월: 카테고리 1-3 (벤젠, 사염화탄소 등)
 * - 24개월: 광물성분진/목재분진/소음만 단독 노출
 * - 12개월: 그 외
 * - null: 일반/기타만 있을 때
 */
export function calcCycle(factorsRaw: string | null | undefined): number | null {
  if (!factorsRaw) return null;

  for (const key of SHORT_CYCLE_KEYS) {
    if (factorsRaw.includes(key)) return 6;
  }

  const parts = factorsRaw.split("+").map((p) => p.trim());
  const specialParts: string[] = [];
  for (const p of parts) {
    if (NON_SPECIAL_TAGS.some((tag) => p.includes(tag))) continue;
    const clean = p.replace(/\([^)]*\)/g, "").trim();
    if (clean) specialParts.push(clean);
  }

  if (specialParts.length === 0) return null;

  const allLong = specialParts.every((sp) =>
    LONG_CYCLE_KEYS.some((lk) => sp.includes(lk))
  );
  if (allLong) return 24;

  return 12;
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toISOString().slice(0, 10);
}

export function formatKDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}
