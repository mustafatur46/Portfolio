import { NextResponse } from 'next/server';
import { PROJECTS, CATEGORIES } from '@/data/projects';

export async function GET() {
  return NextResponse.json({ projects: PROJECTS, categories: CATEGORIES });
}
