import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xqagqxntyppsyfdyebym.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxYWdxeG50eXBwc3lmZHllYnltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTUyMzU0NCwiZXhwIjoyMDkxMDk5NTQ0fQ.jrMPBcP2e6nz1mUdnMWdJA96A_Y-CB7b0jhMnIoHqhU";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log("Buscando usuários existentes...");
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) { console.error("Erro ao listar usuários:", error); process.exit(1); }

  const users = data.users;
  console.log(`Encontrados ${users.length} usuário(s).`);

  for (const user of users) {
    const role =
      user.email?.includes("@vertice") || user.email?.includes("admin")
        ? "admin"
        : "client";
    const display_name =
      user.user_metadata?.display_name ||
      user.email?.split("@")[0] ||
      "Usuário";

    const { error: upsertError } = await supabase.from("profiles").upsert(
      { id: user.id, display_name, email: user.email, role },
      { onConflict: "id" }
    );

    if (upsertError) {
      console.error(`Erro ao inserir ${user.email}:`, upsertError.message);
    } else {
      console.log(`✓ ${user.email} → role: ${role}`);
    }
  }

  console.log("\nBackfill concluído.");
}

run();
