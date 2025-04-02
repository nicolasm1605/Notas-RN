import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { eliminarNota, setNotas } from "../redux/notasSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Notas = ({ navigation }) => {
  const notas = useSelector((state) => state.notas);
  const dispatch = useDispatch();

  // Cargar notas desde AsyncStorage al iniciar
  useEffect(() => {
    const cargarNotas = async () => {
      const notasGuardadas = await AsyncStorage.getItem("notas");
      if (notasGuardadas) {
        dispatch(setNotas(JSON.parse(notasGuardadas)));
      }
    };
    cargarNotas();
  }, []);

  const handleEliminarNota = (id) => {
    Alert.alert("Eliminar Nota", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Eliminar", 
        onPress: async () => {
          dispatch(eliminarNota(id)); // Actualizar Redux
          
          // Guardar la nueva lista en AsyncStorage
          const nuevasNotas = notas.filter(nota => nota.id !== id);
          await AsyncStorage.setItem("notas", JSON.stringify(nuevasNotas));
        } 
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.nota} onPress={() => navigation.navigate("EditarNota", { nota: item })}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text>{item.contenido}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("EditarNota")}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#D3D3D3" },
  nota: { backgroundColor: "white", padding: 15, marginVertical: 8, borderRadius: 8, elevation: 2 },
  titulo: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});

export default Notas;