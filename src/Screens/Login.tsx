import React, { useState } from 'react';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../comman/Colors';
import FontsSize from '../comman/FontsSize';
import HWSize from '../comman/HWSize';
import MarginHW from '../comman/MarginHW';
import fonts from '../comman/fonts';
import Toast from 'react-native-toast-message';
import { Post_Api } from '../userApi/Request';
import ApiUrl from '../userApi/ApiUrl';
import { useLanguage } from '../context/LanguageContext';

const Login = ({ navigation }: any) => {
    const { labels, language } = useLanguage();
    const [mobile, setMobile] = useState('');
    const handleGetOTP = async () => {
        if (mobile.length !== 10) {
            Toast.show({
                type: 'error',
                text1: labels.InvalidNumber,
                text2: labels.EnterValid10Digit,
            });
            return;
        }

        try {
            const res = await Post_Api(ApiUrl.CheckNumber, {
                phone: mobile,
            });

            console.log('OTP API RESPONSE:', res?.data?.otp);

            if (res?.data?.message || res?.data?.success) {
                Toast.show({
                    type: 'success',
                    text1: 'OTP Sent',
                });

                navigation.navigate('OTPScreen', {
                    mobile,
                    otpValue: res?.data?.otp,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: res?.data?.message || 'Something went wrong',
                });
            }
        }
        catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Number already registered, please login',
            });
        }
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundColor} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <Image
                        source={require('../assets/images/splash_character.png')}
                        style={styles.headerLogo}
                    />

                    <Text style={styles.welcomeTitle}>{labels.WelcomeTo} <Text style={{ color: Colors.background }}>EduAI</Text></Text>
                    <Text style={styles.subtitle}>{labels.LetsGetLearning}</Text>

                    <View style={styles.inputCard}>
                        <Text style={styles.inputLabel}>{labels.MobileNumber}</Text>

                        <View style={styles.inputWrapper}>
                            <View style={styles.prefixContainer}>
                                <Text style={styles.flag}>🇮🇳</Text>
                                <Text style={styles.prefixText}>+91</Text>
                            </View>
                            <TextInput
                                placeholder={labels.Enter10Digit}
                                placeholderTextColor={Colors.lightGreyText}
                                keyboardType="numeric"
                                maxLength={10}
                                style={styles.input}
                                value={mobile}
                                onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
                            />
                        </View>

                        <TouchableOpacity style={styles.otpButton} onPress={handleGetOTP}>
                            <Text style={styles.otpButtonText}>{labels.GetOTP} →</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            {labels.AgreePart1}
                            <Text style={styles.linkText}>{labels.TermsOfService}</Text>
                            {labels.AgreePart2}
                            <Text style={styles.linkText}>{labels.PrivacyPolicy}</Text>
                            {labels.AgreePart3}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: MarginHW.MarginW20,
        paddingTop: MarginHW.MarginH50,
    },
    headerLogo: {
        width: HWSize.W_Width80,
        height: HWSize.H_Height80,
        borderRadius: 40,
        backgroundColor: '#fff',
        marginBottom: MarginHW.MarginH20,
    },
    welcomeTitle: {
        fontSize: FontsSize.size24,
        fontFamily: fonts.LexendBold,
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_Regular,
        color: '#666',
        marginBottom: MarginHW.MarginH40,
    },
    inputCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 30,
        padding: MarginHW.PaddingH24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    inputLabel: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_SemiBold,
        color: '#555',
        marginBottom: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F6FF',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 60,
        marginBottom: 20,
    },
    prefixContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#DDD',
        paddingRight: 10,
        marginRight: 10,
    },
    flag: {
        fontSize: 20,
        marginRight: 5,
    },
    prefixText: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_SemiBold,
        color: '#333',
    },
    input: {
        flex: 1,
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_Medium,
        color: '#333',
    },
    otpButton: {
        backgroundColor: Colors.background,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: MarginHW.MarginH30,
    },
    otpButtonText: {
        color: Colors.white,
        fontSize: FontsSize.size18,
        fontFamily: fonts.LexendBold,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: MarginHW.MarginH30,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#EEE',
    },
    dividerText: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.Lexend_Medium,
        color: '#AAA',
        marginHorizontal: 10,
    },
    socialButton: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F6FF',
    },
    googleLogo: {
        width: 25,
        height: 25,
        marginRight: 10,
        borderRadius: 40,

    },
    socialButtonText: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_SemiBold,
        color: '#333',
    },
    footer: {
        marginTop: MarginHW.MarginH40,
        marginBottom: MarginHW.MarginH20,
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.Lexend_Regular,
        color: '#999',
        textAlign: 'center',
        lineHeight: 18,
    },
    linkText: {
        color: Colors.background,
        fontFamily: fonts.Lexend_SemiBold,
    },
});
