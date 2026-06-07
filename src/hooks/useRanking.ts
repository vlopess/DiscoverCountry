import {useState, useCallback, useEffect} from 'react';
import type {PaginatedResponse, Ranking} from '../types';
import { rankingService } from '../services/rankingService';

export function useRanking() {
  const [ranking, setRanking] = useState<PaginatedResponse<Ranking> | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const [response] = await Promise.all([rankingService.getRanking()]);
      setRanking(response);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    ranking,
    loading,
    refresh,
  };
}
