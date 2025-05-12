// Service functions for Journey (wizard) storage using PayloadCMS REST API
import { WizardJourney } from '@/lib/types/wizard';

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || '/api';

export async function fetchJourneyById(journeyId: string): Promise<WizardJourney | null> {
  const res = await fetch(`${API_URL}/journeys/${journeyId}`);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    id: data.id,
    label: data.label,
    steps: data.steps,
    description: data.description,
  };
}

export async function fetchAllJourneys(): Promise<WizardJourney[]> {
  const res = await fetch(`${API_URL}/journeys`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.docs.map((j: any) => ({
    id: j.id,
    label: j.label,
    steps: j.steps,
    description: j.description,
  }));
}

export async function createJourney(journey: Omit<WizardJourney, 'id'>): Promise<WizardJourney> {
  const res = await fetch(`${API_URL}/journeys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(journey),
  });
  if (!res.ok) throw new Error('Failed to create journey');
  return res.json();
}
