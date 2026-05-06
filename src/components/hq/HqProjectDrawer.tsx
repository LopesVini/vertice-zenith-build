import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Flag, Bell, Plus, Trash2, Loader2, CheckCircle2, Circle, Clock,
  ChevronDown, Send, Lock,
} from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/hooks/useProjects";
import { useMilestones } from "@/hooks/useMilestones";
import type { Milestone } from "@/hooks/useMilestones";
import { useUpdates } from "@/hooks/useUpdates";
import type { Update } from "@/hooks/useUpdates";

// ── Helpers ───────────────────────────────────────────────────────────────────

const isSeed = (id: string) => id.startsWith("seed-");

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
}

const MILESTONE_STATUS: Milestone["status"][] = ["done", "active", "pending"];
const MILESTONE_STATUS_LABELS: Record<Milestone["status"], string> = {
  done:    "Concluído",
  active:  "Em Andamento",
  pending: "Pendente",
};
const MILESTONE_STATUS_COLORS: Record<Milestone["status"], string> = {
  done:    "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10",
  active:  "text-blue-600  dark:text-blue-400  bg-blue-50  dark:bg-blue-500/10",
  pending: "text-zinc-500  dark:text-zinc-400  bg-zinc-100 dark:bg-white/5",
};
const MILESTONE_ICONS: Record<Milestone["status"], typeof CheckCircle2> = {
  done:    CheckCircle2,
  active:  Clock,
  pending: Circle,
};

const UPDATE_COLORS: { label: string; value: string; cls: string }[] = [
  { label: "Aprovado",       value: "bg-green-500", cls: "text-green-600 dark:text-green-400 border-green-500/30 bg-green-50 dark:bg-green-500/10" },
  { label: "Ação Requerida", value: "bg-accent",    cls: "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-50  dark:bg-amber-500/10"  },
  { label: "Em Revisão",     value: "bg-blue-500",  cls: "text-blue-600  dark:text-blue-400  border-blue-500/30  bg-blue-50   dark:bg-blue-500/10"   },
];

// ── Milestones Tab ────────────────────────────────────────────────────────────

