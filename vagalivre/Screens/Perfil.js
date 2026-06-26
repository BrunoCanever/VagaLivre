import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { database, auth } from '../firebaseConfig';

export default function Perfil({ navigation }) {

    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        const uid = auth.currentUser?.uid;

        const q = query(
            collection(database, 'vagas'),
            where('uid', '==', uid)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({ id: doc.id, ...doc.data() });
            });
            setReservas(lista);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>

            <Text style={styles.titulo}>Suas Reservas</Text>

            <FlatList
                data={reservas}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.vazio}>Você não possui reservas ativas.</Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.texto}>Proprietário: {item.proprietario}</Text>
                        <Text style={styles.texto}>Placa: {item.placa}</Text>
                        <Text style={styles.texto}>Marca: {item.marca}</Text>
                        <Text style={styles.texto}>Modelo: {item.modelo}</Text>
                        <Text style={styles.texto}>Cor: {item.cor}</Text>
                        <Text style={styles.texto}>Vaga: {item.vaga}</Text>
                        <Text style={styles.texto}>Data: {item.data}</Text>
                        <Text style={styles.texto}>Horário: {item.horaInicio} – {item.horaFim}</Text>

                        <TouchableOpacity
                            style={styles.botao}
                            onPress={() => navigation.navigate('Pagamento', {
                                horaInicio: item.horaInicio,
                                horaFim: item.horaFim,
                            })}
                        >
                            <Text style={styles.botaoTexto}>Pagamento</Text>
                        </TouchableOpacity>
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
    botao: {
        backgroundColor: '#00E5FF',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    botaoTexto: {
        color: '#0a1628',
        fontSize: 15,
        fontWeight: 'bold',
    },
});