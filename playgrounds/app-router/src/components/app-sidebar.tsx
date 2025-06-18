'use client'

import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from 'lucide-react'
import * as React from 'react'

import { NavFavorites } from '@/components/nav-favorites'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavWorkspaces } from '@/components/nav-workspaces'
import { TeamSwitcher } from '@/components/team-switcher'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'

// This is sample data.
const data = {
  favorites: [
    {
      emoji: '📊',
      name: 'Project Management & Task Tracking',
      url: '#',
    },
    {
      emoji: '🍳',
      name: 'Family Recipe Collection & Meal Planning',
      url: '#',
    },
    {
      emoji: '💪',
      name: 'Fitness Tracker & Workout Routines',
      url: '#',
    },
    {
      emoji: '📚',
      name: 'Book Notes & Reading List',
      url: '#',
    },
    {
      emoji: '🌱',
      name: 'Sustainable Gardening Tips & Plant Care',
      url: '#',
    },
    {
      emoji: '🗣️',
      name: 'Language Learning Progress & Resources',
      url: '#',
    },
    {
      emoji: '🏠',
      name: 'Home Renovation Ideas & Budget Tracker',
      url: '#',
    },
    {
      emoji: '💰',
      name: 'Personal Finance & Investment Portfolio',
      url: '#',
    },
    {
      emoji: '🎬',
      name: 'Movie & TV Show Watchlist with Reviews',
      url: '#',
    },
    {
      emoji: '✅',
      name: 'Daily Habit Tracker & Goal Setting',
      url: '#',
    },
  ],
  navMain: [
    {
      icon: Search,
      title: 'Search',
      url: '#',
    },
    {
      icon: Sparkles,
      title: 'Ask AI',
      url: '#',
    },
    {
      icon: Home,
      isActive: true,
      title: 'Home',
      url: '#',
    },
    {
      badge: '10',
      icon: Inbox,
      title: 'Inbox',
      url: '#',
    },
  ],
  navSecondary: [
    {
      icon: Calendar,
      title: 'Calendar',
      url: '#',
    },
    {
      icon: Settings2,
      title: 'Settings',
      url: '#',
    },
    {
      icon: Blocks,
      title: 'Templates',
      url: '#',
    },
    {
      icon: Trash2,
      title: 'Trash',
      url: '#',
    },
    {
      icon: MessageCircleQuestion,
      title: 'Help',
      url: '#',
    },
  ],
  teams: [
    {
      logo: Command,
      name: 'Acme Inc',
      plan: 'Enterprise',
    },
    {
      logo: AudioWaveform,
      name: 'Acme Corp.',
      plan: 'Startup',
    },
    {
      logo: Command,
      name: 'Evil Corp.',
      plan: 'Free',
    },
  ],
  workspaces: [
    {
      emoji: '🏠',
      name: 'Personal Life Management',
      pages: [
        {
          emoji: '📔',
          name: 'Daily Journal & Reflection',
          url: '#',
        },
        {
          emoji: '🍏',
          name: 'Health & Wellness Tracker',
          url: '#',
        },
        {
          emoji: '🌟',
          name: 'Personal Growth & Learning Goals',
          url: '#',
        },
      ],
    },
    {
      emoji: '💼',
      name: 'Professional Development',
      pages: [
        {
          emoji: '🎯',
          name: 'Career Objectives & Milestones',
          url: '#',
        },
        {
          emoji: '🧠',
          name: 'Skill Acquisition & Training Log',
          url: '#',
        },
        {
          emoji: '🤝',
          name: 'Networking Contacts & Events',
          url: '#',
        },
      ],
    },
    {
      emoji: '🎨',
      name: 'Creative Projects',
      pages: [
        {
          emoji: '✍️',
          name: 'Writing Ideas & Story Outlines',
          url: '#',
        },
        {
          emoji: '🖼️',
          name: 'Art & Design Portfolio',
          url: '#',
        },
        {
          emoji: '🎵',
          name: 'Music Composition & Practice Log',
          url: '#',
        },
      ],
    },
    {
      emoji: '🏡',
      name: 'Home Management',
      pages: [
        {
          emoji: '💰',
          name: 'Household Budget & Expense Tracking',
          url: '#',
        },
        {
          emoji: '🔧',
          name: 'Home Maintenance Schedule & Tasks',
          url: '#',
        },
        {
          emoji: '📅',
          name: 'Family Calendar & Event Planning',
          url: '#',
        },
      ],
    },
    {
      emoji: '🧳',
      name: 'Travel & Adventure',
      pages: [
        {
          emoji: '🗺️',
          name: 'Trip Planning & Itineraries',
          url: '#',
        },
        {
          emoji: '🌎',
          name: 'Travel Bucket List & Inspiration',
          url: '#',
        },
        {
          emoji: '📸',
          name: 'Travel Journal & Photo Gallery',
          url: '#',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="border-r-0"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary
          className="mt-auto"
          items={data.navSecondary}
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
