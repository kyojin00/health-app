import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { from?: string; error?: string };
}) {
  if (await isAuthed()) redirect("/");
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          <h1 className="text-xl font-semibold mb-1">특수건강진단 관리</h1>
          <p className="text-sm text-slate-500 mb-6">비밀번호를 입력하세요</p>
          <LoginForm from={searchParams.from} error={searchParams.error} />
        </div>
      </div>
    </div>
  );
}
