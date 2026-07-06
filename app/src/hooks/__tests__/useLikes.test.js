import { act, renderHook } from '@testing-library/react-native';

import { useAuth } from '../../context/AuthContext';
import { likeArticle, unlikeArticle } from '../../services/articles';
import { useLikes } from '../useLikes';

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../services/articles', () => ({
  likeArticle: jest.fn(),
  unlikeArticle: jest.fn(),
}));

jest.mock('../../services/comments', () => ({
  likeComment: jest.fn(),
  unlikeComment: jest.fn(),
}));

describe('useLikes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: { id: 'u1' } });
  });

  it('curte com atualizacao otimista e reconcilia com o servidor', async () => {
    const article = { id: 'a1', likes: [] };
    likeArticle.mockResolvedValue({ likes: ['u1'] });

    const { result } = renderHook(() => useLikes(article, 'article'));

    expect(result.current.liked).toBe(false);
    expect(result.current.count).toBe(0);

    await act(async () => {
      await result.current.toggle();
    });

    expect(likeArticle).toHaveBeenCalledWith('a1');
    expect(result.current.liked).toBe(true);
    expect(result.current.count).toBe(1);
  });

  it('descurte um artigo ja curtido pelo usuario', async () => {
    const article = { id: 'a1', likes: ['u1'] };
    unlikeArticle.mockResolvedValue({ likes: [] });

    const { result } = renderHook(() => useLikes(article, 'article'));
    expect(result.current.liked).toBe(true);

    await act(async () => {
      await result.current.toggle();
    });

    expect(unlikeArticle).toHaveBeenCalledWith('a1');
    expect(result.current.liked).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it('desfaz a atualizacao otimista (rollback) quando a API falha', async () => {
    const article = { id: 'a1', likes: [] };
    likeArticle.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useLikes(article, 'article'));

    await act(async () => {
      await result.current.toggle();
    });

    expect(result.current.liked).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it('reaproveita a mesma logica para curtidas em comentarios', async () => {
    const { likeComment } = require('../../services/comments');
    const comment = { id: 'c1', likes: [] };
    likeComment.mockResolvedValue({ likes: ['u1'] });

    const { result } = renderHook(() => useLikes(comment, 'comment'));

    await act(async () => {
      await result.current.toggle();
    });

    expect(likeComment).toHaveBeenCalledWith('c1');
    expect(result.current.liked).toBe(true);
  });
});
