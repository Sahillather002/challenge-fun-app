import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedCard } from '@/components/ui/ThemedCard';
import { Camera, ChevronRight, MessageSquare, Clock } from 'lucide-react-native';
import { useTheme } from '@/theme/useTheme';
import { formatDistanceToNow } from 'date-fns';

export default function SnapsInbox() {
    const theme = useTheme();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: snaps = [], isLoading } = useQuery({
        queryKey: ['snaps', 'inbox'],
        queryFn: () => api.getInbox().then(res => res.data),
        refreshInterval: 10000,
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => router.push(`/snaps/${item.id}`)}
            style={styles.snapItem}
        >
            <ThemedCard style={styles.card}>
                <View style={styles.row}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                        <MessageSquare size={24} color={theme.primary} />
                    </View>
                    <View style={styles.content}>
                        <ThemedText style={styles.senderName}>{item.sender.username}</ThemedText>
                        <View style={styles.meta}>
                            <Clock size={12} color={theme.text} style={{ opacity: 0.6 }} />
                            <ThemedText style={styles.timeText}>
                                {formatDistanceToNow(new Date(item.createdAt))} ago
                            </ThemedText>
                        </View>
                    </View>
                    <ChevronRight size={20} color={theme.text} style={{ opacity: 0.3 }} />
                </View>
            </ThemedCard>
        </TouchableOpacity>
    );

    return (
        <ThemedScreen style={styles.container}>
            <View style={styles.header}>
                <ThemedText style={styles.title}>Snaps Inbox</ThemedText>
                <TouchableOpacity style={styles.cameraBtn} onPress={() => router.push('/camera')}>
                    <Camera size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={snaps}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MessageSquare size={64} color={theme.text} style={{ opacity: 0.2 }} />
                        <ThemedText style={styles.emptyText}>No new snaps. Go send one!</ThemedText>
                        <TouchableOpacity
                            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
                            onPress={() => router.push('/camera')}
                        >
                            <ThemedText style={styles.btnText}>Open Camera</ThemedText>
                        </TouchableOpacity>
                    </View>
                }
            />
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginTop: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    cameraBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#00D1FF', // FitBattle primary
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 20,
    },
    snapItem: {
        marginBottom: 12,
    },
    card: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    senderName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    timeText: {
        fontSize: 12,
        opacity: 0.6,
        marginLeft: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        opacity: 0.5,
        marginTop: 20,
        marginBottom: 30,
    },
    primaryBtn: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    btnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
