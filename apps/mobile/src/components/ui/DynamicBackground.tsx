import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useTheme } from '@/theme/useTheme';
import { useThemeStore } from '@/theme/themeStore';

const { width, height } = Dimensions.get('window');

export function DynamicBackground({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    const mode = useThemeStore((s) => s.mode);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Background Blobs for Glass Depth */}
            <View style={StyleSheet.absoluteFill}>
                <MotiView
                    from={{ translateX: -width * 0.3, translateY: -height * 0.2, scale: 1 }}
                    animate={{ translateX: width * 0.2, translateY: height * 0.2, scale: 1.2 }}
                    transition={{
                        loop: true,
                        type: 'timing',
                        duration: 12000,
                        repeatReverse: true,
                    }}
                    style={[styles.blob, { backgroundColor: '#00F0FF', opacity: mode === 'dark' ? 0.15 : 0.08, width: 450, height: 450 }]}
                />
                <MotiView
                    from={{ translateX: width * 0.6, translateY: height * 0.1, scale: 1.1 }}
                    animate={{ translateX: width * 0.1, translateY: height * 0.6, scale: 1 }}
                    transition={{
                        loop: true,
                        type: 'timing',
                        duration: 18000,
                        repeatReverse: true,
                    }}
                    style={[styles.blob, { backgroundColor: '#7000FF', opacity: mode === 'dark' ? 0.12 : 0.07, width: 500, height: 500 }]}
                />
                <MotiView
                    from={{ translateX: width * 0.1, translateY: height * 0.7, scale: 1 }}
                    animate={{ translateX: width * 0.5, translateY: height * 0.3, scale: 1.3 }}
                    transition={{
                        loop: true,
                        type: 'timing',
                        duration: 15000,
                        repeatReverse: true,
                    }}
                    style={[styles.blob, { backgroundColor: '#FF00A8', opacity: mode === 'dark' ? 0.1 : 0.06, width: 400, height: 400 }]}
                />
                <MotiView
                    from={{ translateX: width * 0.4, translateY: height * 0.8 }}
                    animate={{ translateX: -width * 0.1, translateY: height * 0.4 }}
                    transition={{
                        loop: true,
                        type: 'timing',
                        duration: 25000,
                        repeatReverse: true,
                    }}
                    style={[styles.blob, { backgroundColor: theme.primary, opacity: mode === 'dark' ? 0.08 : 0.04, width: 350, height: 350 }]}
                />
            </View>

            {/* Content Overflow */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 200,
        // Using high blur radius for mesh effect
    },
    content: {
        flex: 1,
    }
});
