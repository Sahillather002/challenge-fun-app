import { View, TouchableOpacity, Dimensions, Animated, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, MessageCircle, Send, ArrowLeft, X, Volume2, VolumeX } from "lucide-react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";
import { useState, useRef, useEffect } from "react";
import { MotiView } from "moti";

const { width, height } = Dimensions.get('window');

const SAMPLE_STORIES = [
  {
    id: "1",
    user: { name: "Alex Rivera", username: "arivera_fit", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200" },
    type: "workout",
    content: "Just crushed a PR on deadlifts! 315lbs × 5",
    workoutData: { type: "Strength", duration: "45 min", calories: "320" },
    timestamp: "2h ago",
  },
  {
    id: "2",
    user: { name: "Sarah Chen", username: "sarah_trains", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" },
    type: "steps",
    content: "Morning 10K complete! 🎉",
    workoutData: { type: "Running", distance: "10.2 km", duration: "52 min" },
    timestamp: "4h ago",
  },
  {
    id: "3",
    user: { name: "Mike Johnson", username: "mike_fit", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" },
    type: "water",
    content: "Hydration check! 💧",
    workoutData: { type: "Hydration", amount: "2.5L" },
    timestamp: "6h ago",
  },
];

export default function StoryViewerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const { id } = useLocalSearchParams();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start();
  }, [activeIndex]);
  
  const story = SAMPLE_STORIES[activeIndex] || SAMPLE_STORIES[0];
  
  const getStoryGradient = (type) => {
    switch (type) {
      case 'workout':
        return [theme.primary, theme.secondary];
      case 'steps':
        return ['#00D9FF', '#00FF88'];
      case 'water':
        return ['#00D9FF', '#0088FF'];
      case 'calories':
        return [theme.danger, '#FF8800'];
      case 'achievement':
        return [theme.secondary, theme.primary];
      default:
        return [theme.primary, theme.secondary];
    }
  };
  
  /**
   * @param {'prev' | 'next'} direction
   */
  const goToStory = (direction) => {
    if (direction === 'prev' && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      progressAnim.setValue(0);
    } else if (direction === 'next' && activeIndex < SAMPLE_STORIES.length - 1) {
      setActiveIndex(activeIndex + 1);
      progressAnim.setValue(0);
    } else if (direction === 'next') {
      router.back();
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar style="light" />
      
      <View style={{ paddingTop: insets.top }}>
        <View style={{ height: 4, flexDirection: 'row', gap: 4 }}>
          {SAMPLE_STORIES.map((_, i) => (
            <View key={i} style={{ flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }}>
              {i === activeIndex && (
                <Animated.View
                  style={{
                    height: 4,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  }}
                />
              )}
              {i < activeIndex && <View style={{ height: 4, backgroundColor: '#fff', borderRadius: 2 }} />}
            </View>
          ))}
        </View>
      </View>
      
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={(e) => {
          const x = e.nativeEvent.locationX;
          if (x < width / 2) {
            goToStory('prev');
          } else {
            goToStory('next');
          }
        }}
      >
        <LinearGradient
          colors={getStoryGradient(story.type)}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={{ position: 'absolute', top: insets.top + 50, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <ThemedText style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                {story.user.name}
              </ThemedText>
              <ThemedText style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                {story.timestamp}
              </ThemedText>
            </View>
            <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX size={20} color="#fff" /> : <Volume2 size={20} color="#fff" />}
            </TouchableOpacity>
          </View>
          
          <ThemedText style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 40 }}>
            {story.content}
          </ThemedText>
          
          {story.workoutData && (
            <ThemedCard style={{ 
              marginTop: 30, 
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
            }}>
              <ThemedText style={{ color: '#fff', fontSize: 14 }}>
                {story.workoutData.type} • {story.workoutData.duration || story.workoutData.amount}
              </ThemedText>
            </ThemedCard>
          )}
        </LinearGradient>
      </TouchableOpacity>
      
      <View style={{ 
        position: 'absolute', 
        bottom: insets.bottom + 100, 
        left: 0, 
        right: 0, 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12, 
        paddingHorizontal: 20 
      }}>
        <TextInput
          placeholder="Send reply..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, color: '#fff' }}
        />
        <TouchableOpacity>
          <Heart size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Send size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}