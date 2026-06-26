import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './Screens/Login';
import Clientes from './Screens/Clientes';
import Vagas from './Screens/Vagas';
import Cadastrar from './Screens/Cadastrar';
import Perfil from './Screens/Perfil';
import Pagamento from './Screens/Pagamento';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1565C0',
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },

        
        tabBarStyle: {
          backgroundColor: '#00142E',
          height: 70,
          borderTopWidth: 0,
          elevation: 10,
          paddingTop: 5,
          paddingBottom: 5,
        },

        tabBarItemStyle: {
          borderRadius: 15,
          marginHorizontal: 5,
          marginVertical: 5,
        },

        tabBarActiveBackgroundColor: '#1565C0',

        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#A0AEC0',

        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Vagas"
        component={Vagas}
        options={{
          title: 'Vagas',
        }}
      />

      <Tab.Screen
        name="Clientes"
        component={Clientes}
        options={{
          title: 'Clientes',
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          title: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Login',
            headerStyle: {
              backgroundColor: '#1565C0',
            },
            headerTintColor: '#FFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />


        <Stack.Screen
          name="Cadastrar"
          component={Cadastrar}
          options={{
            title: 'Cadastrar',
            headerStyle: {
              backgroundColor: '#1565C0',
            },
            headerTintColor: '#FFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <Stack.Screen
          name="Home"
          component={BottomTabs}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Pagamento"
          component={Pagamento}
          options={{
            title: 'Pagamento',
            headerStyle: {
              backgroundColor: '#1565C0',
            },
            headerTintColor: '#FFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}