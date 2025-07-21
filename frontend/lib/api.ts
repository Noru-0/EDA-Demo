import { Event } from '../types/event';

export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}` },
  });
  if (!response.ok) throw new Error('Failed to fetch events');
  const data = await response.json();
  return data.map((event) => ({
    ...event,
    name: event.title, // Map title to name
    description: event.description || 'No description available',
    shortDescription: event.shortDescription || event.title,
    location: event.location || 'Unknown location',
    capacity: event.capacity || 100,
    registered: event.registered || 0,
    image: event.image || '/placeholder.svg',
    status: event.status || 'upcoming',
  }));
}

export async function createRegistration(userId: number, eventId: number): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
    },
    body: JSON.stringify({ userId, eventId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create registration');
  }
}
