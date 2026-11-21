-- Çetiner Çetin — veritabanı şeması (Supabase Postgres). Tek dosya, idempotent:
-- SQL Editor'e yapıştır → Run. Ardından başlangıç verisi: npm run seed (service_role ile REST üzerinden).
-- Tüm tablolarda RLS açık ve FORCE. Yazma işlemleri sunucu (service_role) ya da personel rolleriyle.

create extension if not exists pg_trgm;

-- ───────────────────────── Yetki yardımcıları ─────────────────────────
-- Rol, JWT app_metadata.role içinde (yalnızca sunucu/service_role yazar).
create or replace function public.app_role() returns text
language sql stable as $$ select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'anon') $$;

create or replace function public.is_staff() returns boolean
language sql stable as $$ select public.app_role() in ('admin', 'editor', 'author') $$;

create or replace function public.is_editor() returns boolean
language sql stable as $$ select public.app_role() in ('admin', 'editor') $$;

create or replace function public.is_admin() returns boolean
language sql stable as $$ select public.app_role() = 'admin' $$;

-- ───────────────────────── Tablolar ─────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'subscriber' check (role in ('admin', 'editor', 'author', 'subscriber')),
  locale text not null default 'tr' check (locale in ('tr', 'en', 'ar')),
  created_at timestamptz not null default now()
);

create table if not exists public.authors (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  role jsonb not null default '{}'::jsonb,       -- {tr, en, ar}
  avatar text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key default gen_random_uuid()::text,
  theme text not null default 'default' check (theme in ('default', 'foreign')),
  sort int not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.category_translations (
  category_id text not null references public.categories (id) on delete cascade,
  locale text not null check (locale in ('tr', 'en', 'ar')),
  slug text not null,
  name text not null,
  primary key (category_id, locale),
  unique (locale, slug)
);

create table if not exists public.tags (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  name jsonb not null default '{}'::jsonb          -- {tr, en, ar}
);

create table if not exists public.media (
  id text primary key default gen_random_uuid()::text,
  url text not null,
  alt text not null default '',
  caption text,
  credit text,
  width int,
  height int,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id text primary key default gen_random_uuid()::text,
  type text not null check (type in ('haber', 'kose', 'rapor')),
  status text not null default 'draft' check (status in ('draft', 'review', 'scheduled', 'published', 'archived')),
  category_id text not null references public.categories (id),
  author_id text not null references public.authors (id),
  cover_id text references public.media (id) on delete set null,
  is_premium boolean not null default false,
  publish_at timestamptz,                -- zamanlanmış yayın anı
  published_at timestamptz,              -- gerçek yayın anı (sıralama/arşiv)
  read_min int not null default 5,
  source_url text,
  report_pdf text,
  review_note text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_translations (
  post_id text not null references public.posts (id) on delete cascade,
  locale text not null check (locale in ('tr', 'en', 'ar')),
  slug text not null,
  title text not null,
  dek text not null default '',
  kicker text,
  place text,
  body jsonb not null default '{"type":"doc","content":[]}'::jsonb,   -- herkese açık gövde (kilitli içerikte giriş)
  body_text text not null default '',                                  -- arama için düz metin
  seo_title text,
  seo_desc text,
  -- Dil ayarı sabit (literal) regconfig ile seçilir; metinden ::regconfig dönüşümü immutable değildir.
  search tsvector generated always as (
    case locale
      when 'tr' then setweight(to_tsvector('turkish'::regconfig, coalesce(title, '')), 'A') ||
      setweight(to_tsvector('turkish'::regconfig, coalesce(dek, '') || ' ' || coalesce(body_text, '')), 'B')
      when 'en' then setweight(to_tsvector('english'::regconfig, coalesce(title, '')), 'A') ||
      setweight(to_tsvector('english'::regconfig, coalesce(dek, '') || ' ' || coalesce(body_text, '')), 'B')
      else setweight(to_tsvector('simple'::regconfig, coalesce(title, '')), 'A') ||
      setweight(to_tsvector('simple'::regconfig, coalesce(dek, '') || ' ' || coalesce(body_text, '')), 'B')
    end
  ) stored,
  primary key (post_id, locale),
  unique (locale, slug)
);

-- Kilitli gövde: anon/abone okuyamaz; sunucu abonelik kontrolünden sonra service_role ile okur.
create table if not exists public.post_premium (
  post_id text not null references public.posts (id) on delete cascade,
  locale text not null check (locale in ('tr', 'en', 'ar')),
  body jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  primary key (post_id, locale)
);

create table if not exists public.post_tags (
  post_id text not null references public.posts (id) on delete cascade,
  tag_id text not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

create table if not exists public.revisions (
  id bigint generated always as identity primary key,
  post_id text not null references public.posts (id) on delete cascade,
  snapshot jsonb not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor uuid,
  action text not null,
  entity text not null,
  entity_id text,
  meta jsonb not null default '{}'::jsonb,
  at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null check (provider in ('iyzico', 'paytr', 'manual')),
  plan text not null default 'monthly' check (plan in ('monthly', 'yearly')),
  status text not null check (status in ('pending', 'trialing', 'active', 'past_due', 'canceled', 'expired')),
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  provider_customer text,
  provider_ref text,
  card_token text,                       -- PayTR: saklanan kart token'ı (kart verisi DEĞİL)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id bigint generated always as identity primary key,
  provider text not null,
  event_key text not null unique,        -- idempotency
  payload jsonb not null,
  processed boolean not null default false,
  received_at timestamptz not null default now()
);

create table if not exists public.social_posts (
  id bigint generated always as identity primary key,
  post_id text not null references public.posts (id) on delete cascade,
  network text not null check (network in ('x', 'instagram')),
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'skipped')),
  message text not null default '',
  external_id text,
  error text,
  attempts int not null default 0,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (post_id, network)
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null
);

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('ihbar', 'basin', 'genel')),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter (
  email text primary key,
  locale text not null default 'tr',
  created_at timestamptz not null default now()
);

-- ───────────────────────── İndeksler ─────────────────────────
create index if not exists posts_feed_idx on public.posts (status, published_at desc);
create index if not exists posts_cat_idx on public.posts (category_id, published_at desc);
create index if not exists posts_type_idx on public.posts (type, published_at desc);
create index if not exists posts_sched_idx on public.posts (publish_at) where status = 'scheduled';
create index if not exists pt_search_idx on public.post_translations using gin (search);
create index if not exists pt_title_trgm_idx on public.post_translations using gin (title gin_trgm_ops);
create index if not exists post_tags_tag_idx on public.post_tags (tag_id);
create index if not exists subs_user_idx on public.subscriptions (user_id, status);
create index if not exists social_status_idx on public.social_posts (status, created_at);
create index if not exists revisions_post_idx on public.revisions (post_id, created_at desc);

-- ───────────────────────── Tetikleyiciler ─────────────────────────
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();
drop trigger if exists subs_touch on public.subscriptions;
create trigger subs_touch before update on public.subscriptions for each row execute function public.touch_updated_at();

-- Yayın yetkisi: yalnızca editör/admin (veya service_role) yayına alabilir ya da zamanlayabilir.
create or replace function public.guard_publish() returns trigger language plpgsql as $$
begin
  -- service_role (sunucu) ya da JWT'siz doğrudan veritabanı oturumu (SQL Editor, sahip) kısıtlanmaz;
  -- API üzerinden gelen her istek JWT taşır (anon dahil), bu yüzden bu yol dışarıdan açılamaz.
  if auth.role() = 'service_role' or auth.jwt() is null then
    if new.status = 'scheduled' then new.published_at := new.publish_at; end if;
    if new.status = 'published' and new.published_at is null then new.published_at := coalesce(new.publish_at, now()); end if;
    return new;
  end if;
  if new.status in ('published', 'scheduled', 'archived') and not public.is_editor() then
    if tg_op = 'INSERT' or old.status is distinct from new.status then
      raise exception 'Yayınlama yetkisi yok';
    end if;
  end if;
  -- Yazar yalnızca taslak/onay aşamasındaki kendi yazısını değiştirebilir
  if tg_op = 'UPDATE' and not public.is_editor() and old.status not in ('draft', 'review') then
    raise exception 'Yayındaki yazıyı yalnızca editör değiştirebilir';
  end if;
  if new.status = 'scheduled' then new.published_at := new.publish_at; end if;   -- sıralama/arşiv için
  if new.status = 'published' and new.published_at is null then new.published_at := coalesce(new.publish_at, now()); end if;
  return new;
end $$;

drop trigger if exists posts_guard on public.posts;
create trigger posts_guard before insert or update on public.posts for each row execute function public.guard_publish();

-- Yeni kullanıcı → profil
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name, locale)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
          coalesce(new.raw_user_meta_data ->> 'locale', 'tr'))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ───────────────────────── Görünürlük ─────────────────────────
-- Zamanlanmış yazı, yayın anı geldiğinde cron beklemeden görünür olur.
create or replace function public.post_is_public(p_status text, p_published_at timestamptz, p_publish_at timestamptz) returns boolean
language sql stable as $$
  select (p_status = 'published' and coalesce(p_published_at, now()) <= now())
      or (p_status = 'scheduled' and p_publish_at is not null and p_publish_at <= now())
$$;

-- Arşiv kovaları (yıl/ay → yazı sayısı), belirli dil için
create or replace function public.archive_buckets(p_locale text)
returns table (year int, month int, count bigint)
language sql stable as $$
  select extract(year from coalesce(p.published_at, p.publish_at) at time zone 'Europe/Istanbul')::int,
         extract(month from coalesce(p.published_at, p.publish_at) at time zone 'Europe/Istanbul')::int,
         count(*)
  from public.posts p
  join public.post_translations t on t.post_id = p.id and t.locale = p_locale
  where public.post_is_public(p.status, p.published_at, p.publish_at)
  group by 1, 2
  order by 1 desc, 2 desc
$$;

