import { act, renderHook } from '@testing-library/react-native';

import { reportArticle } from '../../services/articles';
import { useReports } from '../useReports';

jest.mock('../../services/articles', () => ({
  reportArticle: jest.fn(),
}));

jest.mock('../../services/comments', () => ({
  reportComment: jest.fn(),
}));

describe('useReports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('denuncia um artigo e marca reported=true', async () => {
    reportArticle.mockResolvedValue({ reported: true, reports: 1 });
    const article = { id: 'a1' };

    const { result } = renderHook(() => useReports(article, 'article'));
    expect(result.current.reported).toBe(false);

    await act(async () => {
      await result.current.report();
    });

    expect(reportArticle).toHaveBeenCalledWith('a1');
    expect(result.current.reported).toBe(true);
  });

  it('nao denuncia duas vezes o mesmo artigo (idempotente no client)', async () => {
    reportArticle.mockResolvedValue({ reported: true, reports: 1 });
    const article = { id: 'a1' };

    const { result } = renderHook(() => useReports(article, 'article'));

    await act(async () => {
      await result.current.report();
    });
    await act(async () => {
      await result.current.report();
    });

    expect(reportArticle).toHaveBeenCalledTimes(1);
  });

  it('registra o erro quando a denuncia falha', async () => {
    reportArticle.mockRejectedValue({
      response: { data: { message: 'Falha ao denunciar' } },
    });
    const article = { id: 'a1' };

    const { result } = renderHook(() => useReports(article, 'article'));

    await act(async () => {
      await expect(result.current.report()).rejects.toBeDefined();
    });

    expect(result.current.reported).toBe(false);
    expect(result.current.error).toBe('Falha ao denunciar');
  });
});
