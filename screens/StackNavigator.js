import { View, Text, StyleSheet, StatusBar, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Saved from './Saved';
import StatusImageModal from './components/StatusImageModal';
import { StatusContext } from '../StatusProvider';
import Gallery from './Gallery';
import HomeScreen from './HomeScreen';

const Stack = createMaterialTopTabNavigator();
const StackNavigator = ({navigation}) => {
    const windowWidth = Dimensions.get('window').width;
    const vw = value => (value / 100) * windowWidth;

    const hundredVw = {
        width: vw(100),
    };

    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
        }}
        // backBehavior={{ history }}
        // tabBarPosition={{ top }}
            tabBar={({ state, descriptors, navigation, position }) => {
                return (
                    <SafeAreaView style={[styles.container, hundredVw]}>
                        <StatusBar backgroundColor='#075e54' />
                        {state.routes.map((route, index) => {
                            const { options } = descriptors[route.key];
                            const label =
                                options.tabBarLabel !== undefined
                                    ? options.tabBarLabel
                                    : options.title !== undefined
                                        ? options.title
                                        : route.name;

                            const isFocused = state.index === index;

                            const onPress = () => {
                                const event = navigation.emit({
                                    type: 'tabPress',
                                    target: route.key,
                                    canPreventDefault: true,
                                });

                                if (!isFocused && !event.defaultPrevented) {
                                    // The `merge: true` option makes sure that the params inside the tab screen are preserved
                                    navigation.navigate({ name: route.name, merge: true });
                                }
                            };

                            const onLongPress = () => {
                                navigation.emit({
                                    type: 'tabLongPress',
                                    target: route.key,
                                });
                            };

                            const inputRange = state.routes.map((_, i) => i);
                            const opacity = position.interpolate({
                                inputRange,
                                outputRange: inputRange.map(i => (i === index ? 1 : 0)),
                            });
                            return (
                                <View style={[styles.header, hundredVw]}>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <Text style={styles.headerText}>Status Saver</Text>
                                    </View>
                                    <View style={styles.sectionContainer}>
                                        <TouchableOpacity
                                            accessibilityRole="button"
                                            accessibilityState={isFocused ? { selected: true } : {}}
                                            accessibilityLabel={options.tabBarAccessibilityLabel}
                                            onPress={onPress}
                                            onLongPress={onLongPress}
                                            style={{ flex: 1, width:100 }}
                                        >
                                            <Text>
                                                {label}
                                            </Text>

                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })}
                    </SafeAreaView>
                )
            }}>
            <>
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{tabBarLabel:'Statuses'}}/>
                <Stack.Screen name="Saved" component={Saved} options={{ tabBarLabel: 'Saved' }} />
                <Stack.Screen name="Gallery" component={Gallery} options={{ tabBarLabel: 'Gallery' }} />

                {/* <Stack.Screen name="StatusImageModal" component={StatusImageModal} /> */}
            </>
        </Stack.Navigator>
    )
}

export default StackNavigator

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height:100,
    },
    header: {
        paddingVertical: 10,
        marginTop: 20,
        paddingHorizontal: 10,
        backgroundColor: '#075e54',
        height: 80,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%'
    },
    topIcons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 120,
    },
    headerText: {
        fontSize: 20,
        color: '#fff',
    },
    sectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    sectionButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    sectionText: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    bottomBorder: {
        height: 3,
        width: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
    }
})