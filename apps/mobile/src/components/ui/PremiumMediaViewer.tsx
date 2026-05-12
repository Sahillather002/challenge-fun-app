import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, Pressable } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BlurView } from 'expo-blur';
import { Image as ExpoImage } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, MoreHorizontal, Send } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

interface MediaItem {
    id: string;
    uri: string;
    type: 'image' | 'video';
    duration?: number; // duration in ms
}

interface PremiumMediaViewerProps {
    items: MediaItem[];
    initialIndex?: number;
    onClose: () => void;
    isVisible: boolean;
}

export function PremiumMediaViewer({ items, initialIndex = 0, onClose, isVisible }: PremiumMediaViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const insets = useSafeAreaInsets();
    const progress = useSharedValue(0);
    const translateY = useSharedValue(0);

    const activeItem = items[currentIndex];
    const duration = activeItem?.duration || 5000;

    // Swipe to dismiss gesture
    const swipeGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationY > 0) {
                translateY.value = event.translationY;
            }
        })
        .onEnd((event) => {
            if (event.translationY > 150 || event.velocityY > 500) {
                translateY.value = withSpring(height, {}, () => {
                    runOnJS(onClose)();
                });
            } else {
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    // Logic for progress bar and auto-advance
    useEffect(() => {
        if (!isVisible) return;

        progress.value = 0;
        progress.value = withSpring(1, { duration: duration, damping: 20 });

        const timer = setTimeout(() => {
            if (currentIndex < items.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                onClose();
            }
        }, duration);

        return () => clearTimeout(timer);
    }, [currentIndex, isVisible]);

    if (!isVisible || !activeItem) return null;

    return (
        <AnimatePresence>
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={StyleSheet.absoluteFill}
            >
                <GestureDetector gesture={swipeGesture}>
                    <Animated.View style={[styles.container, animatedStyle]}>
                        {/* Media Content */}
                        <ExpoImage
                            source={{ uri: activeItem.uri }}
                            style={StyleSheet.absoluteFill}
                            contentFit="cover"
                            transition={200}
                        />

                        {/* Top Overlays */}
                        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                            {/* Progress Bars */}
                            <View style={styles.progressContainer}>
                                {items.map((_, index) => (
                                    <View key={index} style={styles.progressBarBackground}>
                                        <MotiView
                                            animate={{
                                                width: index < currentIndex ? '100%' : (index === currentIndex ? '100%' : '0%')
                                            }}
                                            transition={{
                                                type: 'timing',
                                                duration: index === currentIndex ? duration : 0
                                            }}
                                            style={[styles.progressBarActive, { backgroundColor: '#fff' }]}
                                        />
                                    </View>
                                ))}
                            </View>

                            {/* Controls */}
                            <View style={styles.topControls}>
                                <View style={styles.userInfo}>
                                    <View style={styles.avatarPlaceholder} />
                                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <BlurView intensity={20} tint="dark" style={styles.userNameContainer}>
                                            {/* Name would go here */}
                                        </BlurView>
                                    </MotiView>
                                </View>
                                <Pressable onPress={onClose} style={styles.iconButton}>
                                    <X color="#fff" size={24} />
                                </Pressable>
                            </View>
                        </View>

                        {/* Touch Areas for Navigation */}
                        <View style={styles.touchContainer}>
                            <TouchableWithoutFeedback onPress={() => currentIndex > 0 && setCurrentIndex(prev => prev - 1)}>
                                <View style={styles.touchSide} />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => currentIndex < items.length - 1 ? setCurrentIndex(prev => prev + 1) : onClose()}>
                                <View style={styles.touchSide} />
                            </TouchableWithoutFeedback>
                        </View>

                        {/* Bottom Overlays */}
                        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                            <BlurView intensity={30} tint="dark" style={styles.inputContainer}>
                                {/* Interaction UI would go here */}
                                <Send color="#fff" size={20} />
                            </BlurView>
                            <Pressable style={styles.iconButton}>
                                <MoreHorizontal color="#fff" size={24} />
                            </Pressable>
                        </View>
                    </Animated.View>
                </GestureDetector>
            </MotiView>
        </AnimatePresence>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        zIndex: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        height: 2,
        gap: 4,
        marginBottom: 16,
    },
    progressBarBackground: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 1,
        overflow: 'hidden',
    },
    progressBarActive: {
        height: '100%',
    },
    topControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ccf',
    },
    userNameContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    iconButton: {
        padding: 8,
    },
    touchContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
    },
    touchSide: {
        flex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
    },
    inputContainer: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    }
});
