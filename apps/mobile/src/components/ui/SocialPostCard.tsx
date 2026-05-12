import React from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { PremiumCard } from './PremiumCard';
import { BlurView } from 'expo-blur';
import { Image as ExpoImage } from 'expo-image';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/theme/useTheme';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface SocialPostCardProps {
    post: {
        id: string;
        user: {
            name: string;
            username: string;
            avatar: string;
        };
        mediaUrl: string;
        caption: string;
        likes: number;
        comments: number;
        isLive?: boolean;
    };
    delay?: number;
}

export function SocialPostCard({ post, delay = 0 }: SocialPostCardProps) {
    const theme = useTheme();

    return (
        <PremiumCard delay={delay} glass={true} style={{ padding: 0, marginBottom: 24, borderRadius: 28 }}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <ExpoImage
                        source={{ uri: post.user.avatar }}
                        style={styles.avatar}
                        transition={200}
                    />
                    <View>
                        <ThemedText style={styles.name}>{post.user.name}</ThemedText>
                        <ThemedText style={styles.username}>@{post.user.username}</ThemedText>
                    </View>
                </View>
                <Pressable style={styles.iconButton}>
                    <MoreHorizontal color={theme.text} size={20} />
                </Pressable>
            </View>

            {/* Media Content */}
            <View style={[styles.mediaContainer, { height: width * 1.25 }]}>
                <ExpoImage
                    source={{ uri: post.mediaUrl }}
                    style={styles.media}
                    contentFit="cover"
                    transition={300}
                />

                {post.isLive && (
                    <View style={styles.liveBadge}>
                        <LinearGradient
                            colors={['#FF0000', '#FF4D4D']}
                            style={styles.liveGradient}
                        >
                            <ThemedText style={styles.liveText}>LIVE</ThemedText>
                        </LinearGradient>
                    </View>
                )}

                {/* Glassmorphic Interaction Overlay */}
                <View style={styles.interactionOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.glassBar}>
                        <View style={styles.statGroup}>
                            <Heart color="#fff" size={20} />
                            <ThemedText style={styles.statText}>{post.likes}</ThemedText>
                        </View>
                        <View style={styles.statGroup}>
                            <MessageCircle color="#fff" size={20} />
                            <ThemedText style={styles.statText}>{post.comments}</ThemedText>
                        </View>
                        <View style={styles.statGroup}>
                            <Share2 color="#fff" size={20} />
                        </View>
                    </BlurView>
                </View>
            </View>

            {/* Caption */}
            <View style={styles.content}>
                <ThemedText style={styles.caption}>
                    <ThemedText style={styles.boldUsername}>{post.user.username} </ThemedText>
                    {post.caption}
                </ThemedText>
            </View>
        </PremiumCard>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    name: {
        fontSize: 14,
        fontFamily: 'Outfit_700Bold',
    },
    username: {
        fontSize: 12,
        opacity: 0.6,
        fontFamily: 'Outfit_400Regular',
    },
    iconButton: {
        padding: 8,
    },
    mediaContainer: {
        width: '100%',
        borderRadius: 28,
        overflow: 'hidden',
        position: 'relative',
    },
    media: {
        flex: 1,
    },
    liveBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    liveGradient: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    liveText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Outfit_700Bold',
    },
    interactionOverlay: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    glassBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        gap: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    statGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
    },
    content: {
        padding: 12,
    },
    caption: {
        fontSize: 14,
        opacity: 0.9,
        lineHeight: 20,
    },
    boldUsername: {
        fontFamily: 'Outfit_700Bold',
    }
});
