import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { agregarNota, editarNota, eliminarNota } from "../redux/notasSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const EditarNota = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { nota } = route.params || {};
  const [titulo, setTitulo] = useState(nota?.titulo || "");
  const [contenido, setContenido] = useState(nota?.contenido || "");

  const guardarNota = async () => {
    const nuevaNota = { id: nota?.id || Date.now().toString(), titulo, contenido };

    if (nota) {
      dispatch(editarNota(nuevaNota));
    } else {
      dispatch(agregarNota(nuevaNota));
    }

    // Guardar en AsyncStorage
    const notasGuardadas = await AsyncStorage.getItem("notas");
    const notas = notasGuardadas ? JSON.parse(notasGuardadas) : [];
    const nuevasNotas = nota ? notas.map(n => (n.id === nuevaNota.id ? nuevaNota : n)) : [...notas, nuevaNota];
    await AsyncStorage.setItem("notas", JSON.stringify(nuevasNotas));

    navigation.goBack();
  };

  const handleEliminarNota = async () => {
    if (nota) {
      dispatch(eliminarNota(nota.id));

      // Guardar en AsyncStorage después de eliminar
      const notasGuardadas = await AsyncStorage.getItem("notas");
      const notas = notasGuardadas ? JSON.parse(notasGuardadas) : [];
      const nuevasNotas = notas.filter(n => n.id !== nota.id);
      await AsyncStorage.setItem("notas", JSON.stringify(nuevasNotas));
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <TextInput style={styles.input} placeholder="Contenido" value={contenido} onChangeText={setContenido} multiline />
      <Button title="Guardar" onPress={guardarNota} />
      {nota && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleEliminarNota}>
          <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: { borderBottomWidth: 1, marginBottom: 15, fontSize: 18, padding: 10 },
  deleteButton: { backgroundColor: "red", padding: 15, marginTop: 10, borderRadius: 5, alignItems: "center" },
});

export default EditarNota;
