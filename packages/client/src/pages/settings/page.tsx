'use client'

import React from 'react'

import Actions from './(components)/actions'
import Directory from './(components)/directory'
import Editor from './(components)/editor'
import SideBarCollapsed from './(components)/sidebar-collapsed'
import Theme from './(components)/theme'
import ToolbarPosition from './(components)/toolbar-position'
import UIScale from './(components)/ui-scale'

const sections = [
  { component: Theme, id: 'theme', label: 'Theme' },
  { component: ToolbarPosition, id: 'toolbar-position', label: 'Toolbar Position' },
  { component: UIScale, id: 'ui-scale', label: 'UI Scale' },
  { component: SideBarCollapsed, id: 'sidebar-collapsed', label: 'Sidebar Collapsed' },
  { component: Editor, id: 'editor', label: 'Editor' },
  { component: Directory, id: 'directory', label: 'Directory' },
  { component: Actions, id: 'actions', label: 'Actions' },
]

export default function Page() {
  return (
    <div className="flex flex-col px-4 pb-4">
      <h1 className="bg-background flex h-14 items-center gap-2 font-medium">
        <i className="i-ri-settings-6-line size-6" />
        Settings
      </h1>

      <div className="mt-4 flex gap-4">
        <div className="space-y-6">
          {sections.map((section) => (
            <section.component key={section.id} />
          ))}
        </div>
      </div>
    </div>
  )
}
