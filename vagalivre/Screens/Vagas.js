import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { database, auth } from '../firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

// Instale com: npx expo install react-native-calendars
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configurar calendário em português
LocaleConfig.locales['pt'] = {
    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
    dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
    today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt';

// Horas disponíveis para agendamento
const HORAS_DISPONIVEIS = [
    '06:00','07:00','08:00','09:00','10:00','11:00',
    '12:00','13:00','14:00','15:00','16:00','17:00',
    '18:00','19:00','20:00','21:00','22:00',
];

export default function Vagas({ navigation }) {

    const [modal, setModal] = useState(false);
    const [vagaSelecionada, setVagaSelecionada] = useState('');
    const [vagasOcupadas, setVagasOcupadas] = useState({});

    // Dados do veículo
    const [placa, setPlaca] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [cor, setCor] = useState('');
    const [proprietario, setProprietario] = useState('');

    // Agendamento
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFim, setHoraFim] = useState('');

    // Horários já reservados para a vaga/data selecionada
    const [horariosOcupados, setHorariosOcupados] = useState([]);
    const [todasReservas, setTodasReservas] = useState([]);

    // Etapa do modal: 'calendario' | 'horario' | 'dados'
    const [etapa, setEtapa] = useState('calendario');

    const uid = auth.currentUser?.uid;

    // Data mínima = hoje
    const hoje = new Date();
    const dataMinima = hoje.toISOString().split('T')[0];

    useEffect(() => {
        carregarVagas();
    }, []);

    async function carregarVagas() {
        try {
            // Carrega TODAS as reservas (de qualquer usuário) para bloquear vagas ocupadas
            const querySnapshot = await getDocs(collection(database, 'vagas'));

            let ocupadas = {};
            let reservas = [];

            querySnapshot.forEach((docSnap) => {
                const dados = docSnap.data();
                reservas.push({ id: docSnap.id, ...dados });

                // Marca como ocupada se for do usuário atual (para exibir no grid)
                if (dados.uid === uid) {
                    ocupadas[dados.vaga] = docSnap.id;
                }
            });

            setVagasOcupadas(ocupadas);
            setTodasReservas(reservas);

        } catch (error) {
            console.log('Erro ao carregar vagas:', error);
        }
    }

    function abrirModal(numeroVaga) {
        setVagaSelecionada(numeroVaga);
        setEtapa('calendario');
        setDataSelecionada('');
        setHoraInicio('');
        setHoraFim('');
        limparCampos();
        setModal(true);
    }

    function limparCampos() {
        setPlaca('');
        setMarca('');
        setModelo('');
        setCor('');
        setProprietario('');
    }

    // Quando seleciona uma data, verifica quais horários já estão ocupados nessa vaga+data
    function selecionarData(dia) {
        setDataSelecionada(dia.dateString);

        const ocupados = todasReservas
            .filter(r => r.vaga === vagaSelecionada && r.data === dia.dateString)
            .flatMap(r => {
                // Gera todos os slots ocupados entre horaInicio e horaFim da reserva
                const inicio = HORAS_DISPONIVEIS.indexOf(r.horaInicio);
                const fim = HORAS_DISPONIVEIS.indexOf(r.horaFim);
                return HORAS_DISPONIVEIS.slice(inicio, fim);
            });

        setHorariosOcupados(ocupados);
        setEtapa('horario');
    }

    function selecionarHoraInicio(hora) {
        setHoraInicio(hora);
        setHoraFim(''); // Reseta hora fim ao trocar início
    }

    // Horários de fim disponíveis: só depois da hora de início e que não conflitem
    function horasFimDisponiveis() {
        if (!horaInicio) return [];
        const indexInicio = HORAS_DISPONIVEIS.indexOf(horaInicio);

        return HORAS_DISPONIVEIS.slice(indexInicio + 1).filter(hora => {
            // Verifica se algum slot entre horaInicio e essa hora está ocupado
            const indexFim = HORAS_DISPONIVEIS.indexOf(hora);
            const slots = HORAS_DISPONIVEIS.slice(indexInicio, indexFim);
            return !slots.some(s => horariosOcupados.includes(s));
        });
    }

    function avancarParaDados() {
        if (!horaInicio || !horaFim) {
            Alert.alert('Atenção', 'Selecione o horário de início e fim.');
            return;
        }
        setEtapa('dados');
    }

    async function cadastrar() {
        if (!placa || !proprietario) {
            Alert.alert('Atenção', 'Preencha ao menos placa e proprietário');
            return;
        }

        try {
            const documento = await addDoc(collection(database, 'vagas'), {
                uid,
                vaga: vagaSelecionada,
                placa,
                marca,
                modelo,
                cor,
                proprietario,
                data: dataSelecionada,
                horaInicio,
                horaFim,
                tempo: `${dataSelecionada} | ${horaInicio} - ${horaFim}`,
            });

            setVagasOcupadas({
                ...vagasOcupadas,
                [vagaSelecionada]: documento.id
            });

            // Atualiza lista local de reservas também
            setTodasReservas([...todasReservas, {
                id: documento.id,
                uid,
                vaga: vagaSelecionada,
                data: dataSelecionada,
                horaInicio,
                horaFim,
            }]);

            Alert.alert('Sucesso', `Vaga ${vagaSelecionada} reservada!\n${dataSelecionada} das ${horaInicio} às ${horaFim}`);
            limparCampos();
            setModal(false);

        } catch (error) {
            console.error('Erro ao cadastrar vaga:', error);
            Alert.alert('Erro', 'Não foi possível cadastrar.');
        }
    }

    async function sairDaVaga() {
        try {
            const idDocumento = vagasOcupadas[vagaSelecionada];

            if (!idDocumento) {
                Alert.alert('Aviso', 'Você não possui reserva nesta vaga.');
                return;
            }

            await deleteDoc(doc(database, 'vagas', idDocumento));

            const novasVagas = { ...vagasOcupadas };
            delete novasVagas[vagaSelecionada];
            setVagasOcupadas(novasVagas);

            setTodasReservas(todasReservas.filter(r => r.id !== idDocumento));

            Alert.alert('Sucesso', 'Vaga liberada!');
            limparCampos();
            setModal(false);

        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível liberar a vaga.');
        }
    }

    // Marca no calendário os dias que já têm pelo menos um slot ocupado nessa vaga
    function diasMarcados() {
        const marcados = {};
        todasReservas
            .filter(r => r.vaga === vagaSelecionada)
            .forEach(r => {
                marcados[r.data] = {
                    marked: true,
                    dotColor: '#FF5252',
                };
            });
        if (dataSelecionada) {
            marcados[dataSelecionada] = {
                ...marcados[dataSelecionada],
                selected: true,
                selectedColor: '#1565C0',
            };
        }
        return marcados;
    }

    return (
        <View style={styles.container}>

            <View style={styles.grid}>
                {[...Array(12)].map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.vaga,
                            { backgroundColor: vagasOcupadas[index + 1] ? '#D32F2F' : '#1565C0' }
                        ]}
                        onPress={() => abrirModal(index + 1)}
                    >
                        <Text style={styles.textoVaga}>Vaga {index + 1}</Text>
                        <Text style={styles.textoVagaStatus}>
                            {vagasOcupadas[index + 1] ? '🔴 Parcialmente Ocupada' : '🟢 Livre'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Modal visible={modal} animationType='slide' transparent>
                <View style={styles.fundoModal}>
                    <View style={styles.modal}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <Text style={styles.titulo}>
                                Vaga {vagaSelecionada}
                            </Text>

                            {/* ── ETAPA 1: CALENDÁRIO ── */}
                            {etapa === 'calendario' && (
                                <View>
                                    <Text style={styles.subtitulo}>Selecione o dia</Text>
                                    <Calendar
                                        minDate={dataMinima}
                                        onDayPress={selecionarData}
                                        markedDates={diasMarcados()}
                                        theme={{
                                            backgroundColor: '#fff',
                                            calendarBackground: '#fff',
                                            selectedDayBackgroundColor: '#1565C0',
                                            selectedDayTextColor: '#fff',
                                            todayTextColor: '#1565C0',
                                            dayTextColor: '#222',
                                            dotColor: '#FF5252',
                                            arrowColor: '#1565C0',
                                            monthTextColor: '#1565C0',
                                            textMonthFontWeight: 'bold',
                                        }}
                                    />
                                    <Text style={styles.legenda}>
                                        🔴 Ponto vermelho = dia com horários parcialmente ocupados
                                    </Text>
                                </View>
                            )}

                            {/* ── ETAPA 2: HORÁRIOS ── */}
                            {etapa === 'horario' && (
                                <View>
                                    <Text style={styles.subtitulo}>
                                        {dataSelecionada} — Horário de entrada
                                    </Text>
                                    <View style={styles.horasGrid}>
                                        {HORAS_DISPONIVEIS.map(hora => {
                                            const ocupado = horariosOcupados.includes(hora);
                                            const selecionado = horaInicio === hora;
                                            return (
                                                <TouchableOpacity
                                                    key={hora}
                                                    disabled={ocupado}
                                                    onPress={() => selecionarHoraInicio(hora)}
                                                    style={[
                                                        styles.horaBotao,
                                                        ocupado && styles.horaOcupada,
                                                        selecionado && styles.horaSelecionada,
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.horaTexto,
                                                        ocupado && { color: '#999' },
                                                        selecionado && { color: '#fff' },
                                                    ]}>
                                                        {hora}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                    {horaInicio !== '' && (
                                        <>
                                            <Text style={[styles.subtitulo, { marginTop: 16 }]}>
                                                Horário de saída
                                            </Text>
                                            <View style={styles.horasGrid}>
                                                {horasFimDisponiveis().map(hora => {
                                                    const selecionado = horaFim === hora;
                                                    return (
                                                        <TouchableOpacity
                                                            key={hora}
                                                            onPress={() => setHoraFim(hora)}
                                                            style={[
                                                                styles.horaBotao,
                                                                selecionado && styles.horaSelecionada,
                                                            ]}
                                                        >
                                                            <Text style={[
                                                                styles.horaTexto,
                                                                selecionado && { color: '#fff' },
                                                            ]}>
                                                                {hora}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </>
                                    )}

                                    {horaInicio && horaFim && (
                                        <View style={styles.resumoHorario}>
                                            <Text style={styles.resumoTexto}>
                                                ✅ {dataSelecionada} das {horaInicio} às {horaFim}
                                            </Text>
                                        </View>
                                    )}

                                    <View style={styles.botoesNavegacao}>
                                        <TouchableOpacity
                                            style={styles.botaoVoltar2}
                                            onPress={() => setEtapa('calendario')}
                                        >
                                            <Text style={styles.textoBotao}>← Voltar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.botaoAvancar, (!horaInicio || !horaFim) && { opacity: 0.4 }]}
                                            onPress={avancarParaDados}
                                        >
                                            <Text style={styles.textoBotao}>Continuar →</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            {/* ── ETAPA 3: DADOS DO VEÍCULO ── */}
                            {etapa === 'dados' && (
                                <View>
                                    <View style={styles.resumoHorario}>
                                        <Text style={styles.resumoTexto}>
                                            📅 {dataSelecionada} | ⏰ {horaInicio} – {horaFim}
                                        </Text>
                                    </View>

                                    <Text style={styles.subtitulo}>Dados do veículo</Text>

                                    <TextInput
                                        placeholder='Proprietário *'
                                        style={styles.input}
                                        value={proprietario}
                                        onChangeText={setProprietario}
                                        placeholderTextColor='#999'
                                    />
                                    <TextInput
                                        placeholder='Placa *'
                                        style={styles.input}
                                        value={placa}
                                        onChangeText={setPlaca}
                                        autoCapitalize='characters'
                                        placeholderTextColor='#999'
                                    />
                                    <TextInput
                                        placeholder='Marca'
                                        style={styles.input}
                                        value={marca}
                                        onChangeText={setMarca}
                                        placeholderTextColor='#999'
                                    />
                                    <TextInput
                                        placeholder='Modelo'
                                        style={styles.input}
                                        value={modelo}
                                        onChangeText={setModelo}
                                        placeholderTextColor='#999'
                                    />
                                    <TextInput
                                        placeholder='Cor'
                                        style={styles.input}
                                        value={cor}
                                        onChangeText={setCor}
                                        placeholderTextColor='#999'
                                    />

                                    <TouchableOpacity style={styles.botaoSalvar} onPress={cadastrar}>
                                        <Text style={styles.textoBotao}>✅ Confirmar Reserva</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.botaoVoltar2}
                                        onPress={() => setEtapa('horario')}
                                    >
                                        <Text style={styles.textoBotao}>← Voltar</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Sair da vaga (disponível em qualquer etapa se tiver reserva) */}
                            {vagasOcupadas[vagaSelecionada] && (
                                <TouchableOpacity
                                    style={styles.botaoSair}
                                    onPress={sairDaVaga}
                                >
                                    <Text style={styles.textoBotao}>🚪 Liberar Minha Vaga</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={styles.botaoCancelar}
                                onPress={() => setModal(false)}
                            >
                                <Text style={styles.textoBotao}>Fechar</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a1628',
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '90%',
    },
    vaga: {
        width: '30%',
        height: 85,
        marginBottom: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoVaga: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    textoVagaStatus: {
        color: '#FFF',
        fontSize: 11,
        marginTop: 4,
    },
    fundoModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: '#FFF',
        margin: 16,
        borderRadius: 16,
        padding: 20,
        maxHeight: '90%',
    },
    titulo: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#1565C0',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitulo: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#333',
        marginBottom: 10,
    },
    legenda: {
        fontSize: 12,
        color: '#888',
        marginTop: 8,
        textAlign: 'center',
    },
    horasGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    horaBotao: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1565C0',
        backgroundColor: '#fff',
    },
    horaOcupada: {
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
    },
    horaSelecionada: {
        backgroundColor: '#1565C0',
        borderColor: '#1565C0',
    },
    horaTexto: {
        fontSize: 13,
        color: '#1565C0',
        fontWeight: '600',
    },
    resumoHorario: {
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
        padding: 10,
        marginVertical: 12,
        alignItems: 'center',
    },
    resumoTexto: {
        color: '#1565C0',
        fontWeight: 'bold',
        fontSize: 14,
    },
    botoesNavegacao: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 14,
        color: '#222',
    },
    botaoSalvar: {
        backgroundColor: '#2E7D32',
        padding: 13,
        borderRadius: 10,
        marginTop: 8,
        alignItems: 'center',
    },
    botaoSair: {
        backgroundColor: '#FF9800',
        padding: 13,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    botaoCancelar: {
        backgroundColor: '#C62828',
        padding: 13,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    botaoVoltar2: {
        flex: 1,
        backgroundColor: '#546E7A',
        padding: 13,
        borderRadius: 10,
        alignItems: 'center',
    },
    botaoAvancar: {
        flex: 1,
        backgroundColor: '#1565C0',
        padding: 13,
        borderRadius: 10,
        alignItems: 'center',
    },
    textoBotao: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
    },
});