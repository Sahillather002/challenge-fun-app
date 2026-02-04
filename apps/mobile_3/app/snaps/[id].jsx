import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Clock } from 'lucide-react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { ThemedText } from '@/components/ui/ThemedText';

const { width, height } = Dimensions.get('window');

export default function SnapViewer() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [timeLeft, setTimeLeft] = useState(10); // 10 second viewing time

    const { data: snaps = [] } = useQuery({
        queryKey: ['snaps', 'inbox'],
        queryFn: () => api.getInbox().then(res => res.data),
    });

    const snap = snaps.find(s => s.id === id);

    const viewMutation = useMutation({
        mutationFn: () => api.markSnapViewed(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['snaps', 'inbox'] });
        }
    });

    useEffect(() => {
        if (snap) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        closeSnap();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [snap]);

    const closeSnap = () => {
        viewMutation.mutate();
        router.back();
    };

    if (!snap) return null;

    return (
        <View style={styles.container}>
            <Image source={{ uri: snap.mediaUrl }} style={styles.image} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <ThemedText style={styles.username}>From {snap.sender.username}</ThemedText>
                </View>
                <View style={styles.timerContainer}>
                    <Clock size={20} color="#fff" />
                    <ThemedText style={styles.timerText}>{timeLeft}s</ThemedText>
                </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={closeSnap}>
                <X size={30} color="#fff" />
            </TouchableOpacity>
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
    header: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    username: {
        color: '#fff',
        fontWeight: 'bold',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    timerText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
    },
    closeBtn: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
