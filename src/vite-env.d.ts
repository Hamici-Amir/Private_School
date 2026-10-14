/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_TIMEOUT?: string
  readonly VITE_USE_MOCK_API?: string
  readonly VITE_ENABLE_DEV_TOOLS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
