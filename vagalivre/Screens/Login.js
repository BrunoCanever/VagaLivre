import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
// import { Ionicons } from '@expo/vector-icons';

export default function Login({ navigation }) {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    const EntrarConta = () => {
        signInWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user.uid);
                navigation.navigate('Inicial');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="E-Mail"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Campo de senha com olhinho */}
            <View style={styles.inputSenhaContainer}>
                <TextInput
                    style={styles.inputSenha}
                    placeholder="Senha"
                    placeholderTextColor="#888"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!senhaVisivel}
                />
    
            </View>

            <TouchableOpacity
                style={styles.botaoEntrar}
                onPress={EntrarConta}
            >
                <Text style={styles.textoBotao}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Cadastrar')}>
                <Text style={styles.linkCadastro}>
                    Não tem conta? <Text style={styles.linkNegrito}>Cadastre-se</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    titulo: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#00E5FF',
        marginBottom: 30,
    },
    input: {
        width: '85%',
        height: 50,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginVertical: 10,
        fontSize: 16,
        color: '#FFF',
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    // Container especial para o campo de senha com o ícone dentro
    inputSenhaContainer: {
        width: '85%',
        height: 50,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#00E5FF',
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputSenha: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#FFF',
    },
    olhinho: {
        paddingHorizontal: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoEntrar: {
        width: '85%',
        backgroundColor: '#1565C0',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 15,
        elevation: 8,
    },
    textoBotao: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkCadastro: {
        marginTop: 16,
        textAlign: 'center',
        color: '#555',
    },
    linkNegrito: {
        color: '#008080',
        fontWeight: 'bold',
    },
});