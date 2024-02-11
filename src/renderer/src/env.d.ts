/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_TESTVARIABLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
