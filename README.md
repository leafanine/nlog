# nLog
---

*Natural Way Of Blogging. By writing politcally incorrect things uwu*

---
# History

Made by my friend **[Somnath Das](https://github.com/SomnathDas)** few years ago.
I borrowed the design from him and started building it in Next + supabase. Currently it works properly. Please post anything you want. Our motto is to stay anti-political.

## Built using
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## Try Now [ Deployment is online ( hopefully ) ]
**[Try nLog now](https://nlog-peach.vercel.app)**

## Screen-shots ( Aesthetic and Mild UI )
**Design File:  [Checkout at Figma](https://www.figma.com/community/file/1118764549305878223)**
![Screenshot of home page of nLog website](https://i.imgur.com/SnnJLjL.png "Responsive af")
![Screenshot of home page of nLog website on mobile screen](https://i.imgur.com/uEIvyIe.png "Freedom of speech? Log-in first")

## Installation 
1. **Make sure you have Node.js v24.12.0 or above**
2. **Make sure you have npm (node package manager)**

```bash
git clone https://github.com/leafanine/nlog
```
```bash
cd nLog
```
```bash
cd client-next
```
```bash
npm install
```
```bash
npm run build
```
```bash
npm run start
```

## Configuration

### Client
```bash
cd client-next
```
```bash
touch .env.local
```
```bash
nano .env
```
```bash
NEXT_PUBLIC_BASE_URL=<YOUR_URL>

# Supabase — fill these in from your project's API settings
NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_KEY>
```

**Auth is entirely being handled by supabase auth, just login to it and create a project and connect it here**

### Supabase

Query all these in Supabase sql editor 

## 1. These create the core data structures for users and posts.
```bash
-- Profiles table (extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  created_at timestamptz default now()
);

-- Posts table
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 100),
  content text not null check (char_length(content) <= 10000),
  user_id uuid references auth.users(id) on delete cascade not null,
  username text not null,
  tags text[] default '{}',
  likes text[] default '{}', -- array of user UUIDs
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

```

## 2. These handle automatic profile creation and timestamp updates.
```bash
-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update the 'updated_at' column on post edits
create or replace function update_updated_at_column()
returns trigger as $$ 
begin 
  new.updated_at = now(); 
  return new; 
end; 
$$ language plpgsql;

create trigger posts_updated_at before update on public.posts
  for each row execute procedure update_updated_at_column();

```

## 3. This function allows users to "Like" a post without needing permissions to edit the entire post row.
```bash
-- Database function to append a user ID to the likes array
create or replace function public.like_post(p_post_id uuid, p_user_id uuid)
returns void as $$
begin
  update public.posts
  set likes = array_append(likes, p_user_id::text)
  where id = p_post_id
    and not (p_user_id::text = any(likes));
end;
$$ language plpgsql security definer;

```

## 4. RLS Policies - Row Level Security : These define who can read, create, or delete data.
```bash
-- Enable RLS on both tables
alter table public.profiles enable row level security;
alter table public.posts enable row level security;

-- Profile Policies
create policy "Profiles viewable by everyone" on public.profiles for select using (true);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Post Policies
create policy "Posts viewable by everyone" on public.posts for select using (true);
create policy "Auth users can create posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "Authors can update their own posts" on public.posts for update using (auth.uid() = user_id);
create policy "Authors can delete their own posts" on public.posts for delete using (auth.uid() = user_id);

```

## 5. Performance enhancement : These make searching and sorting much faster as your post count grows.

```bash
-- Latest posts sort index
create index posts_created_at_idx on public.posts (created_at desc);

-- Search index (for the title search feature)
create index posts_title_idx on public.posts using gin(to_tsvector('english', title));

-- Lookup indices for profiles
create index profiles_username_idx on public.profiles (username);
```

## Running the application

### Development
**This runs in development. We have gotten rid of any server, use supabase.
```bash
npm run start
```

### Production
**Build client for peoduction, it will build with the available variables in `.env.local`
```bash
npm run build
```

## Special Thanks 

1. UI : Design by <a href="https://github.com/SomnathDas">Somnath Das</a> on <a href="https://www.figma.com/community/file/1118764549305878223/nlog-a-blogging-website">Figma</a>

2. Favicon: Photo by <a href="https://unsplash.com/@evieshaffer?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Evie S.</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

3. Login & Sign-Up Screen: Photo by <a href="https://unsplash.com/@simebasioli?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sime Basioli</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

## Author
**Leafanine - Suchibhas Nanda**

