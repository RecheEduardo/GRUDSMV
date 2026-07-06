import * as Notifications from 'expo-notifications';

// Exibe a notificacao mesmo com o app aberto (primeiro plano).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Solicita a permissao de notificacoes ao usuario (idempotente: se ja
// concedida, nao pergunta de novo). Retorna true se autorizada.
export async function requestNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

// Dispara uma notificacao local imediata avisando o autor sobre um novo
// comentario em um de seus artigos.
export async function notifyNewComment(articleTitle) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Novo comentario no seu artigo',
      body: articleTitle
        ? `"${articleTitle}" recebeu um novo comentario.`
        : 'Um dos seus artigos recebeu um novo comentario.',
    },
    trigger: null,
  });
}
