import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  status: "done" | "active" | "pending";
  date: string | null;
  sort_order: number;
}

export function useMilestones(projectId: string | null | undefined) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!projectId) { setLoading(false); return; }
    const { data } = await supabase
      .from("milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    setMilestones((data as Milestone[]) || []);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetch(); }, [fetch]);

  async function saveMilestone(m: Omit<Milestone, "id">) {
    const { data, error } = await supabase.from("milestones").insert(m).select().single();
    if (!error && data) setMilestones((prev) => [...prev, data as Milestone].sort((a, b) => a.sort_order - b.sort_order));
    return { error };
  }

  async function updateMilestone(id: string, changes: Partial<Milestone>) {
    const { error } = await supabase.from("milestones").update(changes).eq("id", id);
    if (!error) setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, ...changes } : m)));
    return { error };
  }

  return { milestones, loading, refetch: fetch, saveMilestone, updateMilestone };
}
