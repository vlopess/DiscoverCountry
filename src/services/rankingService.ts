import type {ApiResponse, GameResult, PaginatedResponse, Ranking} from '../types';
import api from "./api.ts";


export const rankingService = {
  async getRanking(): Promise<PaginatedResponse<Ranking>> {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Ranking>>>('/api/ranking');
    return data.data;
  },
  async saveResult(result: GameResult): Promise<void> {
    await api.post<PaginatedResponse<Ranking>>('/api/ranking/score', {points: result.percentage } );
  },
};
