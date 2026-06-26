import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


export default function Cadastrar({ navigation }) {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    const auth = getAuth();

    const CriarConta = () => {
        createUserWithEmailAndPassword(auth, email, senha)
             .then((userCredential) => {          
                console.log('Conta criada');
                const user = userCredential.user;  
                console.log(user);
                navigation.navigate('Inicial');
            })
            .catch((error) => {                   
                console.log(error);
            });
    };

    const EntrarConta = () => {
        signInWithEmailAndPassword(auth, email, senha) 
            .then((userCredential) => {                
                const user = userCredential.user;      
                console.log(user);  
                navigation.navigate('Inicial');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Cadastrar</Text>

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
                onPress={CriarConta}
            >
                <Text style={styles.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.botaoEntrar, { backgroundColor: '#0D47A1', marginTop: 10 }]}
                onPress={EntrarConta}
            >
                <Text style={styles.textoBotao}>Já tenho conta — Entrar</Text>
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
});