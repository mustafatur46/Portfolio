import Hero                from '@/components/Hero';
import Chatbot             from '@/components/Chatbot/index';
import About               from '@/components/About';
import Experience          from '@/components/Experience';
import GitHubActivity      from '@/components/GitHubActivity';
import ProjectsFlowClient  from '@/components/ProjectsFlowClient';

export default function Home() {
  return (
    <main>
      <Hero />

      <Chatbot />

      <About />

      <Experience />

      {/* ── Projects — Architektur-Explorer ────────────────────────────── */}
      <section id="projects" className="py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2
            className="font-bold mb-3 bg-gradient-to-br from-white to-[#a855f7] bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}
          >
            Projects
          </h2>
          <p className="text-[#888] text-[1.05rem] mb-8 max-w-[600px]">
            Wähl links ein Projekt — rechts erscheint sein echtes Architektur-Diagramm,
            direkt aus dem Quellcode abgeleitet. Drauf zoomen, ziehen oder per ⤢ in den Vollbild-Modus.
          </p>
          <ProjectsFlowClient />
        </div>
      </section>

      {/* ── GitHub — Live API ─────────────────────────────────────────── */}
      <GitHubActivity />
    </main>
  );
}
