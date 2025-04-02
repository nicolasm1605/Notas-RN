import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const cargarNotas = async () => {
  const notasGuardadas = await AsyncStorage.getItem("notas");
  return notasGuardadas ? JSON.parse(notasGuardadas) : [];
};

export const notasSlice = createSlice({
  name: "notas",
  initialState: [],
  reducers: {
    setNotas: (state, action) => action.payload, // Cargar notas en el inicio
    agregarNota: (state, action) => {
      const nuevasNotas = [...state, action.payload];
      AsyncStorage.setItem("notas", JSON.stringify(nuevasNotas)); // Guardar en almacenamiento
      return nuevasNotas;
    },
    editarNota: (state, action) => {
      const nuevasNotas = state.map(nota => 
        nota.id === action.payload.id ? action.payload : nota
      );
      AsyncStorage.setItem("notas", JSON.stringify(nuevasNotas)); // Guardar en almacenamiento
      return nuevasNotas;
    },
    eliminarNota: (state, action) => {
      const nuevasNotas = state.filter(nota => nota.id !== action.payload);
      AsyncStorage.setItem("notas", JSON.stringify(nuevasNotas)); // Guardar en almacenamiento
      return nuevasNotas;
    },
  },
});

export const { setNotas, agregarNota, editarNota, eliminarNota } = notasSlice.actions;
export default notasSlice.reducer;
