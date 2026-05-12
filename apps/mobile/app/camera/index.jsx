import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { X, Zap, ZapOff, Check, RotateCcw, Camera as CameraIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/services/api';
import { BlurView } from 'expo-blur';
import { MessageSquare, Users, Send } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState('back');
    const [flash, setFlash] = useState('off');
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showFriendPicker, setShowFriendPicker] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const cameraRef = useRef(null);
    const router = useRouter();

    const { data: friends = [] } = useQuery({
        queryKey: ['friends'],
        queryFn: () => api.getFriends().then(res => res.data),
    });


    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.button}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.7,
                    skipProcessing: true,
                });
                setPhoto(photo);
            } catch (e) {
                Alert.alert("Error", "Failed to take photo");
            }
        }
    };

    const saveToStory = async () => {
        setLoading(true);
        try {
            // In a real app, we would upload to Supabase Storage first
            // For this demo, we'll use a placeholder URL
            const placeholderUrl = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800";

            await api.createStory({
                mediaUrl: placeholderUrl,
                mediaType: 'IMAGE',
                caption: 'Crushing it! 💪'
            });

            Alert.alert("Success", "Story posted!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (e) {
            Alert.alert("Error", "Failed to post story");
        } finally {
            setLoading(false);
        }
    };

    const sendDirectSnap = async (friendId) => {
        setLoading(true);
        try {
            const placeholderUrl = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800";

            await api.sendSnap({
                receiverId: friendId,
                mediaUrl: placeholderUrl,
                mediaType: 'IMAGE',
            });

            Alert.alert("Success", "Snap sent!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (e) {
            Alert.alert("Error", "Failed to send snap");
        } finally {
            setLoading(false);
            setShowFriendPicker(false);
        }
    };

    if (photo) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: photo.uri }} style={styles.preview} />
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setPhoto(null)}>
                        <RotateCcw size={32} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => setShowFriendPicker(true)}
                        disabled={loading}
                    >
                        <LinearGradient colors={['#FF00D6', '#FF005C']} style={styles.confirmGradient}>
                            <Send size={24} color="#fff" />
                            <Text style={styles.confirmText}>Send Snap</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={saveToStory}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={['#00f2fe', '#4facfe']}
                            style={styles.confirmGradient}
                        >
                            <Check size={24} color="#fff" />
                            <Text style={styles.confirmText}>Story</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {showFriendPicker && (
                    <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill}>
                        <View style={styles.pickerContainer}>
                            <View style={styles.pickerHeader}>
                                <Text style={styles.pickerTitle}>Send to Friend</Text>
                                <TouchableOpacity onPress={() => setShowFriendPicker(false)}>
                                    <X size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.friendList}>
                                {friends.map((friendship) => {
                                    const friend = friendship.user || friendship.friend; // Simple mapping
                                    return (
                                        <TouchableOpacity
                                            key={friendship.id}
                                            style={styles.friendItem}
                                            onPress={() => sendDirectSnap(friend.id)}
                                        >
                                            <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                                            <Text style={styles.friendName}>{friend.username}</Text>
                                            <Send size={20} color="#4facfe" />
                                        </TouchableOpacity>
                                    );
                                })}
                                {friends.length === 0 && (
                                    <Text style={styles.noFriends}>No friends found. Post to your story instead!</Text>
                                )}
                            </ScrollView>
                        </View>
                    </BlurView>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                flash={flash}
                ref={cameraRef}
            >
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                        <X size={32} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.flashButton}
                        onPress={() => setFlash(flash === 'on' ? 'off' : 'on')}
                    >
                        {flash === 'on' ? <Zap size={24} color="#FFD700" /> : <ZapOff size={24} color="#fff" />}
                    </TouchableOpacity>

                    <View style={styles.bottomControls}>
                        <TouchableOpacity
                            style={styles.flipButton}
                            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
                        >
                            <RotateCcw size={28} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
                            <View style={styles.shutterInner} />
                        </TouchableOpacity>

                        <View style={{ width: 28 }} />
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    preview: {
        flex: 1,
    },
    controls: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 20,
        justifyContent: 'space-between',
    },
    overlay: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    closeButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flashButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    shutterButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shutterInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
    },
    flipButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButton: {
        flex: 1,
        marginLeft: 20,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
    },
    confirmGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    confirmText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: '#fff',
    },
    button: {
        backgroundColor: '#4facfe',
        padding: 15,
        borderRadius: 10,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pickerContainer: {
        flex: 1,
        marginTop: 100,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    friendList: {
        flex: 1,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    friendAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    friendName: {
        flex: 1,
        fontSize: 18,
        color: '#fff',
    },
    noFriends: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.5)',
        marginTop: 40,
        fontSize: 16,
    },
});
