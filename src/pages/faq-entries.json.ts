import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Read by the Keystatic FAQ page form to list the questions (see src/keystatic/faqList.ts).
export const GET: APIRoute = async () => {
  const entries = (await getCollection('faq'))
    .sort((a, b) => a.data.order - b.data.order || a.data.question.localeCompare(b.data.question))
    .map((entry) => ({ id: entry.id, question: entry.data.question, order: entry.data.order }));
  return Response.json(entries);
};
