import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setNotas } from "./redux/notasSlice";
import Notas from "./components/Notas";
import EditarNota from "./components/EditarNota";

const Stack = createStackNavigator();

// Componente que carga las notas al iniciar la app
const InicializarNotas = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const cargarNotas = async () => {
      const notasGuardadas = await AsyncStorage.getItem("notas");
      if (notasGuardadas) {
        dispatch(setNotas(JSON.parse(notasGuardadas)));
      }
    };
    cargarNotas();
  }, []);

  return children;
};

export default function App() {
  return (
    <Provider store={store}>
      <InicializarNotas>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Notas" component={Notas} />
            <Stack.Screen name="EditarNota" component={EditarNota} />
          </Stack.Navigator>
        </NavigationContainer>
      </InicializarNotas>
    </Provider>
  );
}
