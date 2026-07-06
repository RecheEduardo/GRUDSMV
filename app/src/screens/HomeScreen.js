import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Tela inicial (logado). Sauda o usuario e mantem o health-check do backend.
export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function checkHealth() {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const { data } = await api.get('/health');
      setStatus(data.status);
    } catch (err) {
      setError('Falha ao conectar ao backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ola, {user?.username}!</Text>
      <Text style={styles.subtitle}>Perfil: {user?.role}</Text>

      <View style={styles.action}>
        <Button
          title="Meus Artigos"
          onPress={() => navigation.navigate('MyArticles')}
        />
      </View>

      <View style={styles.action}>
        <Button title="Verificar backend (/health)" onPress={checkHealth} />
      </View>

      {loading && <ActivityIndicator style={styles.feedback} />}
      {status && (
        <Text style={[styles.feedback, styles.ok]}>Backend respondeu: {status}</Text>
      )}
      {error && <Text style={[styles.feedback, styles.error]}>{error}</Text>}

      <View style={styles.logout}>
        <Button title="Sair" color="#c5221f" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  action: {
    width: '100%',
    maxWidth: 320,
    marginVertical: 6,
  },
  feedback: {
    marginTop: 16,
    fontSize: 16,
  },
  ok: {
    color: '#137333',
    fontWeight: '600',
  },
  error: {
    color: '#c5221f',
    fontWeight: '600',
  },
  logout: {
    marginTop: 32,
    width: '100%',
    maxWidth: 320,
  },
});
