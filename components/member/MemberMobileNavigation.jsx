'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { SidebarContent } from './MemberSidebar';

export default function MemberMobileNavigation({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="member-fade-in absolute inset-0 bg-green-950/50" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label="Navigation menu" className="member-slide-in relative h-full w-72 max-w-[85vw] shadow-2xl">
        <button type="button" onClick={onClose} aria-label="Close menu" className="absolute right-3 top-3 z-10 rounded-full p-2 text-green-100 hover:bg-white/10"><X className="h-5 w-5" /></button>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  );
}
