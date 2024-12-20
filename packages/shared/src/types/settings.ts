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

export enum ToolbarPosition {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

export interface ToolbarSize {
  width: number | string
  height: number | string
}

export const DEFAULT_TOOLBAR_SIZE = 770
export const TOOLBAR_MIN_SIZE = 100
export const MINI_TOOLBAR_SIZE = 45

export const ToolbarDefaultSize: Record<ToolbarPosition, ToolbarSize> = {
  [ToolbarPosition.Top]: {
    width: '100%',
    height: DEFAULT_TOOLBAR_SIZE,
  },
  [ToolbarPosition.Bottom]: {
    width: '100%',
    height: DEFAULT_TOOLBAR_SIZE,
  },
  [ToolbarPosition.Left]: {
    width: DEFAULT_TOOLBAR_SIZE,
    height: '100%',
  },
  [ToolbarPosition.Right]: {
    width: DEFAULT_TOOLBAR_SIZE,
    height: '100%',
  },
}

export const settingsStoreDefaultState: SettingsStoreState = {
  sidebarCollapsed: undefined,
  toolbarPosition: ToolbarPosition.Bottom,
  toolbarSize: {
    width: '100%',
    height: MINI_TOOLBAR_SIZE,
  },
  uiScale: 15,
  editor: Editor.VSCode,
  componentDirectory: '/src/components',
}

export const settingsSchema = z.object({
  sidebarCollapsed: z.boolean().optional(),
  uiScale: z.number().optional().default(15),
  toolbarPosition: z.nativeEnum(ToolbarPosition).optional().default(ToolbarPosition.Bottom),
  toolbarSize: z
    .object({
      width: z.number().or(z.string()).default('100%'),
      height: z.number().or(z.string()).default(MINI_TOOLBAR_SIZE),
    })
    .optional(),
  editor: z.nativeEnum(Editor).optional().default(Editor.VSCode),
  componentDirectory: z.string().optional().default('/src/components'),
})
export type SettingsStoreState = z.infer<typeof settingsSchema>

export interface SettingsStoreActions {
  setup: (options?: any) => void
  setState: (state: Partial<SettingsStoreState>) => void
  setToolbarSize: (size: number) => void
  setToolbarPosition: (toolbarPosition: ToolbarPosition) => void
  toggleToolbar: () => void
}

export type SettingsStore = SettingsStoreState & SettingsStoreActions

export type ToolbarStatus = 'hide' | 'mini' | 'full'

export function getToolbarStatusBySize(size: ToolbarSize | undefined, position: ToolbarPosition): ToolbarStatus {
  if (!size) return 'hide'

  let value = 0
  switch (position) {
    case ToolbarPosition.Top:
    case ToolbarPosition.Bottom:
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
