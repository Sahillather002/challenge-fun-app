import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';

const RewardCard = ({ icon, title, points, color }: { icon: string, title: string, points: string, color: string }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.rewardCard, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
      <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
        <Feather name={icon as any} size={28} color={color} />
      </View>
      <Text style={[styles.rewardTitle, { color: theme.foreground }]}>{title}</Text>
      <View style={styles.pointsRow}>
        <Feather name="star" size={14} color={theme.tertiary} />
        <Text style={[styles.pointsText, { color: theme.foreground }]}>{points} POINTS</Text>
      </View>
      <TouchableOpacity style={[styles.claimBtn, { backgroundColor: color }]}>
        <Text style={styles.claimText}>CLAIM</Text>
      </TouchableOpacity>
    </View>
  );
};

const RewardsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.foreground }]}>Rewards</Text>
          <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>TOTAL POINTS</Text>
              <Text style={styles.balanceVal}>2,450</Text>
            </View>
            <Feather name="award" size={40} color="rgba(255,255,255,0.2)" />
          </View>
        </View>

        {/* Rewards Grid */}
        <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Available Rewards</Text>
        <View style={styles.grid}>
          <RewardCard icon="gift" title="Premium Subscription" points="500" color="#10b981" />
          <RewardCard icon="shopping-bag" title="Store Voucher" points="1000" color="#3b82f6" />
          <RewardCard icon="zap" title="Gym Membership" points="1500" color="#f59e0b" />
          <RewardCard icon="award" title="Exclusive Badge" points="250" color="#8b5cf6" />
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 16,
    letterSpacing: -1,
  },
  balanceCard: {
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceInfo: {
    gap: 4,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  balanceVal: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 16,
  },
  grid: {
    gap: 12,
  },
  rewardCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  claimBtn: {
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  }
});

export default RewardsScreen;

