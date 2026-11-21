// Kullanıcıya rol verir (app_metadata.role + profiles.role). Yalnız sunucu anahtarıyla, yerelden.
// Kullanım: npm run role -- kisi@ornek.com admin|editor|author|subscriber
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const [email, role] = process.argv.slice(2);
const ROLES = ["admin", "editor", "author", "subscriber"];
if (!email || !ROLES.includes(role)) {
  console.error("Kullanım: npm run role -- <e-posta> <admin|editor|author|subscriber>");
  process.exit(1);
}

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  let page = 1;
  for (;;) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const u = data.users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
    if (u) {
      const { error: e1 } = await db.auth.admin.updateUserById(u.id, { app_metadata: { ...u.app_metadata, role } });
      if (e1) throw e1;
      const { error: e2 } = await db.from("profiles").upsert({ id: u.id, email: u.email!, role }, { onConflict: "id" });
      if (e2) throw e2;
      await db.from("audit_log").insert({ actor: null, action: "user.role", entity: "profiles", entity_id: u.id, meta: { role, via: "cli" } });
      console.log(`✓ ${email} → ${role}. Kullanıcı çıkış yapıp tekrar girince geçerli olur.`);
      return;
    }
    if (data.users.length < 200) break;
    page++;
  }
  console.error(`Kullanıcı bulunamadı: ${email}. Önce siteden kayıt olmalı (/kayit).`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
