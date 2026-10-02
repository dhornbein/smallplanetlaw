import type { APIRoute } from 'astro';
import { TITLE_SEPARATOR, getSettings } from '../utils/content';

// Read by the Keystatic "Page title" field to preview the full title.
export const GET: APIRoute = async () => {
  const { titleSuffix } = await getSettings();
  return Response.json({ suffix: titleSuffix, separator: TITLE_SEPARATOR });
};
