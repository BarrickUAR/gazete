// Yerel uçtan uca test için geçici ekip hesabı oluşturur/sıfırlar. Kimlik bilgileri yalnız .env.local'a yazılır.
// Kullanım: npm run test-user -- admin|editor|author   ·   Silmek için: npm run test-user -- sil
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const role = process.argv[2] ?? "admin";
const email = `e2e-${role === "sil" ? "admin" : role}@cetinercetin.test`;

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const { data } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
  const found = data?.users.filter((u) => u.email?.startsWith("e2e-") && u.email.endsWith("@cetinercetin.test")) ?? [];
  if (role === "sil") {
    for (const u of found) await db.auth.admin.deleteUser(u.id);
    console.log(`✓ ${found.length} test hesabı silindi`);
    return;
  }
  const password = randomBytes(18).toString("base64url");
  const existing = found.find((u) => u.email === email);
  const user = existing
    ? (await db.auth.admin.updateUserById(existing.id, { password, app_metadata: { role } })).data.user
    : (await db.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { role }, user_metadata: { display_name: `Test ${role}` } })).data.user;
  if (!user) throw new Error("oluşturulamadı");
  await db.from("profiles").upsert({ id: user.id, email, display_name: `Test ${role}`, role }, { onConflict: "id" });
  const key = `E2E_${role.toUpperCase()}`;
  const kept = readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => !l.startsWith(`${key}_`)).join("\n");
  writeFileSync(".env.local", kept.replace(/\n*$/, "\n"));
  appendFileSync(".env.local", `${key}_EMAIL=${email}\n${key}_PASSWORD=${password}\n`);
  console.log(`✓ ${email} (${role}) hazır; parola .env.local içinde ${key}_PASSWORD`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
