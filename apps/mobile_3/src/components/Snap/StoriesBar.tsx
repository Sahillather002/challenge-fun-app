import React from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '../ui/ThemedText';
import { useTheme } from '@/theme/useTheme';
import { useAuth } from '@/contexts/AuthContext';

export const StoriesBar = ({ stories = [] }) => {
    const router = useRouter();
    const theme = useTheme();
    const { user } = useAuth();

    // Group stories by user and pick the latest for the bubble
    const userStories = stories.reduce((acc, story) => {
        if (!acc[story.userId]) {
            acc[story.userId] = story;
        }
        return acc;
    }, {});

    const uniqueStories = Object.values(userStories);

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Your Story Button */}
                <TouchableOpacity
                    style={styles.storyItem}
                    onPress={() => router.push('/camera')}
                >
                    <View style={[styles.avatarContainer, { borderColor: theme.card }]}>
                        <View style={[styles.myAvatar, { backgroundColor: theme.card }]}>
                            <Plus size={24} color={theme.primary} />
                        </View>
                    </View>
                    <ThemedText style={styles.username} numberOfLines={1}>Your Snap</ThemedText>
                </TouchableOpacity>

                {/* Other Stories */}
                {uniqueStories.map((story: any) => (
                    <TouchableOpacity
                        key={story.id}
                        style={styles.storyItem}
                        onPress={() => router.push(`/stories/${story.userId}`)}
                    >
                        <LinearGradient
                            colors={[theme.secondary, theme.primary]}
                            style={styles.gradientBorder}
                        >
                            <View style={[styles.avatarContainer, { backgroundColor: theme.background }]}>
                                {story.user.avatar ? (
                                    <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
                                ) : (
                                    <ThemedText style={styles.initials}>
                                        {story.user.name?.[0] || 'U'}
                                    </ThemedText>
                                )}
                            </View>
                        </LinearGradient>
                        <ThemedText style={styles.username} numberOfLines={1}>
                            {story.user.username || story.user.name}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 110,
        marginBottom: 8,
    },
    scrollContent: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    storyItem: {
        alignItems: 'center',
        marginRight: 16,
        width: 72,
    },
    gradientBorder: {
        width: 68,
        height: 68,
        borderRadius: 34,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 62,
        height: 62,
        borderRadius: 31,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    myAvatar: {
        width: 62,
        height: 62,
        borderRadius: 31,
        borderWidth: 2,
        borderColor: 'transparent',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    initials: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    username: {
        fontSize: 12,
        marginTop: 6,
        width: '100%',
        textAlign: 'center',
        opacity: 0.8,
    },
});
