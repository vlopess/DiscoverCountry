import api from './api';
import type { Country, CountriesPage, CountriesParams } from '../types';

// ─── GET /api/countries ────────────────────────────────────────────────────
async function getAll(params: CountriesParams = {}): Promise<CountriesPage> {
  const { data } = await api.get<CountriesPage>('/api/countries', { params });
  return data;
}

// Convenience: fetch ALL pages until we have enough for the game.
// Fetches up to maxPages sequentially; stops early if server has fewer pages.
async function fetchForGame(minCount = 100): Promise<Country[]> {
  const limit   = 100;
  let   page    = 1;
  const results: Country[] = [];

  while (results.length < minCount) {
    const res = await getAll({ page, limit });
    results.push(...res.data.data);
    if (page >= res.data.meta.total || results.length >= minCount) break;
    page++;
  }

  return results;
}

// ─── GET /api/countries/:code ──────────────────────────────────────────────
async function getByCode(code: string): Promise<Country> {
  const { data } = await api.get<Country>(`/api/countries/${code}`);
  return data;
}

export const countriesService = { getAll, fetchForGame, getByCode };
