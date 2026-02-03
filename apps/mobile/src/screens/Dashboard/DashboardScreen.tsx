import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { useTheme } from '../../context/ThemeContext';

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useSupabaseAuth();
  const { theme, assets } = useTheme();

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>

        {/* Header with Illustration Background */}
        <View className="rounded-b-3xl pt-[60px] px-5 pb-5 mb-4 bg-card">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-sm font-medium text-text-secondary">Hello,</Text>
              <Text className="text-2xl font-extrabold mt-0.5 text-text-primary">{user?.userName || 'James Aditya'}</Text>
            </View>
            <Avatar.Image size={48} source={{ uri: assets.avatar }} className="border-2 border-white" />
          </View>

          {/* Illustrated Background */}
          <View className="h-40 rounded-2xl overflow-hidden justify-center items-center mt-2 relative bg-sky-blue/30">
            <Image
              source={require('../../../assets/images/mountain_view.png')}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
            <Text className="text-2xl font-extrabold mt-2 text-center text-white" style={{ textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 }}>Your Daily Journey</Text>
          </View>
        </View>

        {/* Ongoing Challenge Card */}
        <View className="mx-5 rounded-3xl overflow-hidden mb-6 bg-card shadow-sm elevation-4">
          {/* Challenge Illustration */}
          <View className="h-[200px] w-full bg-gray-200">
            <Image
              source={require('../../../assets/images/people_yoga.png')}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Gradient-like overlay for text readability if needed, or just clean image */}
          </View>

          <View className="p-5">
            <Text className="text-base font-bold mb-2 text-text-primary">Ongoing Challenge</Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-extrabold text-text-primary">Become Healthy</Text>
              <View className="px-3 py-1.5 rounded-xl bg-success/20">
                <Text className="text-xs font-bold text-success">0%</Text>
              </View>
            </View>
            <Text className="text-xs font-medium text-text-secondary">4 Challenges • 24 Days Left</Text>
          </View>
        </View>

        {/* Challenge Progress List */}
        <Text className="text-lg font-extrabold mx-5 mb-3 text-text-primary">Challenge Progress</Text>

        <TouchableOpacity className="flex-row items-center mx-5 mb-3 p-4 rounded-2xl bg-card shadow-sm elevation-2">
          <View className="w-12 h-12 rounded-xl justify-center items-center bg-warning/20">
            <Text style={{ fontSize: 24 }}>🚶</Text>
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-sm font-bold text-text-primary">5,290 Steps</Text>
            <Text className="text-xs font-medium mt-0.5 text-text-secondary">Step Challenge</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-bold text-warning">500pts</Text>
            <Text className="text-text-tertiary">›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center mx-5 mb-3 p-4 rounded-2xl bg-card shadow-sm elevation-2">
          <View className="w-12 h-12 rounded-xl justify-center items-center bg-info/20">
            <Text style={{ fontSize: 24 }}>💧</Text>
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-sm font-bold text-text-primary">4 Glass of Waters</Text>
            <Text className="text-xs font-medium mt-0.5 text-text-secondary">Hydration</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-bold text-info">200pts</Text>
            <Text className="text-text-tertiary">›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center mx-5 mb-3 p-4 rounded-2xl bg-card shadow-sm elevation-2">
          <View className="w-12 h-12 rounded-xl justify-center items-center bg-sunset-pink/60">
            <Text style={{ fontSize: 24 }}>🧘</Text>
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-sm font-bold text-text-primary">5 Minutes</Text>
            <Text className="text-xs font-medium mt-0.5 text-text-secondary">Breathing Exercise</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-bold text-sunset-pink">200pts</Text>
            <Text className="text-text-tertiary">›</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Kept for illustration overlay positioning which is complex in tailwind without arbitrary values
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export default DashboardScreen;
