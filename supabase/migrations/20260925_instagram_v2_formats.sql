-- Support vertical story and reel production storyboards in the private Instagram library.
alter table public.instagram_posts drop constraint if exists instagram_posts_format_check;
alter table public.instagram_posts add constraint instagram_posts_format_check
  check (format in ('carrusel','individual','story','reel'));
