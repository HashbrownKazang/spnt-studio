# Podcast Platform Gameplan

## Core Requirements
- **Authentication**: Clerk for user auth with admin/editor roles
- **Storage**: Cloudflare R2 for audio file storage
- **Database**: Supabase for:
  - Episode metadata
  - User information
  - Comments/chat logs

## Pages & Features
1. **Home Page**:
   - Showcase brand and live show prominently
   - Catalog of previous episodes
   - Realtime chat for live shows (Cloudflare Durable Workers)

2. **Episode Pages**:
   - Individual pages for each episode
   - Playback functionality
   - Comments section (populated from Supabase)
   - Chat logs from live shows appear as comments

3. **Recording Component** (Admin/Editor only):
   - Audio recording interface
   - Upload to Cloudflare R2
   - Restricted access based on user role

## Technical Stack
- Frontend: Next.js (existing)
- Auth: Clerk
- Storage: Cloudflare R2
- Database: Supabase
- Realtime: Cloudflare Durable Workers for chat
- Deployment: TBD

## Initial Requirements (from prompt):
```
this repo is for my brand's podcast. The home page is going to showcase the brand and the live show.  The recording components are going to be on;y for me and my tea,. Unless the user does not have elevated privledges (admin, editor) then they should not have access to the recording components.. Theuy can access the home page where I want to have any live show front and center and then there needs to be a catalog of previous episodes that they can browse and playback. Use clerk for auth, cloudflare for R2 storage and supabase for regular database functions, like metadata for the episodes and user info. The recording component should be able to record audio and then it needs to send it to cloudflare. Also I want the users to be able to comment on the episodes so each episode should have it's own page and on the home page the live show should have realtime chat integration using cloudlflare's durable workers and that chat log should then b saved in supabase and show up on the episodes page as comments. Also I want you to create a markdown file called gameplan.md and ensure that this prompt is placed there along wit any  further planning we do. Sttart with that so that should something go wrong I don't have to retype all of this
```

## Implementation Notes:
- Need to set up Clerk auth integration
- Configure Cloudflare R2 bucket and API access
- Set up Supabase tables for:
  - episodes (id, title, description, audio_url, date, etc.)
  - comments (id, episode_id, user_id, content, timestamp)
  - users (sync with Clerk)
- Implement role-based access control
- Build recording interface with audio upload
- Create home page layout with live show and catalog
- Implement episode pages with comments
- Set up realtime chat with Cloudflare Workers
