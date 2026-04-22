import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../comman/Colors';
import FontsSize from '../comman/FontsSize';
import MarginHW from '../comman/MarginHW';
import fonts from '../comman/fonts';
import HWSize from '../comman/HWSize';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const SplashScreen = ({ navigation }: any) => {
    const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();


        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
        }).start();

        const timer = setTimeout(() => {
            if (isLoggedIn) {
                navigation.replace('Dashboard', { 
                    boardId: user?.boardId || 'default', 
                    classId: user?.classId || 'default' 
                });
            } else {
                navigation.replace('Login');
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [fadeAnim, progressAnim, navigation, isLoggedIn]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundColor} />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/images/splash_character.png')}
                        style={styles.character}
                    />
                </View>
                <Text style={styles.logo}>EduAI</Text>

                <Text style={styles.tagline}>AI Personal Tutor for Every Student</Text>

                <View style={styles.loaderContainer}>
                    <View style={styles.progressBarBackground}>
                        <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
                    </View>
                    <Text style={styles.loadingText}>PERSONALIZING YOUR EXPERIENCE...</Text>
                </View>
            </Animated.View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>INTELLIGENT LEARNING SYSTEMS</Text>
            </View>
        </SafeAreaView>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: MarginHW.MarginH40,
    },
    content: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        width: HWSize.W_Width220,
        height: HWSize.H_Height220,
        backgroundColor: Colors.white,
        borderRadius: 40,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: MarginHW.MarginH30,
    },
    character: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    logo: {
        fontSize: FontsSize.size42,
        fontFamily: fonts.Lexend_ExtraBold,
        color: Colors.background,
        marginBottom: MarginHW.MarginH10,
    },
    logoAi: {
        color: Colors.background,
    },
    tagline: {
        fontSize: FontsSize.size16,
        color: Colors.noteText,
        fontFamily: fonts.Lexend_Medium,
        textAlign: 'center',
    },
    loaderContainer: {
        marginTop: MarginHW.MarginH100,
        width: '80%',
        alignItems: 'center',
    },
    progressBarBackground: {
        width: '100%',
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: MarginHW.MarginH16,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.background,
        borderRadius: 4,
    },
    loadingText: {
        fontSize: FontsSize.size12,
        color: Colors.noteText,
        fontFamily: fonts.LexendBold,
        letterSpacing: 1,
    },
    footer: {
        marginBottom: MarginHW.MarginH20,
    },
    footerText: {
        fontSize: FontsSize.size14,
        color: '#888',
        fontFamily: fonts.Lexend_SemiBold,
        letterSpacing: 1.5,
    },
});
