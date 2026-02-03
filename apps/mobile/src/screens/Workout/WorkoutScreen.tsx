import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { useTheme } from '../../context/ThemeContext';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TensorCamera = cameraWithTensors(Camera);
const { width, height } = Dimensions.get('window');

const WorkoutScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isModelReady, setIsModelReady] = useState(false);
    const [reps, setReps] = useState(0);
    const [status, setStatus] = useState('VERIFYING IDENTITY...');
    const [isWorkingOut, setIsWorkingOut] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const posenetModel = useRef<posenet.PoseNet | null>(null);
    const counterState = useRef<'up' | 'down'>('up');
    const lastRepTime = useRef(0);

    const { theme, mode } = useTheme();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');

            await tf.ready();
            posenetModel.current = await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                inputResolution: { width: 224, height: 224 },
                multiplier: 0.75
            });
            setIsModelReady(true);
        })();
    }, []);

    const handleCameraStream = (images: IterableIterator<tf.Tensor3D>) => {
        const loop = async () => {
            if (!isWorkingOut && isVerified) return;

            const nextImageTensor = images.next().value;
            if (!nextImageTensor || !posenetModel.current) return;

            const pose = await posenetModel.current.estimateSinglePose(nextImageTensor, {
                flipHorizontal: false
            });

            // User Verification Phase
            if (!isVerified) {
                const nose = pose.keypoints.find(k => k.part === 'nose');
                if (nose && nose.score > 0.9) {
                    setIsVerified(true);
                    setStatus('IDENTITY VERIFIED. READY?');
                }
            }

            // Rep Counting Phase
            if (isVerified && isWorkingOut) {
                const nose = pose.keypoints.find(k => k.part === 'nose');
                const lShoulder = pose.keypoints.find(k => k.part === 'leftShoulder');
                const rShoulder = pose.keypoints.find(k => k.part === 'rightShoulder');

                if (nose && nose.score > 0.5 && lShoulder && rShoulder) {
                    const avgShoulderY = (lShoulder.position.y + rShoulder.position.y) / 2;
                    const noseY = nose.position.y;

                    // Simplified heuristic: nose moving below shoulder line (down) and back above (up)
                    if (noseY > avgShoulderY + 20) {
                        if (counterState.current === 'up') {
                            counterState.current = 'down';
                            setStatus('GO UP!');
                        }
                    } else if (noseY < avgShoulderY - 10) {
                        if (counterState.current === 'down') {
                            const now = Date.now();
                            if (now - lastRepTime.current > 1000) {
                                setReps(prev => prev + 1);
                                counterState.current = 'up';
                                setStatus('GREAT! DOWN.');
                                lastRepTime.current = now;
                            }
                        }
                    }
                }
            }

            tf.dispose([nextImageTensor]);
            requestAnimationFrame(loop);
        };
        loop();
    };

    if (hasPermission === null) return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
    if (hasPermission === false) return <View style={styles.container}><Text>No access to camera</Text></View>;

    return (
        <View style={styles.container}>
            <TensorCamera
                style={styles.camera}
                type={Camera.Constants.Type.front}
                onReady={handleCameraStream}
                autorender={true}
                resizeHeight={224}
                resizeWidth={224}
                resizeDepth={3}
            />

            {/* Top Glass Header */}
            <View style={styles.overlay}>
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                        <BlurView intensity={20} tint={mode} style={styles.blurBtn}>
                            <Icon name="close" size={24} color="#fff" />
                        </BlurView>
                    </TouchableOpacity>
                    <View style={[styles.telemetryTag, isVerified && { borderColor: '#10b981' }]}>
                        <Text style={[styles.tagText, isVerified && { color: '#10b981' }]}>{isVerified ? 'BIOMETRIC SECURE' : 'SCANNING IDENTITY...'}</Text>
                    </View>
                </View>

                {/* Counter UI */}
                <View style={styles.centerBox}>
                    {!isVerified ? (
                        <View style={styles.scanFrame}>
                            <View style={[styles.scanCorner, styles.tl]} />
                            <View style={[styles.scanCorner, styles.tr]} />
                            <View style={[styles.scanCorner, styles.bl]} />
                            <View style={[styles.scanCorner, styles.br]} />
                            <Icon name="face-recognition" size={80} color="rgba(255,255,255,0.2)" />
                        </View>
                    ) : (
                        <View style={styles.repContainer}>
                            <Text style={styles.statusText}>{status.toUpperCase()}</Text>
                            <View style={styles.repCircle}>
                                <Text style={styles.repCount}>{reps}</Text>
                                <Text style={styles.repLabel}>PUSH-UPS</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    onPress={() => isVerified && setIsWorkingOut(!isWorkingOut)}
                    disabled={!isVerified}
                    style={[styles.bigBtn, { backgroundColor: !isVerified ? 'rgba(255,255,255,0.1)' : (isWorkingOut ? '#ff4444' : theme.primary) }]}
                >
                    <Text style={styles.bigBtnText}>
                        {!isVerified ? 'WAITING FOR SCAN...' : (isWorkingOut ? 'TERMINATE SESSION' : 'COMMENCE MISSION')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        padding: 32,
        paddingTop: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    topRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    blurBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    telemetryTag: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    tagText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    centerBox: {
        alignItems: 'center',
    },
    repContainer: {
        alignItems: 'center',
    },
    scanFrame: {
        width: 260,
        height: 320,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    scanCorner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#10b981',
        borderWidth: 4,
    },
    tl: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 20 },
    tr: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 20 },
    bl: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 20 },
    br: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 20 },
    statusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 20,
        opacity: 0.8,
    },
    repCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 4,
        borderColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    repCount: {
        fontSize: 84,
        fontWeight: '900',
        color: '#fff',
    },
    repLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginTop: -10,
    },
    bigBtn: {
        height: 64,
        width: '100%',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2,
    }
});

export default WorkoutScreen;


