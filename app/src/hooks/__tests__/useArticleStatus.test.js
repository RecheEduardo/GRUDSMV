import { act, renderHook } from '@testing-library/react-native';

import {
  approveArticle,
  rejectArticle,
  submitArticle,
} from '../../services/articles';
import { useArticleStatus } from '../useArticleStatus';

jest.mock('../../services/articles', () => ({
  approveArticle: jest.fn(),
  rejectArticle: jest.fn(),
  submitArticle: jest.fn(),
}));

describe('useArticleStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envia um artigo para revisao (DRAFT -> REVIEW)', async () => {
    submitArticle.mockResolvedValue({ id: 'a1', status: 'REVIEW' });
    const { result } = renderHook(() => useArticleStatus());

    await act(async () => {
      await result.current.submitForReview('a1');
    });

    expect(submitArticle).toHaveBeenCalledWith('a1');
    expect(result.current.error).toBeNull();
    expect(result.current.submittingId).toBeNull();
  });

  it('aprova um artigo (REVIEW -> PUBLISHED)', async () => {
    approveArticle.mockResolvedValue({ id: 'a1', status: 'PUBLISHED' });
    const { result } = renderHook(() => useArticleStatus());

    await act(async () => {
      await result.current.approve('a1');
    });

    expect(approveArticle).toHaveBeenCalledWith('a1');
    expect(result.current.error).toBeNull();
  });

  it('rejeita um artigo (REVIEW -> REJECTED)', async () => {
    rejectArticle.mockResolvedValue({ id: 'a1', status: 'REJECTED' });
    const { result } = renderHook(() => useArticleStatus());

    await act(async () => {
      await result.current.reject('a1');
    });

    expect(rejectArticle).toHaveBeenCalledWith('a1');
    expect(result.current.error).toBeNull();
  });

  it('mantem submittingId durante a transicao e registra erro na falha', async () => {
    submitArticle.mockRejectedValue({
      response: { data: { message: 'Transicao invalida' } },
    });
    const { result } = renderHook(() => useArticleStatus());

    await act(async () => {
      await expect(result.current.submitForReview('a1')).rejects.toBeDefined();
    });

    expect(result.current.error).toBe('Transicao invalida');
    expect(result.current.submittingId).toBeNull();
  });
});
