import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Keystatic stores uploads as public/resources/<slug>/file.pdf. Browsers save a PDF under the
// last part of its URL, so this serves the same bytes at /resources/<slug>.pdf for a proper
// download name.
export const getStaticPaths = (async () => {
  const resources = await getCollection('resources');
  return resources.map((resource) => ({
    params: { slug: resource.id },
    props: { file: resource.data.file },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const bytes = await readFile(join(process.cwd(), 'public', props.file));
  return new Response(bytes, { headers: { 'Content-Type': 'application/pdf' } });
};
