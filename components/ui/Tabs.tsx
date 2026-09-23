'use client'
import { useState, type ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

export function Tabs({ tabs, defaultTab, className = '' }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? '')
  const currentTab = tabs.find(t => t.id === active)

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex border-b border-white/10 gap-0 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap font-['Oswald'] tracking-wide ${
              active === tab.id
                ? 'border-[#00592B] text-white'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1">
        {currentTab?.content}
      </div>
    </div>
  )
}
