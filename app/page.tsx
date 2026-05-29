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
          <ProjectsFlowClient />
        </div>
      </section>

      {/* ── GitHub — Live API ─────────────────────────────────────────── */}
      <GitHubActivity />
    </main>
  );
}
