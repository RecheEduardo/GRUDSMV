import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';

// Stack de navegacao principal. Novas telas (Login, Feed, ...) entram aqui
// a partir dos proximos commits.
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'GRUDSMV' }}
      />
    </Stack.Navigator>
  );
}
