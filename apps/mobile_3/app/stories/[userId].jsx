import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { ThemedText } from '@/components/ui/ThemedText';

const { width, height } = Dimensions.get('window');

export default function StoryViewer() {
    const { userId } = useLocalSearchParams();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data: stories = [] } = useQuery({
        queryKey: ['stories', userId],
        queryFn: () => api.getStories().then(res => res.data.filter(s => s.userId === userId)),
    });

    const currentStory = stories[currentIndex];

    useEffect(() => {
        if (stories.length > 0) {
            const timer = setTimeout(() => {
                handleNext();
            }, 5000); // 5 seconds per story
            return () => clearTimeout(timer);
        }
    }, [currentIndex, stories]);

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            router.back();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (stories.length === 0) return null;

    return (
        <View style={styles.container}>
            <Image source={{ uri: currentStory.mediaUrl }} style={styles.image} />

            {/* Progress Bars */}
            <View style={styles.progressContainer}>
                {stories.map((_, index) => (
                    <View key={index} style={styles.progressBarBackground}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: index === currentIndex ? '100%' : index < currentIndex ? '100%' : '0%' }
                            ]}
                        />
                    </View>
                ))}
            </View>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Image source={{ uri: currentStory.user.avatar }} style={styles.avatar} />
                    <ThemedText style={styles.username}>{currentStory.user.username}</ThemedText>
                </View>
                <TouchableOpacity onPress={() => router.back()}>
                    <X size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Tap Areas */}
            <View style={styles.tapContainer}>
                <TouchableOpacity style={styles.tapArea} onPress={handlePrev} />
                <TouchableOpacity style={styles.tapArea} onPress={handleNext} />
            </View>

            {/* Caption */}
            {currentStory.caption && (
                <BlurView intensity={30} tint="dark" style={styles.captionContainer}>
                    <ThemedText style={styles.captionText}>{currentStory.caption}</ThemedText>
                </BlurView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    image: {
        width,
        height,
        resizeMode: 'cover',
    },
    progressContainer: {
        position: 'absolute',
        top: 60,
        left: 10,
        right: 10,
        flexDirection: 'row',
        height: 3,
    },
    progressBarBackground: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginHorizontal: 2,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#fff',
    },
    header: {
        position: 'absolute',
        top: 80,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
    username: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    tapContainer: {
        position: 'absolute',
        top: 150,
        bottom: 100,
        left: 0,
        right: 0,
        flexDirection: 'row',
    },
    tapArea: {
        flex: 1,
    },
    captionContainer: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        maxWidth: '80%',
    },
    captionText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});
