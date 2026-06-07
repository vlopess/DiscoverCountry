import type {GameResult, PaginatedResponse, Ranking} from '../types';
import api from "./api.ts";


export const rankingService = {
  async getRanking(): PaginatedResponse<Ranking>[] {
    const { data } = await api.get<PaginatedResponse<Ranking>>('/api/ranking');
    return data;
  },
  async saveResult(result: GameResult): void {
    await api.post<PaginatedResponse<Ranking>>('/api/ranking/score', {points: result.percentage } );
  },
};
