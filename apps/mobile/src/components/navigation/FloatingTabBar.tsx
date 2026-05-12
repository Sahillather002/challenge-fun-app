import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useTheme } from '@/theme/useTheme';
import { useThemeStore } from '@/theme/themeStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export function FloatingTabBar({ state, descriptors, navigation }: any) {
    const theme = useTheme();
    const mode = useThemeStore((s) => s.mode);
    const insets = useSafeAreaInsets();

    const totalTabs = state.routes.length;
    const tabWidth = (width - 40) / totalTabs; // 40 is total horizontal margin

    return (
        <View style={[styles.container, { bottom: insets.bottom + 10 }]}>
            <BlurView
                intensity={100}
                tint="dark"
                style={styles.blurContainer}
            >
                {/* Active Indicator Circle */}
                <MotiView
                    animate={{
                        translateX: (state.index * tabWidth) + (tabWidth / 2) - 25,
                    }}
                    transition={{
                        type: 'spring',
                        damping: 50,
                        stiffness: 200,
                    }}
                    style={[
                        styles.indicator,
                        {
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: '#4ADE8020',
                            borderColor: '#4ADE8080',
                            borderWidth: 1.5,
                            top: 7,
                            overflow: 'hidden', // Kill the square edges
                        }
                    ]}
                >
                    <LinearGradient
                        colors={['#4ADE8030', 'transparent']}
                        style={[StyleSheet.absoluteFill, { borderRadius: 25 }]}
                    />
                    <View style={[styles.glow, { shadowColor: '#4ADE80', borderRadius: 25 }]} />
                </MotiView>

                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const Icon = options.tabBarIcon;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <MotiView
                                animate={{
                                    scale: isFocused ? 1.05 : 1,
                                    translateY: isFocused ? -1 : 0,
                                }}
                                transition={{
                                    type: 'timing',
                                    duration: 50,
                                }}
                            >
                                {Icon && Icon({
                                    color: isFocused ? '#4ADE80' : theme.muted,
                                    size: 24
                                })}
                            </MotiView>
                        </TouchableOpacity>
                    );
                })}
            </BlurView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 20,
        right: 20,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    blurContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    indicator: {
        position: 'absolute',
        zIndex: -1,
    },
    glow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 24,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    }
});
