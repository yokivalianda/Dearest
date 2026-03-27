'use client'
import { useAppStore } from '@/store/useAppStore'
import BottomNav from '@/components/ui/BottomNav'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function GalleryPage() {
  const { dates } = useAppStore()
  const datesWithPhotos = dates.filter(d => d.photos && d.photos.length > 0)

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-80 h-80 rounded-full bg-warm/40 blur-[80px] -top-10 right-0" />
        <div className="absolute w-64 h-64 rounded-full bg-blush/30 blur-[80px] bottom-20 -left-10" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-14 pb-32">
        <div className="mb-8">
          <p className="font-serif text-sm italic text-muted">foto bersama</p>
          <h1 className="font-serif text-3xl font-light">Galeri Kenangan</h1>
        </div>

        {datesWithPhotos.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <span className="text-5xl">🖼️</span>
            <p className="font-serif text-xl italic text-muted">Belum ada foto tersimpan</p>
            <p className="text-sm text-muted/70 max-w-[240px]">Tambahkan foto saat mencatat date barumu</p>
          </div>
        ) : (
          <div className="columns-2 gap-3">
            {datesWithPhotos.flatMap(d =>
              (d.photos ?? []).map((url, i) => (
                <div key={`${d.id}-${i}`} className="mb-3 break-inside-avoid">
                  <div className="rounded-2xl overflow-hidden glass">
                    <img src={url} alt={d.title} className="w-full object-cover" />
                    <div className="px-3 py-2">
                      <p className="font-serif text-xs text-text-main leading-snug">{d.title}</p>
                      <p className="text-[10px] text-muted">{format(new Date(d.date), 'd MMM yyyy', { locale: id })}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav active="gallery" />
    </main>
  )
}
