import { createClient } from "@/lib/supabase-server";
import NewExamForm from "@/components/NewExamForm";

export default async function NewExamPage({
  searchParams,
}: {
  searchParams: { worker_id?: string };
}) {
  const supabase = createClient();
  const { data: workers } = await supabase
    .from("workers")
    .select("id, name, departments(name)")
    .eq("active", true)
    .order("name");
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">검진 기록 추가</h1>
      <NewExamForm workers={workers || []} initialWorkerId={searchParams.worker_id} />
    </div>
  );
}
