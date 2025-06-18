import { z } from 'zod'

export enum Editor {
  Cursor = 'cursor',
  VSCode = 'vscode',
  Windsurf = 'windsurf',
}

export const editorCommands = {
  [Editor.Cursor]: 'cursor',
  [Editor.VSCode]: 'code',
  [Editor.Windsurf]: 'windsurf',
}

export enum ToolbarPosition {
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
  Top = 'top',
}

export interface ToolbarSize {
  height: number | string
  width: number | string
}

export const DEFAULT_TOOLBAR_SIZE = 770
export const TOOLBAR_MIN_SIZE = 100
export const MINI_TOOLBAR_SIZE = 45

export const ToolbarDefaultSize: Record<ToolbarPosition, ToolbarSize> = {
  [ToolbarPosition.Bottom]: {
    height: DEFAULT_TOOLBAR_SIZE,
    width: '100%',
  },
  [ToolbarPosition.Left]: {
    height: '100%',
    width: DEFAULT_TOOLBAR_SIZE,
  },
  [ToolbarPosition.Right]: {
    height: '100%',
    width: DEFAULT_TOOLBAR_SIZE,
  },
  [ToolbarPosition.Top]: {
    height: DEFAULT_TOOLBAR_SIZE,
    width: '100%',
  },
}

export const settingsStoreDefaultState: SettingsStoreState = {
  componentDirectory: '/src/components',
  editor: Editor.VSCode,
  sidebarCollapsed: undefined,
  toolbarPosition: ToolbarPosition.Bottom,
  toolbarSize: {
    height: MINI_TOOLBAR_SIZE,
    width: '100%',
  },
  uiScale: 15,
}

export const settingsSchema = z.object({
  componentDirectory: z.string().optional().default('/src/components'),
  editor: z.nativeEnum(Editor).optional().default(Editor.VSCode),
  sidebarCollapsed: z.boolean().optional(),
  toolbarPosition: z.nativeEnum(ToolbarPosition).optional().default(ToolbarPosition.Bottom),
  toolbarSize: z
    .object({
      height: z.number().or(z.string()).default(MINI_TOOLBAR_SIZE),
      width: z.number().or(z.string()).default('100%'),
    })
    .optional(),
  uiScale: z.number().optional().default(15),
})
export type SettingsStore = SettingsStoreActions & SettingsStoreState

export interface SettingsStoreActions {
  setState: (state: Partial<SettingsStoreState>) => void
  setToolbarPosition: (toolbarPosition: ToolbarPosition) => void
  setToolbarSize: (size: number) => void
  setup: (options?: any) => void
  toggleToolbar: () => void
}

export type SettingsStoreState = z.infer<typeof settingsSchema>

export type ToolbarStatus = 'full' | 'hide' | 'mini'

export function getToolbarStatusBySize(size: ToolbarSize | undefined, position: ToolbarPosition): ToolbarStatus {
  if (!size) return 'hide'

  let value = 0
  switch (position) {
    case ToolbarPosition.Bottom:
    case ToolbarPosition.Top:
      value = Number(size.height)
      break
    case ToolbarPosition.Left:
    case ToolbarPosition.Right:
      value = Number(size.width)
  }
  if (value < MINI_TOOLBAR_SIZE) return 'hide'
  if (value < TOOLBAR_MIN_SIZE) return 'mini'
  return 'full'
}
