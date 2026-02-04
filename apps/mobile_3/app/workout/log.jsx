import { useState } from "react";
import { View, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Camera, Check, Dumbbell, Clock, Flame } from "lucide-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../src/services/api";

import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";

export default function LogWorkoutScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const queryClient = useQueryClient();

    const [exerciseType, setExerciseType] = useState("Push-ups");
    const [reps, setReps] = useState("");
    const [duration, setDuration] = useState("");
    const [calories, setCalories] = useState("");

    const workoutMutation = useMutation({
        mutationFn: (data) => api.createWorkout(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userStats"] });
            queryClient.invalidateQueries({ queryKey: ["streak"] });
            queryClient.invalidateQueries({ queryKey: ["workouts"] });
            Alert.alert("Success", "Workout logged successfully! XP and Coins earned.");
            router.back();
        },
        onError: (error) => {
            Alert.alert("Error", error.response?.data?.message || "Failed to log workout");
        },
    });

    const handleLogWorkout = () => {
        if (!exerciseType || (!reps && !duration)) {
            Alert.alert("Error", "Please fill in the exercise and at least reps or duration.");
            return;
        }

        workoutMutation.mutate({
            exerciseType,
            reps: reps ? parseInt(reps) : null,
            duration: duration ? parseInt(duration) * 60 : null, // Convert mins to secs
            calories: calories ? parseInt(calories) : null,
        });
    };

    return (
        <ThemedScreen>
            <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 100 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24 }}>
                    <ArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>

                <ThemedText style={{ fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>Log Workout</ThemedText>
                <ThemedText style={{ opacity: 0.6, marginBottom: 32 }}>Share your progress and earn rewards!</ThemedText>

                <View style={{ marginBottom: 24 }}>
                    <ThemedText style={{ fontWeight: "600", marginBottom: 8 }}>Exercise Type</ThemedText>
                    <ThemedCard style={{ padding: 0 }}>
                        <TextInput
                            style={{ padding: 16, color: theme.text, fontSize: 16 }}
                            placeholder="e.g. Push-ups, Running, Cycling"
                            placeholderTextColor={theme.muted}
                            value={exerciseType}
                            onChangeText={setExerciseType}
                        />
                    </ThemedCard>
                </View>

                <View style={{ flexDirection: "row", marginBottom: 24 }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <ThemedText style={{ fontWeight: "600", marginBottom: 8 }}>Reps</ThemedText>
                        <ThemedCard style={{ padding: 0 }}>
                            <TextInput
                                style={{ padding: 16, color: theme.text, fontSize: 16 }}
                                placeholder="0"
                                keyboardType="numeric"
                                placeholderTextColor={theme.muted}
                                value={reps}
                                onChangeText={setReps}
                            />
                        </ThemedCard>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <ThemedText style={{ fontWeight: "600", marginBottom: 8 }}>Duration (min)</ThemedText>
                        <ThemedCard style={{ padding: 0 }}>
                            <TextInput
                                style={{ padding: 16, color: theme.text, fontSize: 16 }}
                                placeholder="0"
                                keyboardType="numeric"
                                placeholderTextColor={theme.muted}
                                value={duration}
                                onChangeText={setDuration}
                            />
                        </ThemedCard>
                    </View>
                </View>

                <View style={{ marginBottom: 32 }}>
                    <ThemedText style={{ fontWeight: "600", marginBottom: 8 }}>Estimated Calories</ThemedText>
                    <ThemedCard style={{ padding: 0 }}>
                        <TextInput
                            style={{ padding: 16, color: theme.text, fontSize: 16 }}
                            placeholder="0"
                            keyboardType="numeric"
                            placeholderTextColor={theme.muted}
                            value={calories}
                            onChangeText={setCalories}
                        />
                    </ThemedCard>
                </View>

                {/* Verification Placeholder */}
                <TouchableOpacity style={{ marginBottom: 40 }}>
                    <ThemedCard style={{ alignItems: "center", borderStyle: "dashed", borderWidth: 1, borderColor: theme.primary, padding: 32 }}>
                        <Camera size={32} color={theme.primary} />
                        <ThemedText style={{ marginTop: 12, fontWeight: "600", color: theme.primary }}>Record Video for XP Bonus</ThemedText>
                        <ThemedText style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>AI verification earns 2x coins</ThemedText>
                    </ThemedCard>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLogWorkout} disabled={workoutMutation.isPending}>
                    <LinearGradient
                        colors={[theme.primary, theme.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", opacity: workoutMutation.isPending ? 0.6 : 1 }}
                    >
                        {workoutMutation.isPending ? (
                            <ThemedText style={{ color: "#000", fontWeight: "bold" }}>Logging...</ThemedText>
                        ) : (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Check size={20} color="#000" style={{ marginRight: 8 }} />
                                <ThemedText style={{ color: "#000", fontWeight: "bold", fontSize: 18 }}>Confirm Workout</ThemedText>
                            </View>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </ThemedScreen>
    );
}
