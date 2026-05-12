import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/theme/useTheme';
import { StoriesBar } from '@/components/Snap/StoriesBar';
import { SocialPostCard } from '@/components/ui/SocialPostCard';
import { MotiView } from 'moti';
import { Search, PlusSquare, Heart, MessageCircle, Send, Bookmark } from 'lucide-react-native';
import { DynamicBackground } from '@/components/ui/DynamicBackground';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

const MOCK_POSTS = [
    {
        id: '1',
        user: {
            name: 'Alex Rivera',
            username: 'arivera_fit',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
        },
        mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
        caption: 'Crushed my morning 10k! The new FitBattle streak system is keeping me ultra motivated. Who else is hitting their goals today? 🏃‍♂️💨',
        likes: 1243,
        comments: 89,
        isLive: true,
        workoutData: { type: 'Running', distance: '10.2 km', duration: '52 min' },
    },
    {
        id: '2',
        user: {
            name: 'Sarah Chen',
            username: 'sarah_trains',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        },
        mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        caption: 'Just joined the Push-Up Battle! $500 prize pool is insane. Come join me! 💪✨',
        likes: 856,
        comments: 42,
        workoutData: { type: 'Push-ups', reps: '150', sets: '5' },
    }
];

export default function CommunityFeedScreen() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const router = useRouter();
    const [refreshing, setRefreshing] = React.useState(false);

    const { data: posts = MOCK_POSTS } = useQuery({
        queryKey: ['socialFeed'],
        queryFn: () => api.getStories().then(res => res.data || MOCK_POSTS),
        staleTime: 60000,
    });

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    const renderHeader = () => (
        <View style={styles.headerContent}>
            <View style={styles.topBar}>
                <View>
                    <ThemedText style={styles.title}>FitSocial</ThemedText>
                    <ThemedText style={styles.subtitle}>Share your fitness journey</ThemedText>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => router.push('/social/notifications')}>
                        <View style={styles.iconBadge}>
                            <Heart color={theme.text} size={24} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/social/messages')}>
                        <MessageCircle color={theme.text} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/social/stories/create')}>
                        <PlusSquare color={theme.text} size={24} />
                    </TouchableOpacity>
                </View>
            </View>
            <StoriesBar stories={[]} />
            <View style={styles.divider} />
        </View>
    );

    const renderPost = ({ item, index }: { item: any; index: number }) => (
        <View style={styles.postWrapper}>
            <SocialPostCard post={item} delay={100 + (index * 50)} />
            {item.workoutData && (
                <View style={styles.workoutBadge}>
                    <LinearGradient
                        colors={[theme.primary + '40', theme.secondary + '40']}
                        style={styles.workoutBadgeGradient}
                    >
                        <ThemedText style={styles.workoutBadgeText}>
                            {item.workoutData.type} • {item.workoutData.duration || `${item.workoutData.reps} reps`}
                        </ThemedText>
                    </LinearGradient>
                </View>
            )}
        </View>
    );

    return (
        <DynamicBackground>
            <View style={styles.container}>
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPost}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={{
                        paddingTop: insets.top + 20,
                        paddingBottom: 100
                    }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.primary}
                        />
                    }
                />
            </View>
        </DynamicBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContent: {
        marginBottom: 16,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
    },
    subtitle: {
        fontSize: 14,
        opacity: 0.6,
        fontFamily: 'Outfit_400Regular',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 20,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 16,
        marginTop: 16,
    },
    postWrapper: {
        paddingHorizontal: 16,
        position: 'relative',
    },
    workoutBadge: {
        position: 'absolute',
        top: 20,
        right: 32,
        borderRadius: 20,
        overflow: 'hidden',
    },
    workoutBadgeGradient: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    workoutBadgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
    },
    iconBadge: {
        position: 'relative',
    },
});