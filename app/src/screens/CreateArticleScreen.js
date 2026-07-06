import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { createArticle, updateArticle } from '../services/articles';

// Formulario de artigo reaproveitado para criar e editar.
// Modo edicao quando route.params.article esta presente.
export default function CreateArticleScreen({ navigation, route }) {
  const editing = route.params?.article ?? null;

  const [title, setTitle] = useState(editing?.title ?? '');
  const [content, setContent] = useState(editing?.content ?? '');
  const [tags, setTags] = useState((editing?.tags ?? []).join(', '));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setError(null);
    setLoading(true);
    try {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const payload = {
        title: title.trim(),
        content: content.trim(),
        tags: parsedTags,
      };
      if (editing) {
        await updateArticle(editing.id, payload);
      } else {
        await createArticle(payload);
      }
      // Volta para a lista, que recarrega ao ganhar foco.
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Nao foi possivel salvar o artigo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Titulo</Text>
      <TextInput
        style={styles.input}
        placeholder="Titulo do artigo"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Conteudo</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Escreva o conteudo..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>Tags (separadas por virgula)</Text>
      <TextInput
        style={styles.input}
        placeholder="ex.: node, express"
        autoCapitalize="none"
        value={tags}
        onChangeText={setTags}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.action}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button
            title={editing ? 'Salvar alteracoes' : 'Salvar rascunho'}
            onPress={handleSave}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textarea: {
    minHeight: 140,
  },
  error: {
    color: '#c5221f',
    marginTop: 16,
    textAlign: 'center',
  },
  action: {
    marginTop: 24,
  },
});
