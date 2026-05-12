import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme/useTheme';
import { useThemeStore } from '@/theme/themeStore';

interface PremiumCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    delay?: number;
    glass?: boolean;
}

export function PremiumCard({ children, style, delay = 0, glass = false }: PremiumCardProps) {
    const theme = useTheme();
    const mode = useThemeStore((s) => s.mode);

    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                type: 'timing',
                duration: 600,
                delay: delay,
            }}
            style={[
                styles.card,
                {
                    backgroundColor: glass ? (mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)') : theme.card,
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)',
                    borderWidth: glass ? 1.5 : 1,
                },
                style
            ]}
        >
            {glass && (
                <BlurView
                    intensity={mode === 'dark' ? 70 : 90}
                    tint={mode === 'dark' ? 'dark' : 'light'}
                    style={StyleSheet.absoluteFill}
                />
            )}
            <View style={styles.content}>
                {children}
            </View>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        // Premium subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    content: {
        padding: 20,
    }
});
