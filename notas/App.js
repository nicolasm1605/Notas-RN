import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setNotas } from "./redux/notasSlice";
import Notas from "./components/Notas";
import EditarNota from "./components/EditarNota";
import { TemaProvider } from "./context/TemaContext"; 
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

const InicializarNotas = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const cargarNotas = async () => {
      try {
        const notasGuardadas = await AsyncStorage.getItem("notas");

        if (notasGuardadas) {
          dispatch(setNotas(JSON.parse(notasGuardadas)));
        } else {
          // ✅ No agregamos ninguna nota inicial, solo dejamos la lista vacía
          dispatch(setNotas([]));
        }
      } catch (error) {
        console.error("Error al cargar las notas:", error);
      }
    };

    cargarNotas();
  }, [dispatch]);

  return children;
};

export default function App() {
  return (
    <Provider store={store}>
      <TemaProvider>
        <InicializarNotas>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Notas" component={Notas} />
              <Stack.Screen name="EditarNota" component={EditarNota} />
            </Stack.Navigator>
          </NavigationContainer>
        </InicializarNotas>
      </TemaProvider>
    </Provider>
  );
}
