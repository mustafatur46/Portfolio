import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Mustafa Turhal — AI Engineer & Developer',
  description:
    'Portfolio von Mustafa Turhal — AI Engineer, Software Developer, Founder @ Beautify. Master KI an der Goethe-Universität Frankfurt.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-[#0a0a0a] text-[#f1f1f1]">
        <Navbar />
        {children}
        <footer className="border-t border-white/[0.09] py-8 mt-8">
          <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[#555] text-[0.85rem]">© 2026 Mustafa Turhal</p>
            <div className="flex gap-6">
              <a href="mailto:mustafa.turhal08@gmail.com" className="text-[#555] text-[0.85rem] hover:text-[#a855f7] transition-colors no-underline">
                mustafa.turhal08@gmail.com
              </a>
              <a href="https://github.com/mustafatur46" target="_blank" rel="noopener noreferrer" className="text-[#555] text-[0.85rem] hover:text-[#a855f7] transition-colors no-underline">
                GitHub
              </a>
              <a href="https://linkedin.com/in/mustafa-turhal-9963ba26a" target="_blank" rel="noopener noreferrer" className="text-[#555] text-[0.85rem] hover:text-[#a855f7] transition-colors no-underline">
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
