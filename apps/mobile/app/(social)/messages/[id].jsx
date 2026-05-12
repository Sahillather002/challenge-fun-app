import { View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Users, Camera, Send, ArrowLeft, Heart, Paperclip } from "lucide-react-native";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { useTheme } from "@/theme/useTheme";
import { useThemeStore } from "@/theme/themeStore";
import { useState, useRef } from "react";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", text: "Hey! Just crushed my morning run!", isSender: false, time: "10:30 AM" },
    { id: "2", text: "Nice! I did legs today, feeling the burn 💪", isSender: true, time: "10:32 AM" },
    { id: "3", text: "Want to do a partner workout tomorrow?", isSender: false, time: "10:35 AM" },
    { id: "4", text: "Sure! How about 7AM at the park?", isSender: true, time: "10:36 AM" },
    { id: "5", text: "Perfect! See you then 😊", isSender: false, time: "10:40 AM" },
  ]);
  
  const scrollViewRef = useRef(null);
  
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        isSender: true,
        time: formatTime()
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage("");
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  
  return (
    <ThemedScreen>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <View style={{ flex: 1 }}>
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={theme.text} />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.primary + "20", justifyContent: "center", alignItems: "center" }}>
                <Users size={20} color={theme.primary} />
              </View>
              <View style={{ marginLeft: 8 }}>
                <ThemedText style={{ fontSize: 18, fontWeight: "600" }}>Alex Rivera</ThemedText>
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>Active 2m ago</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={{ marginLeft: "auto" }}>
              <Heart size={20} color={theme.muted} />
            </TouchableOpacity>
          </View>
          
<ScrollView
             ref={scrollViewRef}
             showsVerticalScrollIndicator={false}
             contentContainerStyle={{ paddingBottom: 100 }}
             onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
           >
             {messages.map((msg) => (
               <View key={msg.id} style={{ marginBottom: 16, alignItems: msg.isSender ? "flex-end" : "flex-start" }}>
                 <ThemedCard
                   style={{
                     maxWidth: "70%",
                     backgroundColor: msg.isSender ? theme.primary : theme.card,
                     padding: 12,
                     borderRadius: msg.isSender ? 18 : 18,
                     borderBottomLeftRadius: msg.isSender ? 18 : 0,
                     borderBottomRightRadius: msg.isSender ? 0 : 18,
                   }}
                 >
                   <ThemedText style={{ color: msg.isSender ? "#fff" : theme.text }}>{msg.text}</ThemedText>
                   <ThemedText style={{ fontSize: 10, opacity: 0.6, marginTop: 4, alignSelf: msg.isSender ? "flex-end" : "flex-start" }}>
                     {msg.time}
                   </ThemedText>
                 </ThemedCard>
               </View>
             ))}
           </ScrollView>
          
          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: theme.background, borderTopWidth: 1, borderTopColor: theme.card, paddingBottom: insets.bottom + 16 }}>
<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
               <TouchableOpacity onPress={() => router.push("/camera")}>
                 <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.card, justifyContent: "center", alignItems: "center" }}>
                   <Camera size={20} color={theme.text} />
                 </View>
               </TouchableOpacity>
               
               <TouchableOpacity onPress={() => router.push("/social/media")}>
                 <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.card, justifyContent: "center", alignItems: "center" }}>
                   <Paperclip size={20} color={theme.text} />
                 </View>
               </TouchableOpacity>
               
               <TextInput
                 style={{ flex: 1, padding: 12, borderRadius: 24, backgroundColor: theme.card, color: theme.text }}
                 value={message}
                 onChangeText={setMessage}
                 placeholder="Message..."
                 placeholderTextColor={theme.muted}
                 onSubmitEditing={sendMessage}
                 blurOnSubmit={false}
               />
               
               <TouchableOpacity onPress={sendMessage}>
                 <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.primary, justifyContent: "center", alignItems: "center" }}>
                   <Send size={24} color="#fff" />
                 </View>
               </TouchableOpacity>
             </View>
          </View>
        </View>
      </View>
    </ThemedScreen>
  );
}