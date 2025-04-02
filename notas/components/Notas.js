import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { eliminarNota, setNotas } from "../redux/notasSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTema } from "../context/TemaContext";

const Notas = ({ navigation }) => {
  const notas = useSelector((state) => state.notas);
  const dispatch = useDispatch();
  const { modoOscuro, toggleModoOscuro } = useTema();

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
          dispatch(eliminarNota(id));
          const nuevasNotas = notas.filter(nota => nota.id !== id);
          await AsyncStorage.setItem("notas", JSON.stringify(nuevasNotas));
        } 
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: modoOscuro ? "#222" : "#f5f5f5" }]}>  
      <View style={styles.switchContainer}>
        <Text style={{ color: modoOscuro ? "white" : "black" }}>Cambiar Modo Oscuro</Text>
        <Switch value={modoOscuro} onValueChange={toggleModoOscuro} />
      </View>
      
      <FlatList
        data={notas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.nota, { backgroundColor: modoOscuro ? "#333" : "white" }]} 
            onPress={() => navigation.navigate("EditarNota", { nota: item })}
          >
            <Text style={[styles.titulo, { color: modoOscuro ? "white" : "black" }]}>{item.titulo}</Text>
            <Text style={{ color: modoOscuro ? "lightgray" : "black" }}>{item.contenido}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón flotante para agregar una nueva nota */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate("EditarNota", { nota: null })}
      > 
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  nota: { padding: 15, marginVertical: 8, borderRadius: 8, elevation: 2 },
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
