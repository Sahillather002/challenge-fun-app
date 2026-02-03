import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { register } = useSupabaseAuth();
  const { theme } = useTheme();

  const handleRegister = async () => {
    setLocalLoading(true);
    try {
      await register(email, password, name);
      navigation.replace('Main');
    } catch (error) {
      console.error(error);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View className="w-20 h-20 rounded-3xl justify-center items-center mb-5 shadow-lg shadow-emerald-500/30 elevation-10 bg-primary">
          <Icon name="pulse" size={40} color="#fff" />
        </View>

        <Text className="text-3xl font-black tracking-tighter text-text-primary">Join Zenith Health</Text>
        <Text className="text-xs font-semibold mt-1 mb-10 text-text-secondary">Create Your Operative Account</Text>

        <View className="w-full p-6 rounded-[32px] border bg-white shadow-sm elevation-2 border-outline">
          <Text className="text-[9px] font-black tracking-widest mb-2 text-text-primary">OPERATIVE NAME</Text>
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            className="text-sm font-extrabold py-3 text-text-primary"
            placeholderTextColor={theme.subtext}
          />
          <View className="h-px my-4 bg-outline" />

          <Text className="text-[9px] font-black tracking-widest mb-2 text-text-primary">EMAIL IDENTIFIER</Text>
          <TextInput
            placeholder="email@zenith.health"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            className="text-sm font-extrabold py-3 text-text-primary"
            placeholderTextColor={theme.subtext}
          />
          <View className="h-px my-4 bg-outline" />

          <Text className="text-[9px] font-black tracking-widest mb-2 text-text-primary">ENCRYPTION KEY</Text>
          <TextInput
            placeholder="Secure Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="text-sm font-extrabold py-3 text-text-primary"
            placeholderTextColor={theme.subtext}
          />
        </View>

        <TouchableOpacity
          className="w-full h-16 rounded-3xl justify-center items-center mt-8 bg-primary"
          onPress={handleRegister}
          disabled={localLoading}
        >
          {localLoading ? <ActivityIndicator color="#fff" size="small" /> : <Text className="text-white text-base font-black tracking-widest">INITIALIZE OPERATIVE</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} className="mt-6">
          <Text className="text-xs font-semibold text-text-secondary">Already have an account? <Text className="font-extrabold text-primary">LOGIN</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Kept minimal
  content: {
    padding: 32,
    paddingTop: 80,
    alignItems: 'center',
  },
});

export default RegisterScreen;


