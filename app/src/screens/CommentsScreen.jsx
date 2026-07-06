import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import AppButton from '../components/AppButton';
import Card from '../components/Card';
import LikeButton from '../components/LikeButton';
import ReportButton from '../components/ReportButton';
import { useAuth } from '../context/AuthContext';
import { useComments } from '../hooks/useComments';
import { useNotifications } from '../hooks/useNotifications';
import { colors, radius, spacing } from '../theme';

// Tela de comentarios de um artigo publicado. Lista os comentarios (paginado),
// permite comentar e excluir apenas os proprios.
export default function CommentsScreen({ route }) {
  const { articleId } = route.params || {};
  const { user } = useAuth();
  const { notifyComment } = useNotifications();
  const {
    comments,
    loading,
    loadingMore,
    submitting,
    hasMore,
    reload,
    loadMore,
    add,
    remove,
  } = useComments(articleId);
  const [text, setText] = useState('');

  useEffect(() => {
    reload();
  }, [reload]);

  async function handleAdd() {
    const value = text.trim();
    if (!value) return;
    try {
      const result = await add(value);
      setText('');
      // Notificacao local ao autor: so dispara quando o autor do artigo e o
      // proprio usuario logado (unico alcancavel neste dispositivo).
      if (result?.notifyAuthorId === user?.id) {
        notifyComment(result.articleTitle);
      }
    } catch (err) {
      Alert.alert(
        'Erro',
        err.response?.data?.message || 'Nao foi possivel comentar.',
      );
    }
  }

  function handleDelete(id) {
    Alert.alert('Excluir comentario', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(id);
          } catch (err) {
            Alert.alert('Erro', 'Nao foi possivel excluir o comentario.');
          }
        },
      },
    ]);
  }

  function renderItem({ item }) {
    const isMine = item.authorId === user?.id;
    return (
      <Card style={styles.comment}>
        <View style={styles.commentHeader}>
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorAvatarText}>
                {(item.authorUsername || 'U')[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.author}>{item.authorUsername || 'Usuario'}</Text>
          </View>
          {isMine && (
            <Pressable onPress={() => handleDelete(item.id)} hitSlop={8}>
              <Text style={styles.delete}>Excluir</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.text}>{item.text}</Text>
        <View style={styles.commentFooter}>
          <LikeButton entity={item} type="comment" />
          <ReportButton entity={item} type="comment" />
        </View>
      </Card>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {loading ? (
        <ActivityIndicator style={styles.centered} size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={reload}
          onEndReachedThreshold={0.3}
          onEndReached={loadMore}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.empty}>
                Nenhum comentario ainda. Seja o primeiro!
              </Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={styles.footer} color={colors.primary} />
            ) : null
          }
        />
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Escreva um comentario..."
          placeholderTextColor={colors.textFaint}
          value={text}
          onChangeText={setText}
          multiline
          editable={!submitting}
        />
        <AppButton
          title="Enviar"
          size="sm"
          onPress={handleAdd}
          loading={submitting}
          disabled={!text.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
    flexGrow: 1,
  },
  comment: {
    marginBottom: 0,
    padding: spacing.lg,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  authorAvatar: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  author: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  delete: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '600',
  },
  text: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  centered: {
    marginTop: 48,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 64,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 15,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
  },
});
