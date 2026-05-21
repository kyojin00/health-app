import { createClient } from "@/lib/supabase-server";
import NewWorkerForm from "@/components/NewWorkerForm";

export default async function NewWorkerPage() {
  const supabase = createClient();
  const { data: depts } = await supabase.from("departments").select("*").order("name");
  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">근로자 추가</h1>
      <NewWorkerForm departments={depts || []} />
    </div>
  );
}
