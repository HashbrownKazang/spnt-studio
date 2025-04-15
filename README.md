 # spnt-studio

## tech-stack

* nextjs
* react
* typescript
* tailwind
* supabase
* clerk
* cloudflare
* vercel
* resend
* gitlab
* github
* firebase-studio
* gemini

## purpose

This is an app created so that my team and I can record our podcast, users can then listen live, or browse the catalog and listen to previously recorder episodes. This is not intended to be multi-tenant at this time. I just wanted a way to record or podcast, and kee everything possible in house. The brand spuntentertainment and the podcast TH3H1T5H0W (the shit show) are not for everyone and that is okay, but th last thing we need is corporate oversight. spuntentertainment is not resposible

## development

Started wit create-next-app, added supabase and clerk and worked out the authentication workflow. Next is the schema for the database. With clerk and upabase handling auth and users, I set out to have cloudflare R2 storage do the heavy lifting as far as the backend was concerned. R2 storage fr storiing and serving the audio files and durable workers for real time chat. If that all falls in place the rest shoould as well.