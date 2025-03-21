import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import BookDetailsScreen from './screens/BookDetailsScreen';
import BorrowedBooksScreen from './screens/BorrowedBooksScreen';
import { Ionicons } from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Book Details (if needed)
function BookStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'BorrowedBooks') {
              iconName = 'book-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={BookStack} options={{ headerShown: false }}  />
        <Tab.Screen name="BorrowedBooks" component={BorrowedBooksScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
