import { useEffect, useRef, useState } from 'react';
import { TopBar } from './TopBar';
import { PUBLISHED_GOOGLE_FORM_EMBED_URL, PUBLISHED_GOOGLE_FORM_VIEW_URL } from './guideContent';
import { LandingPage } from './LandingPage';
import { ThankYouPage } from './ThankYouPage';
import type { FunnelConfig } from './funnel';
import { downloadUsedCarGuidePdf } from './generateGuidePdf';

const DEFAULT_CONFIG: FunnelConfig = {
  whatsappNumber: '2348060677222',
  isDemoWhatsapp: true,
  googleFormViewUrl: PUBLISHED_GOOGLE_FORM_VIEW_URL,
  googleFormEmbedUrl: PUBLISHED_GOOGLE_FORM_EMBED_URL,
};

type Page = 'landing' | 'thank-you' | 'leads';
function getRouteFromPath(): Page {
  if (typeof window === 'undefined') return 'landing';
  if (window.location.pathname.startsWith('/thank-you')) return 'thank-you';
  if (window.location.pathname.startsWith('/leads')) return 'leads';
  return 'landing';
}

const sampleLeads = [
  { name: 'M*** J***', email: 'm***@example.com', phone: '080****7722', date: '17 Nov 2026' },
  { name: 'M*** O***', email: 'm***@example.com', phone: '070****1961', date: '17 Nov 2026' },
  { name: 'M*** E***', email: 'm***@example.com', phone: '080****7722', date: '17 Nov 2026' },
];

function PublicLeadSheet() {
  return <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="mb-8"><p className="text-sm font-bold uppercase tracking-widest text-[#A47B12]">Project dashboard</p><h1 className="mt-2 text-3xl font-bold text-[#0B1F3A] sm:text-4xl">Lead Sheet</h1><p className="mt-3 max-w-2xl text-slate-600">A public demonstration view of the lead register. Personal contact details are masked for privacy.</p></div>
    <div className="mb-6 grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Demo records</p><p className="mt-1 text-3xl font-bold text-[#0B1F3A]">3</p></div><div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Data visibility</p><p className="mt-1 text-xl font-bold text-[#0B1F3A]">Masked</p></div><div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Registration source</p><p className="mt-1 text-xl font-bold text-[#0B1F3A]">Google Forms</p></div></div>
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-5 py-4"><h2 className="font-bold text-[#0B1F3A]">Sample registrations</h2><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Demonstration data</span></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Customer name</th><th className="px-5 py-3">Email address</th><th className="px-5 py-3">Phone number</th><th className="px-5 py-3">Submission date</th><th className="px-5 py-3">Record type</th></tr></thead><tbody>{sampleLeads.map((lead, i) => <tr key={i} className="border-t border-slate-100"><td className="px-5 py-4 font-medium text-slate-800">{lead.name}</td><td className="px-5 py-4 text-slate-600">{lead.email}</td><td className="px-5 py-4 text-slate-600">{lead.phone}</td><td className="px-5 py-4 text-slate-600">{lead.date}</td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">Sample</span></td></tr>)}</tbody></table></div></div>
    <p className="mt-4 text-sm leading-6 text-slate-500">Live visitor registrations are collected through the existing Google Form and stored in the connected Google Sheet. This public table contains masked demonstration records only; it does not expose the live customer database.</p>
  </main>;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getRouteFromPath);
  const [config, setConfig] = useState<FunnelConfig>(DEFAULT_CONFIG);
  const formRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    fetch('/api/config').then(res => res.ok ? res.json() : null).then(data => { if (data) setConfig(data as FunnelConfig); }).catch(() => {});
  }, []);
  useEffect(() => {
    const onPopState = () => setCurrentPage(getRouteFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const navigateTo = (page: Page, sectionId?: string) => {
    const path = page === 'thank-you' ? '/thank-you' : page === 'leads' ? '/leads' : '/';
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setCurrentPage(page);
    if (page === 'thank-you' || page === 'leads') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (sectionId) setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 60);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const scrollToForm = () => {
    if (currentPage !== 'landing') { navigateTo('landing', 'register-guide'); return; }
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handlePrimaryAction = () => currentPage === 'thank-you' ? void downloadUsedCarGuidePdf() : scrollToForm();
  const primaryActionLabel = currentPage === 'thank-you' ? 'Download Your Free Guide' : 'Get Your Free Guide';
  return <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
    <TopBar currentPage={currentPage} primaryActionLabel={primaryActionLabel} onNavigateLanding={sectionId => navigateTo('landing', sectionId)} onNavigateLeads={() => navigateTo('leads')} onPrimaryAction={handlePrimaryAction} />
    <div className="flex-1">{currentPage === 'landing' ? <LandingPage config={config} formRef={formRef} onScrollToForm={scrollToForm} onGoToThankYou={() => navigateTo('thank-you')} /> : currentPage === 'thank-you' ? <ThankYouPage config={config} onBackToLanding={() => navigateTo('landing')} /> : <PublicLeadSheet />}</div>
    <footer className="border-t border-slate-200 bg-[#0B1F3A] py-8 text-center text-sm text-white/80"><p>© {new Date().getFullYear()} Kelechi Motors. Drive Your Dreams.</p><p className="mt-2">Lead generation project demonstration</p></footer>
  </div>;
}
