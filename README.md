# 특수건강진단 관리 시스템

근로자 특수건강진단 일정 관리 - Next.js 14 + Supabase

## 주요 기능

- 🔒 비밀번호 한 개로 보호 (개인 사용)
- 📋 근로자 / 검진 기록 관리
- ⚙️ **주기 자동 계산** - 유해인자 입력만 하면 6/12/24개월 자동 판별
  - 6개월: 벤젠, 사염화탄소, 아크릴로니트릴, 염화비닐, 디메틸포름아미드 등 (산안법 카테고리 1-3)
  - 12개월: 일반 유해인자 (기본)
  - 24개월: 광물성분진, 목재분진, 소음, 충격소음 단독 노출 (카테고리 5)
- 📅 캘린더 뷰 - 월별 검진 예정 한눈에
- 🚨 대시보드 - 지난 미수검 / 30일 이내 / 90일 이내 알림
- 📝 검진 이력 히스토리 - 근로자별 모든 기록 추적

## 1. Supabase 세팅

1. https://supabase.com 에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. 같은 SQL Editor에서 `supabase/seed.sql` 실행 (초기 67명 + 108건 검진 기록 입력)
4. Project Settings → API 에서 URL과 anon key 복사

## 2. 환경변수

`.env.local.example`을 `.env.local`로 복사 후 채우기:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SITE_PASSWORD=원하는비밀번호
SESSION_SECRET=아무거나_긴_랜덤_문자열
```

## 3. 실행

```bash
npm install
npm run dev
```

http://localhost:3000 접속 → 비밀번호 입력

## 4. 배포 (Vercel)

```bash
npm i -g vercel
vercel
```

환경변수 4개(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SITE_PASSWORD`, `SESSION_SECRET`)를 Vercel 대시보드에 등록하면 됩니다.

## 디렉토리 구조

```
app/
├── (app)/              # 인증 필요 페이지
│   ├── page.tsx        # 대시보드
│   ├── workers/        # 근로자 관리
│   ├── examinations/   # 검진 기록
│   └── calendar/       # 캘린더 뷰
├── login/              # 로그인
├── api/auth/           # 로그인/로그아웃 API
└── layout.tsx
components/             # UI 컴포넌트
lib/
├── cycle.ts            # 유해인자 → 주기 계산 로직
├── auth.ts             # 비밀번호 인증
├── token.ts            # 토큰 생성 (Web Crypto)
└── supabase-*.ts       # Supabase 클라이언트
middleware.ts           # 라우트 보호
supabase/
├── schema.sql          # DB 스키마
└── seed.sql            # 초기 데이터 (67명 + 108건)
```

## 주기 계산 로직 (lib/cycle.ts)

검진 기록 추가시 "유해인자" 필드에 산안법 기준으로 입력하면 자동 계산:

- `벤젠(특)+톨루엔(특)` → 6개월 (벤젠 포함)
- `일반검진(일)+소음(특)+톨루엔(특)` → 12개월 (소음 외 다른 인자 있음)
- `소음(특)` 단독 → 24개월
- `일반검진(일)` 만 → null (일반검진은 주기 계산 안 함)

근로자 페이지에서 "주기 수동 고정"에 체크하면 자동 계산 무시하고 수동값 유지.

## 데이터베이스 뷰

`worker_status` 뷰가 각 근로자의 마지막 특수검진 일자 + 주기로 다음 예정일을 자동 계산합니다.
