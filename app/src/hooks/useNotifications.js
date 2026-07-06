import { useCallback, useEffect } from 'react';

import {
  notifyNewComment,
  requestNotificationPermission,
} from '../services/notifications';

// Centraliza as notificacoes locais do app. Ao montar, pede a permissao de
// notificacoes; expoe um disparo para avisar o autor sobre novos comentarios.
export function useNotifications() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const notifyComment = useCallback((articleTitle) => {
    return notifyNewComment(articleTitle);
  }, []);

  return { notifyComment };
}
