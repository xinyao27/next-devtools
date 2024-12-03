'use client'

import React from 'react'
import Theme from './(components)/theme'
import UIScale from './(components)/ui-scale'
import SideBarCollapsed from './(components)/sidebar-collapsed'
import Editor from './(components)/editor'
import Directory from './(components)/directory'
import Actions from './(components)/actions'

const sections = [
  { id: 'theme', label: 'Theme', component: Theme },
  { id: 'ui-scale', label: 'UI Scale', component: UIScale },
  { id: 'sidebar-collapsed', label: 'Sidebar Collapsed', component: SideBarCollapsed },
  { id: 'editor', label: 'Editor', component: Editor },
  { id: 'directory', label: 'Directory', component: Directory },
  { id: 'actions', label: 'Actions', component: Actions },
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
