import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useComments } from '../hooks/useComments';

// Tela de comentarios de um artigo publicado. Lista os comentarios (paginado),
// permite comentar e excluir apenas os proprios.
export default function CommentsScreen({ route }) {
  const { articleId } = route.params || {};
  const { user } = useAuth();
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
      await add(value);
      setText('');
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
      <View style={styles.comment}>
        <View style={styles.commentHeader}>
          <Text style={styles.author}>{item.authorUsername || 'Usuario'}</Text>
          {isMine && (
            <Pressable onPress={() => handleDelete(item.id)} hitSlop={8}>
              <Text style={styles.delete}>Excluir</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {loading ? (
        <ActivityIndicator style={styles.centered} size="large" />
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
            <Text style={styles.empty}>
              Nenhum comentario ainda. Seja o primeiro!
            </Text>
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator style={styles.footer} /> : null
          }
        />
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Escreva um comentario..."
          value={text}
          onChangeText={setText}
          multiline
          editable={!submitting}
        />
        {submitting ? (
          <ActivityIndicator style={styles.sendLoading} />
        ) : (
          <Button title="Enviar" onPress={handleAdd} disabled={!text.trim()} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  comment: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  delete: {
    fontSize: 13,
    color: '#c5221f',
    fontWeight: '600',
  },
  text: {
    fontSize: 15,
    color: '#444',
    lineHeight: 21,
  },
  centered: {
    marginTop: 40,
  },
  footer: {
    paddingVertical: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  sendLoading: {
    paddingHorizontal: 12,
  },
});
