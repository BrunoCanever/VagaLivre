import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { collection, onSnapshot } from 'firebase/firestore';
import { database } from '../firebaseConfig';

export default function Clientes({ navigation }) {

    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        // onSnapshot fica ouvindo o Firestore em tempo real
        const unsubscribe = onSnapshot(
            collection(database, 'vagas'),
            (querySnapshot) => {
                let lista = [];
                querySnapshot.forEach((doc) => {
                    lista.push({ id: doc.id, ...doc.data() });
                });
                setClientes(lista);
            },
            (error) => {
                console.log('Erro ao ouvir clientes:', error);
            }
        );

        // Cancela o listener quando a tela for desmontada
        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>

            <Text style={styles.titulo}>
                Clientes Cadastrados
            </Text>

            <FlatList
                data={clientes}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.vazio}>Nenhum cliente cadastrado.</Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.texto}>Proprietário: {item.proprietario}</Text>
                        <Text style={styles.texto}>Placa: {item.placa}</Text>
                        <Text style={styles.texto}>Marca: {item.marca}</Text>
                        <Text style={styles.texto}>Modelo: {item.modelo}</Text>
                        <Text style={styles.texto}>Cor: {item.cor}</Text>
                        <Text style={styles.texto}>Vaga: {item.vaga}</Text>
                        <Text style={styles.texto}>Tempo: {item.tempo}</Text>
                    </View>
                )}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a1628',
        padding: 20,
    },
    titulo: {
        color: '#00E5FF',
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    card: {
        backgroundColor: '#1E2A3A',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 5,
        borderLeftColor: '#00E5FF',
    },
    texto: {
        color: '#FFF',
        fontSize: 15,
        marginBottom: 5,
    },
    vazio: {
        color: '#B0BEC5',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 15,
    },
});