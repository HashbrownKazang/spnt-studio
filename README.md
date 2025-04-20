# spnt-studio

## Tech Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Clerk
- Cloudflare (R2 Storage, Durable Objects, Workers)
- Vercel
- Resend
- GitLab
- GitHub
- Firebase Studio
- Gemini

## Purpose
spnt-studio is a dedicated platform designed for recording and broadcasting the podcast "TH3H1T5H0W" by the spuntentertainment team. The platform allows users to listen to live broadcasts, browse a catalog of previously recorded episodes, and engage through comments and live chat. The project aims to maintain complete control over content and infrastructure, avoiding external corporate oversight.

## Features Implemented
- User authentication and management via Clerk and Supabase
- Audio recording interface with direct uploads to Cloudflare R2 storage
- Episode catalog with individual episode pages
- Comment system for user interaction on episodes
- Basic live chat infrastructure

## Upcoming Features
- Real-time live show system using Cloudflare Durable Objects and Workers
- Admin dashboard for episode and broadcast management
- User role management and permissions
- Enhanced live chat integration with broadcast scheduling and controls
- Infrastructure improvements including message archiving and proper CORS configuration

## Development Notes
The project began with create-next-app, integrating Supabase and Clerk for authentication. Cloudflare R2 storage handles audio file storage and serving, while Cloudflare Durable Objects and Workers are planned for real-time chat functionality. The database schema and backend infrastructure are designed to support scalability and ease of management.
