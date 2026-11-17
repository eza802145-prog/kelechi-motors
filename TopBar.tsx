import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface TopBarProps {
  currentPage: 'landing' | 'thank-you' | 'leads';
  primaryActionLabel?: string;
  onNavigateLanding: (sectionId?: string) => void;
  onNavigateLeads: () => void;
  onPrimaryAction: () => void;
}

export function TopBar({ currentPage, primaryActionLabel, onNavigateLanding, onNavigateLeads, onPrimaryAction }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const actionText = primaryActionLabel || (currentPage === 'thank-you' ? 'Download Your Free Guide' : 'Get Your Free Guide');
  const nav = (target: 'landing' | 'mistakes' | 'guide' | 'leads') => {
    setMobileMenuOpen(false);
    if (target === 'leads') onNavigateLeads();
    else onNavigateLanding(target === 'mistakes' ? 'seven-benefits' : target === 'guide' ? 'guide-overview' : undefined);
  };
  const items = [
    { label: 'Landing Page', target: 'landing' as const },
    { label: '7 Mistakes', target: 'mistakes' as const },
    { label: 'Free Guide', target: 'guide' as const },
    { label: 'Lead Sheet', target: 'leads' as const },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => nav('landing')} className="font-display text-lg font-bold tracking-tight text-[#0B1F3A] whitespace-nowrap">Kelechi Motors</button>
        <nav aria-label="Project sections" className="hidden md:flex items-center gap-2 text-sm font-semibold">
          {items.map((item) => {
            const active = item.target === 'leads' ? currentPage === 'leads' : currentPage !== 'leads' && currentPage !== 'thank-you' && ((item.target === 'landing' && !window.location.hash) || (item.target === 'mistakes' && window.location.hash === '#seven-benefits') || (item.target === 'guide' && window.location.hash === '#guide-overview'));
            return <button key={item.target} type="button" onClick={() => nav(item.target)} className={`rounded-md px-3 py-2 transition-colors ${active ? 'bg-[#0B1F3A] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1F3A]'}`}>{item.label}</button>;
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onPrimaryAction} className="hidden sm:inline-flex min-h-10 items-center justify-center rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#132C4E]">{actionText}</button>
          <button type="button" onClick={() => setMobileMenuOpen(v => !v)} aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-[#0B1F3A] md:hidden">{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {mobileMenuOpen && <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden"><div className="grid grid-cols-2 gap-2">{items.map(item => <button key={item.target} type="button" onClick={() => nav(item.target)} className="rounded-md border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700">{item.label}</button>)}</div><button type="button" onClick={() => { setMobileMenuOpen(false); onPrimaryAction(); }} className="mt-3 w-full rounded-md bg-[#0B1F3A] px-4 py-3 text-sm font-semibold text-white">{actionText}</button></div>}
    </header>
  );
}
