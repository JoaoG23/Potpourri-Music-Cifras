import { useQuery } from '@tanstack/react-query';
import { getMusicList } from '../pages/music/ListMusics/api';

interface UseMusicsParams {
  page?: number;
  perPage?: number;
}

export const useMusics = ({ page = 1, perPage = 10 }: UseMusicsParams = {}) => {
  return useQuery({
    queryKey: ['musics', page, perPage],
    queryFn: () => getMusicList(page, perPage),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
