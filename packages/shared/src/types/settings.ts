import { z } from 'zod'

export enum Editor {
  VSCode = 'vscode',
  Cursor = 'cursor',
  Windsurf = 'windsurf',
}

export const editorCommands = {
  [Editor.VSCode]: 'code',
  [Editor.Cursor]: 'cursor',
  [Editor.Windsurf]: 'windsurf',
}

export const settingsSchema = z.object({
  sidebarCollapsed: z.boolean().optional(),
  uiScale: z.number().optional().default(15),
  editor: z.nativeEnum(Editor).optional().default(Editor.VSCode),
  componentDirectory: z.string().optional().default('/src/components'),
})
export type SettingsStoreState = z.infer<typeof settingsSchema>

export interface SettingsStoreActions {
  setup: (options?: any) => void
  setState: (state: Partial<SettingsStoreState>) => void
}

export type SettingsStore = SettingsStoreState & SettingsStoreActions
