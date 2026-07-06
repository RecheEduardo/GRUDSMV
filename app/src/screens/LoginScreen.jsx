import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppButton from '../components/AppButton';
import TextField from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing, typography } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      // Ao autenticar, o AppNavigator troca para as telas logadas.
    } catch (err) {
      setError(err.response?.data?.message || 'Nao foi possivel entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>G</Text>
          </View>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Entre para continuar lendo e publicando</Text>
        </View>

        <View style={styles.card}>
          <TextField
            label="E-mail"
            placeholder="voce@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Senha"
            placeholder="Sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <AppButton
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={styles.submit}
          />
        </View>

        <Pressable style={styles.link} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>
            Nao tem conta? <Text style={styles.linkStrong}>Cadastre-se</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  brand: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '800',
  },
  title: { ...typography.title, textAlign: 'center' },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontWeight: '500',
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
  link: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  linkText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  linkStrong: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
});
