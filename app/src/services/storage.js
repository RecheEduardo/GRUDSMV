import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Persistencia segura do token de autenticacao no dispositivo.
// expo-secure-store nao tem implementacao nativa na web; nesse caso cai para
// localStorage, que e o equivalente disponivel no navegador.
const TOKEN_KEY = 'grudsmv.token';
const isWeb = Platform.OS === 'web';

export async function saveToken(token) {
  if (isWeb) {
    window.localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  if (isWeb) {
    return window.localStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  if (isWeb) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
