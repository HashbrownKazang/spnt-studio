/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_R2_ENDPOINT: string
    readonly VITE_R2_ACCESS_KEY: string
    readonly VITE_R2_SECRET_KEY: string
    readonly VITE_R2_BUCKET_NAME: string
    readonly VITE_WS_ENDPOINT: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }