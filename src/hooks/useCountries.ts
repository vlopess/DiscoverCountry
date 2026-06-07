import { useState, useEffect, useRef } from 'react';
import type { Country } from '../types';
import { countriesService } from '../services/countriesService';

// Module-level cache — survives re-renders, cleared on page refresh
let cache: Country[] | null = null;

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(cache ?? []);
  const [loading,   setLoading]   = useState<boolean>(!cache);
  const [error,     setError]     = useState<string | null>(null);
  const fetching = useRef(false);

  useEffect(() => {
    if (cache) {
      setCountries(cache);
      setLoading(false);
      return;
    }
    if (fetching.current) return;
    fetching.current = true;

    setLoading(true);
    countriesService
      .fetchForGame(150)
      .then((data) => {
        cache = data;
        setCountries(data);
        setError(null);
      })
      .catch(() => {
        setError('Falha ao carregar países. Verifique sua conexão.');
      })
      .finally(() => {
        setLoading(false);
        fetching.current = false;
      });
  }, []);

  return { countries, loading, error };
}
