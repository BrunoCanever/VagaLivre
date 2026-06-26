import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Pagamento({ route }) {

    
    const { horaInicio, horaFim } = route.params;

   
    function calcularHoras(inicio, fim) {
        const [hInicio, mInicio] = inicio.split(':').map(Number); 
        const [hFim, mFim] = fim.split(':').map(Number);           

        const minutosInicio = hInicio * 60 + mInicio; 
        const minutosFim = hFim * 60 + mFim;

        const diferencaMinutos = minutosFim - minutosInicio;
        const horas = diferencaMinutos / 60;

        return horas;
    }

    const horas = calcularHoras(horaInicio, horaFim);
    const valorPorHora = 5;
    const total = horas * valorPorHora;

    return (
        <View style={styles.container}>

            <Text style={styles.titulo}>Pagamento via Pix</Text>

            <View style={styles.resumo}>
                <Text style={styles.resumoTexto}>Horário: {horaInicio} – {horaFim}</Text>
                <Text style={styles.resumoTexto}>Valor Hora: 5 reais</Text>
                <Text style={styles.resumoTexto}>Total de horas: {horas}h</Text>

                <Text style={styles.valor}>Total a pagar: R$ {total.toFixed(2)}</Text>
            </View>

            <Text style={styles.instrucao}>Escaneie o QR Code para pagar:</Text>

            <Image
                source={require('../assets/qrcode.jpeg')}
                style={styles.qrcode}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a1628',
        alignItems: 'center',
        padding: 20,
    },
    titulo: {
        color: '#00E5FF',
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 20,
    },
    resumo: {
        backgroundColor: '#1E2A3A',
        borderRadius: 15,
        padding: 15,
        width: '100%',
        marginBottom: 20,
        borderLeftWidth: 5,
        borderLeftColor: '#00E5FF',
    },
    resumoTexto: {
        color: '#FFF',
        fontSize: 15,
        marginBottom: 5,
    },
    valor: {
        color: '#00E5FF',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
    instrucao: {
        color: '#B0BEC5',
        fontSize: 14,
        marginBottom: 15,
    },
    qrcode: {
        width: 280,
        height: 300,
        marginBottom: 25,
    },
    card: {
        backgroundColor: '#1E2A3A',
        borderRadius: 15,
        padding: 15,
        width: '100%',
        alignItems: 'center',
        borderLeftWidth: 5,
        borderLeftColor: '#00E5FF',
    },
});