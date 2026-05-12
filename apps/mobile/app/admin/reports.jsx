import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react-native";

export default function UserReportsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const reports = [
    {
      id: 1,
      user: "Mike Chen",
      reason: "Suspicious rep count",
      competition: "Push-Up Challenge",
      status: "pending",
    },
    {
      id: 2,
      user: "Alex Kim",
      reason: "Fake video submission",
      competition: "5K Sprint",
      status: "pending",
    },
    {
      id: 3,
      user: "John Doe",
      reason: "Inappropriate behavior",
      competition: "Plank Battle",
      status: "resolved",
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
            Reports & Verification
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {reports.map((report) => (
          <View
            key={report.id}
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor:
                report.status === "pending" ? "#FFD700" : "#00FF88",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <AlertCircle
                size={20}
                color={report.status === "pending" ? "#FFD700" : "#00FF88"}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  {report.user}
                </Text>
                <Text style={{ fontSize: 14, color: "#999", marginBottom: 8 }}>
                  {report.reason}
                </Text>
                <Text style={{ fontSize: 12, color: "#666" }}>
                  Competition: {report.competition}
                </Text>
              </View>
            </View>

            {report.status === "pending" && (
              <View style={{ flexDirection: "row", marginTop: 12 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#00FF8820",
                    paddingVertical: 12,
                    borderRadius: 8,
                    marginRight: 8,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle size={16} color="#00FF88" />
                  <Text
                    style={{
                      color: "#00FF88",
                      fontSize: 14,
                      fontWeight: "600",
                      marginLeft: 8,
                    }}
                  >
                    Approve
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#FF006E20",
                    paddingVertical: 12,
                    borderRadius: 8,
                    marginLeft: 8,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <XCircle size={16} color="#FF006E" />
                  <Text
                    style={{
                      color: "#FF006E",
                      fontSize: 14,
                      fontWeight: "600",
                      marginLeft: 8,
                    }}
                  >
                    Ban User
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {report.status === "resolved" && (
              <View
                style={{
                  backgroundColor: "#00FF8820",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  marginTop: 12,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{ color: "#00FF88", fontSize: 12, fontWeight: "600" }}
                >
                  ✓ Resolved
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
