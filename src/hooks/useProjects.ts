import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { SEED_PROJECTS } from "@/data/seedData";

export interface Project {
  id: string;
  name: string;
  client_id: string | null;
  type: string;
  status: "Em Andamento" | "Revisão" | "Concluído" | "Pausado";
  progress: number;
  priority: "Alta" | "Média" | "Baixa";
  color: string;
  team: string[];
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  created_at: string;
  // joined
  client?: { display_name: string; email: string } | null;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*, client:profiles!projects_client_id_fkey(display_name,email)")
      .order("created_at", { ascending: false });
    const real = (data as Project[]) || [];
    // Seed projects appear after real ones; hidden if a real project has same name
    const realNames = new Set(real.map(p => p.name.toLowerCase()));
    const seeds = SEED_PROJECTS.filter(s => !realNames.has(s.name.toLowerCase()));
    setProjects([...real, ...seeds]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  async function saveProject(p: Omit<Project, "id" | "created_at" | "client">) {
    const { data, error } = await supabase.from("projects").insert(p).select().single();
    if (!error && data) setProjects((prev) => [data as Project, ...prev]);
    return { error };
  }

  async function updateProject(id: string, changes: Partial<Project>) {
    const { error } = await supabase.from("projects").update(changes).eq("id", id);
    if (!error) setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
    return { error };
  }

  async function deleteProject(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) setProjects((prev) => prev.filter((p) => p.id !== id));
    return { error };
  }

  return { projects, loading, refetch: fetch, saveProject, updateProject, deleteProject };
}
