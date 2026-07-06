import { act, renderHook } from '@testing-library/react-native';

import { createArticle, updateArticle } from '../../services/articles';
import { useCreateArticle } from '../useCreateArticle';

jest.mock('../../services/articles', () => ({
  createArticle: jest.fn(),
  updateArticle: jest.fn(),
}));

describe('useCreateArticle (publicacao)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cria um novo artigo em rascunho quando nao ha artigo existente', async () => {
    createArticle.mockResolvedValue({ id: 'a1', status: 'DRAFT' });
    const { result } = renderHook(() => useCreateArticle());

    const payload = { title: 'Titulo', content: 'Conteudo', tags: ['node'] };
    await act(async () => {
      await result.current.save(payload, null);
    });

    expect(createArticle).toHaveBeenCalledWith(payload);
    expect(updateArticle).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('atualiza um artigo existente em vez de criar um novo', async () => {
    updateArticle.mockResolvedValue({ id: 'a1', status: 'DRAFT' });
    const { result } = renderHook(() => useCreateArticle());

    const payload = { title: 'Novo titulo', content: 'Novo conteudo', tags: [] };
    await act(async () => {
      await result.current.save(payload, { id: 'a1' });
    });

    expect(updateArticle).toHaveBeenCalledWith('a1', payload);
    expect(createArticle).not.toHaveBeenCalled();
  });

  it('registra o erro quando a publicacao falha', async () => {
    createArticle.mockRejectedValue({
      response: { data: { message: 'titulo e conteudo sao obrigatorios' } },
    });
    const { result } = renderHook(() => useCreateArticle());

    await act(async () => {
      await expect(
        result.current.save({ title: '', content: '' }, null),
      ).rejects.toBeDefined();
    });

    expect(result.current.error).toBe('titulo e conteudo sao obrigatorios');
    expect(result.current.loading).toBe(false);
  });
});
