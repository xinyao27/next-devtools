'use client'

import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  LineChart,
  Link,
  MoreHorizontal,
  Settings2,
  Star,
  Trash,
  Trash2,
} from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = [
  [
    {
      icon: Settings2,
      label: 'Customize Page',
    },
    {
      icon: FileText,
      label: 'Turn into wiki',
    },
  ],
  [
    {
      icon: Link,
      label: 'Copy Link',
    },
    {
      icon: Copy,
      label: 'Duplicate',
    },
    {
      icon: CornerUpRight,
      label: 'Move to',
    },
    {
      icon: Trash2,
      label: 'Move to Trash',
    },
  ],
  [
    {
      icon: CornerUpLeft,
      label: 'Undo',
    },
    {
      icon: LineChart,
      label: 'View analytics',
    },
    {
      icon: GalleryVerticalEnd,
      label: 'Version History',
    },
    {
      icon: Trash,
      label: 'Show delete pages',
    },
    {
      icon: Bell,
      label: 'Notifications',
    },
  ],
  [
    {
      icon: ArrowUp,
      label: 'Import',
    },
    {
      icon: ArrowDown,
      label: 'Export',
    },
  ],
]

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setIsOpen(true)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="text-muted-foreground hidden font-medium md:inline-block">Edit Oct 08</div>
      <Button
        className="h-7 w-7"
        size="icon"
        variant="ghost"
      >
        <Star />
      </Button>
      <Popover
        onOpenChange={setIsOpen}
        open={isOpen}
      >
        <PopoverTrigger asChild>
          <Button
            className="data-[state=open]:bg-accent h-7 w-7"
            size="icon"
            variant="ghost"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-56 overflow-hidden rounded-lg p-0"
        >
          <Sidebar
            className="bg-transparent"
            collapsible="none"
          >
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup
                  className="border-b last:border-none"
                  key={index}
                >
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton>
                            <item.icon /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  )
}
