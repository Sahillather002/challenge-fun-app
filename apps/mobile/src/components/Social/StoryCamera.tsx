import { View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Camera, Zap, Footprints, Droplet, Flame, Trophy } from 'lucide-react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/theme/useTheme';

const { width } = Dimensions.get('window');

interface StoryCameraProps {
  onClose?: () => void;
}

export function StoryCamera({ onClose }: StoryCameraProps) {
  const router = useRouter();
  const theme = useTheme();

  const storyTemplates = [
    { id: 'workout', icon: Zap, label: 'Workout', color: theme.primary },
    { id: 'steps', icon: Footprints, label: 'Steps', color: '#00D9FF' },
    { id: 'water', icon: Droplet, label: 'Water', color: '#00D9FF' },
    { id: 'calories', icon: Flame, label: 'Calories', color: theme.danger },
    { id: 'achievement', icon: Trophy, label: 'Achievement', color: theme.secondary },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Camera size={80} color="#fff" />
        <ThemedText style={{ color: '#fff', marginTop: 20, fontSize: 18 }}>
          Create Story
        </ThemedText>
      </View>

      <View style={{ padding: 20 }}>
        <ThemedText style={{ color: '#fff', marginBottom: 16, fontSize: 16, fontWeight: '600' }}>
          Story Type
        </ThemedText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {storyTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <TouchableOpacity
                key={template.id}
                onPress={() => router.push(`/stories/create?type=${template.id}`)}
                style={{ alignItems: 'center', width: 80 }}
              >
                <LinearGradient
                  colors={[template.color, theme.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}
                >
                  <Icon size={28} color="#fff" />
                </LinearGradient>
                <ThemedText style={{ color: '#fff', fontSize: 12 }}>{template.label}</ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ padding: 20, paddingBottom: 40 }}>
        <TouchableOpacity
          onPress={() => router.push('/stories/create')}
          style={{ backgroundColor: theme.primary, padding: 16, borderRadius: 12, alignItems: 'center' }}
        >
          <ThemedText style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
            Create Custom Story
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}