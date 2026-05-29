'use client';

import dynamic from 'next/dynamic';

// React Flow relies on browser APIs — must be loaded client-side only
const ProjectsFlow = dynamic(() => import('@/components/ProjectsFlow'), { ssr: false });

export default function ProjectsFlowClient() {
  return <ProjectsFlow />;
}
