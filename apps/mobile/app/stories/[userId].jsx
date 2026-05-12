import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { PremiumMediaViewer } from '@/components/ui/PremiumMediaViewer';

export default function StoryViewer() {
    const { userId } = useLocalSearchParams();
    const router = useRouter();

    const { data: stories = [], isLoading } = useQuery({
        queryKey: ['stories', userId],
        queryFn: () => api.getStories().then(res => res.data.filter(s => s.userId === userId)),
    });

    const mediaItems = useMemo(() => {
        return stories.map(story => ({
            id: story.id,
            uri: story.mediaUrl,
            type: 'image', // Basic assumption for now
            duration: 5000,
        }));
    }, [stories]);

    if (isLoading || stories.length === 0) {
        return <View style={styles.loader} />;
    }

    return (
        <PremiumMediaViewer
            items={mediaItems}
            isVisible={true}
            onClose={() => router.back()}
        />
    );
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        backgroundColor: '#000',
    }
});
