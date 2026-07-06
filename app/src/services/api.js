import axios from 'axios';
import Constants from 'expo-constants';

// Porta do backend (ver /backend/.env.example).
const BACKEND_PORT = 3000;

// Descobre o host da maquina de desenvolvimento.
// Em Expo Go (device fisico), o backend nao esta em "localhost" do celular,
// entao reaproveitamos o host do proprio bundler (hostUri) para acha-lo na LAN.
function resolveBaseUrl() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:${BACKEND_PORT}`;
  }

  // Fallback: emulador Android acessa o localhost da maquina via 10.0.2.2.
  return `http://10.0.2.2:${BACKEND_PORT}`;
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000,
});

export default api;
