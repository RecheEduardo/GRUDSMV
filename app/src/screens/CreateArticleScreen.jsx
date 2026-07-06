import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '../components/AppButton';
import TextField from '../components/TextField';
import { useCreateArticle } from '../hooks/useCreateArticle';
import { colors, radius, spacing } from '../theme';

// Formulario de artigo reaproveitado para criar e editar.
// Modo edicao quando route.params.article esta presente.
export default function CreateArticleScreen({ navigation, route }) {
  const editing = route.params?.article ?? null;

  const [title, setTitle] = useState(editing?.title ?? '');
  const [content, setContent] = useState(editing?.content ?? '');
  const [tags, setTags] = useState((editing?.tags ?? []).join(', '));
  const { save, loading, error } = useCreateArticle();

  async function handleSave() {
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
      await save(payload, editing);
      // Volta para a lista, que recarrega ao ganhar foco.
      navigation.goBack();
    } catch (err) {
      // Erro ja fica disponivel em `error` para exibicao.
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <TextField
          label="Titulo"
          placeholder="Titulo do artigo"
          value={title}
          onChangeText={setTitle}
        />
        <TextField
          label="Conteudo"
          placeholder="Escreva o conteudo..."
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TextField
          label="Tags (separadas por virgula)"
          placeholder="ex.: node, express"
          autoCapitalize="none"
          value={tags}
          onChangeText={setTags}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <AppButton
          title={editing ? 'Salvar alteracoes' : 'Salvar rascunho'}
          onPress={handleSave}
          loading={loading}
          style={styles.submit}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  submit: {
    marginTop: spacing.sm,
  },
});
