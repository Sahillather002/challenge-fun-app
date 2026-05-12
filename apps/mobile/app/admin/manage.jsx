import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ArrowLeft, Edit, Trash2, Play, Pause } from "lucide-react-native";

export default function ManageCompetitionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const competitions = [
    {
      id: 1,
      name: "Push-Up Challenge",
      status: "Live",
      participants: 234,
      prize: "$500",
    },
    {
      id: 2,
      name: "5K Sprint Battle",
      status: "Live",
      participants: 189,
      prize: "$750",
    },
    {
      id: 3,
      name: "Plank Endurance",
      status: "Scheduled",
      participants: 0,
      prize: "$400",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#fff",
              marginLeft: 16,
            }}
          >
            Manage Competitions
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {competitions.map((comp) => (
          <View
            key={comp.id}
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#fff",
                    marginBottom: 8,
                  }}
                >
                  {comp.name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor:
                        comp.status === "Live" ? "#00FF88" : "#FFD700",
                      marginRight: 8,
                    }}
                  />
                  <Text style={{ fontSize: 14, color: "#999" }}>
                    {comp.status} • {comp.participants} participants
                  </Text>
                </View>
                <Text
                  style={{ fontSize: 14, color: "#00FF88", fontWeight: "600" }}
                >
                  Prize: {comp.prize}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#2a2a2a",
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginRight: 8,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Edit size={16} color="#00D9FF" />
                <Text
                  style={{
                    color: "#00D9FF",
                    fontSize: 14,
                    fontWeight: "600",
                    marginLeft: 8,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#2a2a2a",
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginHorizontal: 4,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {comp.status === "Live" ? (
                  <Pause size={16} color="#FFD700" />
                ) : (
                  <Play size={16} color="#00FF88" />
                )}
                <Text
                  style={{
                    color: comp.status === "Live" ? "#FFD700" : "#00FF88",
                    fontSize: 14,
                    fontWeight: "600",
                    marginLeft: 8,
                  }}
                >
                  {comp.status === "Live" ? "Pause" : "Start"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#2a2a2a",
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginLeft: 8,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Trash2 size={16} color="#FF006E" />
                <Text
                  style={{
                    color: "#FF006E",
                    fontSize: 14,
                    fontWeight: "600",
                    marginLeft: 8,
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
