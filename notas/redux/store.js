import { configureStore } from "@reduxjs/toolkit";
import notasReducer, { setNotas } from "./notasSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const store = configureStore({
  reducer: {
    notas: notasReducer,
  },
});

// Cargar notas almacenadas en AsyncStorage al iniciar
AsyncStorage.getItem("notas").then((data) => {
  if (data) {
    store.dispatch(setNotas(JSON.parse(data)));
  }
});
