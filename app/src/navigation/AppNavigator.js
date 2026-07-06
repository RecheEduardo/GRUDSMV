import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import CommentsScreen from '../screens/CommentsScreen';
import CreateArticleScreen from '../screens/CreateArticleScreen';
import FeedScreen from '../screens/FeedScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ModerationScreen from '../screens/ModerationScreen';
import MyArticlesScreen from '../screens/MyArticlesScreen';
import RegisterScreen from '../screens/RegisterScreen';
import StatsScreen from '../screens/StatsScreen';

// Stack principal. Enquanto nao houver usuario autenticado, mostra o fluxo
// de Login/Cadastro; apos autenticar, mostra as telas logadas.
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, isAdmin, initializing } = useAuth();

  // Enquanto restaura a sessao do dispositivo, mostra um loading.
  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'GRUDSMV' }}
          />
          <Stack.Screen
            name="Feed"
            component={FeedScreen}
            options={{ title: 'Feed' }}
          />
          <Stack.Screen
            name="ArticleDetail"
            component={ArticleDetailScreen}
            options={{ title: 'Artigo' }}
          />
          <Stack.Screen
            name="Comments"
            component={CommentsScreen}
            options={{ title: 'Comentarios' }}
          />
          <Stack.Screen
            name="MyArticles"
            component={MyArticlesScreen}
            options={{ title: 'Meus Artigos' }}
          />
          <Stack.Screen
            name="CreateArticle"
            component={CreateArticleScreen}
            options={({ route }) => ({
              title: route.params?.article ? 'Editar Artigo' : 'Novo Artigo',
            })}
          />
          {isAdmin && (
            <Stack.Screen
              name="Moderation"
              component={ModerationScreen}
              options={{ title: 'Moderacao' }}
            />
          )}
          {isAdmin && (
            <Stack.Screen
              name="Stats"
              component={StatsScreen}
              options={{ title: 'Estatisticas' }}
            />
          )}
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Entrar' }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Criar conta' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