-- ───────────────────────── RLS ─────────────────────────
do $$
declare t text;
begin
  foreach t in array array['profiles','authors','categories','category_translations','tags','media','posts','post_translations',
    'post_premium','post_tags','revisions','audit_log','subscriptions','payment_events','social_posts','site_settings',
    'contact_messages','newsletter']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
  end loop;
end $$;

-- Herkese açık referans verileri
drop policy if exists read_all on public.authors;              create policy read_all on public.authors for select using (true);
drop policy if exists read_all on public.categories;           create policy read_all on public.categories for select using (true);
drop policy if exists read_all on public.category_translations;create policy read_all on public.category_translations for select using (true);
drop policy if exists read_all on public.tags;                 create policy read_all on public.tags for select using (true);
drop policy if exists read_all on public.media;                create policy read_all on public.media for select using (true);
drop policy if exists read_all on public.site_settings;        create policy read_all on public.site_settings for select using (true);
drop policy if exists read_all on public.post_tags;            create policy read_all on public.post_tags for select using (true);

-- Personel yazma
drop policy if exists staff_write on public.media;      create policy staff_write on public.media for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists staff_write on public.post_tags;  create policy staff_write on public.post_tags for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists editor_write on public.tags;      create policy editor_write on public.tags for all using (public.is_editor()) with check (public.is_editor());
drop policy if exists editor_write on public.categories;create policy editor_write on public.categories for all using (public.is_editor()) with check (public.is_editor());
drop policy if exists editor_write on public.category_translations; create policy editor_write on public.category_translations for all using (public.is_editor()) with check (public.is_editor());
drop policy if exists admin_write on public.authors;    create policy admin_write on public.authors for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_write on public.site_settings; create policy admin_write on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

-- Yazılar: herkes yayındakini; editör hepsini; yazar kendi yazdığını görür
drop policy if exists posts_read on public.posts;
create policy posts_read on public.posts for select using (
  public.post_is_public(status, published_at, publish_at) or public.is_editor() or (public.is_staff() and created_by = auth.uid())
);
drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts for insert with check (public.is_staff() and created_by = auth.uid());
drop policy if exists posts_update on public.posts;
create policy posts_update on public.posts for update using (public.is_editor() or (public.is_staff() and created_by = auth.uid()))
  with check (public.is_editor() or (public.is_staff() and created_by = auth.uid()));
drop policy if exists posts_delete on public.posts;
create policy posts_delete on public.posts for delete using (public.is_editor());

drop policy if exists pt_read on public.post_translations;
create policy pt_read on public.post_translations for select using (
  exists (select 1 from public.posts p where p.id = post_id)   -- posts RLS'i uygulanır
);
drop policy if exists pt_write on public.post_translations;
create policy pt_write on public.post_translations for all
  using (exists (select 1 from public.posts p where p.id = post_id and (public.is_editor() or (public.is_staff() and p.created_by = auth.uid()))))
  with check (exists (select 1 from public.posts p where p.id = post_id and (public.is_editor() or (public.is_staff() and p.created_by = auth.uid()))));

drop policy if exists premium_staff on public.post_premium;
create policy premium_staff on public.post_premium for all
  using (exists (select 1 from public.posts p where p.id = post_id and (public.is_editor() or (public.is_staff() and p.created_by = auth.uid()))))
  with check (exists (select 1 from public.posts p where p.id = post_id and (public.is_editor() or (public.is_staff() and p.created_by = auth.uid()))));

drop policy if exists rev_staff on public.revisions;
create policy rev_staff on public.revisions for select using (public.is_staff());

drop policy if exists audit_editor on public.audit_log;
create policy audit_editor on public.audit_log for select using (public.is_editor());

drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles for select using (id = auth.uid() or public.is_editor());
-- Profil güncelleme yalnızca sunucu üzerinden (service_role). Kendi tablosunu sorgulayan bir kural
-- RLS'te sonsuz döngüye girer; rol değişikliği zaten yalnızca sunucuda yapılır.
drop policy if exists profiles_self_update on public.profiles;

drop policy if exists subs_self on public.subscriptions;
create policy subs_self on public.subscriptions for select using (user_id = auth.uid() or public.is_editor());

drop policy if exists social_editor on public.social_posts;
create policy social_editor on public.social_posts for select using (public.is_editor());

drop policy if exists payments_admin on public.payment_events;
create policy payments_admin on public.payment_events for select using (public.is_admin());

drop policy if exists contact_editor on public.contact_messages;
create policy contact_editor on public.contact_messages for select using (public.is_editor());
drop policy if exists newsletter_editor on public.newsletter;
create policy newsletter_editor on public.newsletter for select using (public.is_editor());
-- contact_messages / newsletter / subscriptions / payment_events / social_posts yazımı yalnızca sunucu (service_role, RLS'i atlar).

-- ───────────────────────── Depolama ─────────────────────────
-- Görseller Cloudflare R2'de tutulur (ücretsiz çıkış trafiği). Supabase Storage kullanılmaz.
