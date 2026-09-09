import type { APIRoute } from 'astro';
import { robotsTxt } from '../lib/robots';

export const GET: APIRoute = async () =>
	new Response(robotsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