function MilestonesTab({ projectId }: { projectId: string }) {
  const { milestones, loading, saveMilestone, updateMilestone } = useMilestones(projectId);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", date: "", status: "pending" as Milestone["status"] });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Informe o nome do marco."); return; }
    setSaving(true);
    const { error } = await saveMilestone({
      project_id: projectId,
      name:       form.name.trim(),
      status:     form.status,
      date:       form.date || null,
      sort_order: milestones.length,
    });
    setSaving(false);
    if (error) { toast.error("Erro ao salvar marco."); return; }
    toast.success("Marco adicionado.");
    setForm({ name: "", date: "", status: "pending" });
    setShowForm(false);
  }

  async function cycleStatus(m: Milestone) {
    const idx = MILESTONE_STATUS.indexOf(m.status);
    const next = MILESTONE_STATUS[(idx + 1) % MILESTONE_STATUS.length];
    const { error } = await updateMilestone(m.id, { status: next });
    if (error) toast.error("Erro ao atualizar marco.");
  }

  return (
    <div className="flex flex-col gap-4">
      {loading && (
        <div className="flex items-center justify-center py-10 gap-2 text-zinc-400">
          <Loader2 size={16} className="animate-spin" /> Carregando marcos...
        </div>
      )}

      {!loading && milestones.length === 0 && !showForm && (
        <div className="text-center py-10 text-zinc-400">
          <Flag size={32} className="mx-auto mb-2 opacity-20" />
          <p className="text-sm">Nenhum marco adicionado ainda.</p>
        </div>
      )}

      {!loading && milestones.length > 0 && (
        <div className="relative border-l-2 border-zinc-200 dark:border-white/10 ml-3 space-y-4">
          {milestones.map(m => {
            const Icon = MILESTONE_ICONS[m.status];
            return (
              <div key={m.id} className="relative pl-6">
                <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center
                  ${m.status === "done" ? "bg-green-500" : m.status === "active" ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"}`}>
                  <Icon size={9} className="text-white" strokeWidth={3} />
                </div>
                <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-3 group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-navy dark:text-white leading-tight">{m.name}</p>
                      {m.date && <p className="text-[11px] text-zinc-500 mt-0.5">{fmtDate(m.date)}</p>}
                    </div>
                    <button
                      onClick={() => cycleStatus(m)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 transition-colors ${MILESTONE_STATUS_COLORS[m.status]}`}
                    >
                      {MILESTONE_STATUS_LABELS[m.status]}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-4 space-y-3 overflow-hidden"
          >
            <p className="text-xs font-bold text-navy dark:text-white">Novo Marco</p>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="ex: Anteprojeto aprovado"
              className="w-full bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-navy dark:text-white focus:outline-none focus:border-blue-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-navy dark:text-white focus:outline-none focus:border-blue-500"
              />
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as Milestone["status"] }))}
                className="bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-navy dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="pending">Pendente</option>
                <option value="active">Em Andamento</option>
                <option value="done">Concluído</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="text-xs font-bold text-zinc-500 px-3 py-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-60">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                Salvar Marco
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors py-2 px-3 rounded-xl border border-dashed border-blue-300 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10"
        >
          <Plus size={13} /> Adicionar Marco
        </button>
      )}
    </div>
  );
}

// ── Updates Tab ───────────────────────────────────────────────────────────────

function UpdatesTab({ projectId, authorName }: { projectId: string; authorName: string }) {
  const { updates, loading, saveUpdate, deleteUpdate } = useUpdates(projectId);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", color: "bg-green-500" });
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (showForm && textRef.current) textRef.current.focus(); }, [showForm]);

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Informe o título da atualização."); return; }
    setSaving(true);
    const { error } = await saveUpdate({
      project_id:  projectId,
      title:       form.title.trim(),
      content:     form.content.trim() || null,
      author_name: authorName,
      color:       form.color,
    });
    setSaving(false);
    if (error) { toast.error("Erro ao publicar atualização."); return; }
    toast.success("Atualização publicada.");
    setForm({ title: "", content: "", color: "bg-green-500" });
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const { error } = await deleteUpdate(id);
    setDeleting(null);
    if (error) toast.error("Erro ao remover atualização.");
    else toast.success("Atualização removida.");
  }

  const selectedColor = UPDATE_COLORS.find(c => c.value === form.color) ?? UPDATE_COLORS[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Post Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handlePost}
            className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-4 space-y-3 overflow-hidden"
          >
            <p className="text-xs font-bold text-navy dark:text-white">Nova Atualização</p>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Título da entrega / atualização"
              className="w-full bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-navy dark:text-white focus:outline-none focus:border-blue-500"
            />
            <textarea
              ref={textRef}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={3}
              placeholder="Descreva a entrega (opcional)..."
              className="w-full bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-navy dark:text-white focus:outline-none focus:border-blue-500 resize-none"
            />
            {/* Status selector */}
            <div className="flex gap-2">
              {UPDATE_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color: c.value }))}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${c.cls} ${form.color === c.value ? "ring-2 ring-offset-1 ring-blue-500" : "opacity-60 hover:opacity-100"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="text-xs font-bold text-zinc-500 px-3 py-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-60">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                Publicar
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors py-2 px-3 rounded-xl border border-dashed border-blue-300 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10"
        >
          <Plus size={13} /> Nova Atualização
        </button>
      )}

      {/* List */}
      {loading && (
        <div className="flex items-center justify-center py-10 gap-2 text-zinc-400">
          <Loader2 size={16} className="animate-spin" /> Carregando atualizações...
        </div>
      )}

      {!loading && updates.length === 0 && (
        <div className="text-center py-10 text-zinc-400">
          <Bell size={32} className="mx-auto mb-2 opacity-20" />
          <p className="text-sm">Nenhuma atualização publicada ainda.</p>
        </div>
      )}

      {!loading && updates.length > 0 && (
        <div className="space-y-3">
          {updates.map(u => {
            const colorInfo = UPDATE_COLORS.find(c => c.value === u.color) ?? UPDATE_COLORS[2];
            return (
              <div key={u.id} className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-4 group">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-navy dark:text-white">{u.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorInfo.cls}`}>
                      {colorInfo.label}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(u.id)}
                    disabled={deleting === u.id}
                    className="text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 disabled:opacity-40"
                  >
                    {deleting === u.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
                {u.content && <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{u.content}</p>}
                <p className="text-[10px] text-zinc-400 mt-2">{fmtDate(u.created_at)} · {u.author_name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Drawer ────────────────────────────────────────────────────────────────────

interface Props {
  project: Project | null;
  onClose: () => void;
}

const TABS = [
  { id: "milestones", label: "Marcos",        icon: Flag },
  { id: "updates",    label: "Atualizações",  icon: Bell },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function HqProjectDrawer({ project, onClose }: Props) {
  const [tab, setTab] = useState<TabId>("milestones");
  const seed = project ? isSeed(project.id) : false;

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white dark:bg-[#0f172a] border-l border-zinc-200 dark:border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-zinc-200 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl ${project.color} flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0`}>
                  {project.name[0]}
                </div>
                <div className="min-w-0">
                  <h2 className="font-black text-navy dark:text-white text-base leading-tight truncate">{project.name}</h2>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {project.client?.display_name ?? "Sem cliente"} · {project.progress}% concluído
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-navy dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors shrink-0 ml-2">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-white/10 shrink-0 px-2">
              {TABS.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-colors border-b-2 -mb-px ${
                      tab === t.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-zinc-500 hover:text-navy dark:hover:text-white"
                    }`}
                  >
                    <Icon size={13} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {seed ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-zinc-400">
                  <Lock size={36} className="opacity-20" />
                  <p className="text-sm font-bold text-navy dark:text-zinc-300">Projeto de exemplo</p>
                  <p className="text-xs max-w-[240px]">
                    Crie um projeto real vinculado a um cliente para gerenciar marcos e atualizações.
                  </p>
                </div>
              ) : tab === "milestones" ? (
                <MilestonesTab projectId={project.id} />
              ) : (
                <UpdatesTab projectId={project.id} authorName="Admin" />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
