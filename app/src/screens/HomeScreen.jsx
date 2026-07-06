import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '../components/AppButton';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { colors, radius, spacing, typography } from '../theme';

// Itens do menu principal. Os marcados como admin so aparecem para ADMIN.
const MENU = [
  { icon: '📰', title: 'Feed', subtitle: 'Artigos publicados', route: 'Feed' },
  { icon: '✍️', title: 'Meus Artigos', subtitle: 'Escreva e gerencie', route: 'MyArticles' },
  { icon: '🔥', title: 'Artigos Populares', subtitle: 'Os mais curtidos', route: 'PopularArticles' },
  { icon: '💬', title: 'Comentarios em Alta', subtitle: 'Os mais curtidos', route: 'TopComments' },
  { icon: '🛡️', title: 'Moderacao', subtitle: 'Fila de revisao', route: 'Moderation', admin: true },
  { icon: '📊', title: 'Estatisticas', subtitle: 'Numeros por usuario', route: 'Stats', admin: true },
];

// Tela inicial (logado). Painel com atalhos para as areas do app.
export default function HomeScreen({ navigation }) {
  const { user, isAdmin, logout } = useAuth();
  const [status, setStatus] = useState(null);

  async function checkHealth() {
    try {
      const { data } = await api.get('/health');
      setStatus(`online (${data.status})`);
    } catch (err) {
      setStatus('offline');
    }
  }

  const items = MENU.filter((item) => !item.admin || isAdmin);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.greeting}>Ola, {user?.username}</Text>
          <View style={styles.roleChip}>
            <Text style={styles.roleText}>{user?.role}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menu}>
        {items.map((item) => (
          <Card
            key={item.route}
            style={styles.menuCard}
            onPress={() => navigation.navigate(item.route)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Card>
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable onPress={checkHealth} style={styles.healthRow}>
          <Text style={styles.healthText}>
            Backend: {status || 'toque para verificar'}
          </Text>
        </Pressable>
        <AppButton title="Sair" variant="ghost" onPress={logout} />
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
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  avatarText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    ...typography.heading,
    marginBottom: spacing.xs,
  },
  roleChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  roleText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  menu: {
    gap: spacing.md,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  menuIcon: {
    fontSize: 26,
    marginRight: spacing.lg,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 26,
    color: colors.textFaint,
    fontWeight: '400',
  },
  footer: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  healthRow: {
    alignItems: 'center',
  },
  healthText: {
    ...typography.caption,
    fontSize: 13,
  },
});
