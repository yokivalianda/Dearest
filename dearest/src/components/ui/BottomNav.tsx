'use client'
import Link from 'next/link'

type Tab = 'home' | 'dates' | 'milestones' | 'gallery' | 'profile'

const tabs: { key: Tab; href: string; label: string; icon: React.ReactNode }[] = [
  {
    key: 'home', href: '/', label: 'Beranda',
    icon: <svg className="w-5 h-5" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    key: 'dates', href: '/dates', label: 'Dates',
    icon: <svg className="w-5 h-5" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    key: 'milestones', href: '/milestones', label: 'Momen',
    icon: <svg className="w-5 h-5" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
  {
    key: 'gallery', href: '/gallery', label: 'Galeri',
    icon: <svg className="w-5 h-5" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  },
  {
    key: 'profile', href: '/profile', label: 'Profil',
    icon: <svg className="w-5 h-5" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
]

export default function BottomNav({ active }: { active: Tab }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-20">
      <div className="mx-4 mb-4 glass rounded-2xl px-2 py-2 flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = tab.key === active
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-rose-deep bg-rose-deep/10'
                  : 'text-muted hover:text-rose-deep'
              }`}
            >
              <span className={`[&>svg]:stroke-current ${isActive ? 'text-rose-deep' : 'text-muted'}`}>
                {tab.icon}
              </span>
              <span className="text-[9px] tracking-wide">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
