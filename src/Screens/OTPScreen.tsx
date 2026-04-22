import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Keyboard
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Colors } from '../comman/Colors';
import FontsSize from '../comman/FontsSize';
import HWSize from '../comman/HWSize';
import MarginHW from '../comman/MarginHW';
import fonts from '../comman/fonts';
import ScreenWrapper from '../comman/ScreenWrapper';

import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'OTPScreen'>;

import { useLanguage } from '../context/LanguageContext';
import { Post_Api } from '../userApi/Request';
import ApiUrl from '../userApi/ApiUrl';

import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slice/authSlice';

const OTPScreen = ({ navigation, route }: any) => {
    const dispatch = useDispatch();
    const { labels, language } = useLanguage();
    const { mobile, otpValue } = route.params;
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 500);
    }, []);

    useEffect(() => {
        if (otpValue) {
            setOtp(otpValue.toString().split(''));
        }
    }, [otpValue]);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        const cleanValue = value.replace(/[^0-9]/g, '');
        if (cleanValue.length === 0 && value.length > 0) return;

        const newOtp = [...otp];
        newOtp[index] = cleanValue.slice(-1);
        setOtp(newOtp);
        if (cleanValue && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        if (canResend) {
            setTimer(30);
            setCanResend(false);
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
            Toast.show({
                type: 'info',
                text1: labels.OTPResent,
                text2: labels.OTPResentDesc
            });
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');

        if (otpCode.length < 4) {
            Toast.show({
                type: 'error',
                text1: labels.InvalidOTP,
                text2: labels.PleaseEnter4Digit,
            });
            return;
        }

        if (otpValue && otpCode !== otpValue.toString()) {
            Toast.show({
                type: 'error',
                text1: 'Invalid OTP',
                text2: 'OTP does not match',
            });
            return;
        }

        try {
            Keyboard.dismiss();

            const res = await Post_Api(ApiUrl.VERIFY_OTP, {
                phone: mobile,
                otp: otpCode,
            });

            console.log("VERIFY RESPONSE:", res?.data?.user?.isVerified);

            if (res?.data?.user?.isVerified == true) {
                Toast.show({
                    type: 'success',
                    text1: res?.data?.message || 'OTP Verified',
                });

                const user = res?.data?.user;
                dispatch(loginSuccess({ 
                    mobile,
                    ...user 
                }));
                if (user?.boardId && user?.classId) {
                    navigation.replace('Dashboard', { 
                        boardId: user.boardId, 
                        classId: user.classId 
                    });
                } else {
                    navigation.navigate('SelectLanguage');
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: res?.data?.message || 'Invalid OTP',
                });
            }

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.response?.data?.message || 'Verification failed',
            });
        }
    };

    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundColor} />

            <View style={styles.header}>
                <Image
                    source={require('../assets/images/splash_character.png')}
                    style={styles.logo}
                />
                <Text style={styles.welcomeTitle}>{labels.VerificationCode}</Text>
                <Text style={styles.subtitle}>
                    {language === 'en' ? (
                        <>{labels.EnterCodeSent} <Text style={styles.phoneText}>+91 {mobile}</Text></>
                    ) : (
                        <><Text style={styles.phoneText}>+91 {mobile}</Text> {labels.EnterCodeSent}</>
                    )}
                </Text>
            </View>

            <View style={styles.card}>
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                inputRefs.current[index] = ref;
                            }}
                            style={[
                                styles.otpInput,
                                { borderColor: digit ? Colors.background : Colors.lightBorder }
                            ]}
                            value={digit}
                            onChangeText={(v) => handleOtpChange(v, index)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                            keyboardType="numeric"
                            maxLength={1}
                        />
                    ))}
                </View>

                <View style={styles.resendContainer}>
                    <Text style={styles.noCodeText}>{labels.DidntReceiveCode} </Text>
                    {canResend ? (
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={styles.resendText}>{labels.Resend}</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.timerText}>{labels.ResendIn} {timer}s</Text>
                    )}
                </View>

                <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
                    <Text style={styles.verifyButtonText}>{labels.VerifyProceed}</Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

export default OTPScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    header: {
        alignItems: 'center',
        paddingTop: MarginHW.MarginH60,
        marginBottom: MarginHW.MarginH40,
    },
    logo: {
        width: HWSize.W_Width80,
        height: HWSize.H_Height80,
        borderRadius: 40,
        marginBottom: MarginHW.MarginH24,
    },
    welcomeTitle: {
        fontSize: FontsSize.size24,
        fontFamily: fonts.LexendBold,
        color: Colors.nearBlack,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
        textAlign: 'center',
        paddingHorizontal: MarginHW.PaddingW40,
    },
    phoneText: {
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.background,
    },
    card: {
        backgroundColor: Colors.white,
        marginHorizontal: MarginHW.MarginW20,
        borderRadius: 30,
        padding: MarginHW.PaddingH24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: MarginHW.MarginH30,
    },
    otpInput: {
        width: HWSize.W_Width60,
        height: HWSize.H_Height60,
        borderRadius: 15,
        borderWidth: 1.5,
        textAlign: 'center',
        fontSize: FontsSize.size24,
        fontFamily: fonts.LexendBold,
        color: Colors.nearBlack,
        backgroundColor: '#F8F6FF',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: MarginHW.MarginH30,
    },
    noCodeText: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
    },
    resendText: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
    timerText: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_Medium,
        color: Colors.greyText,
    },
    verifyButton: {
        backgroundColor: Colors.background,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyButtonText: {
        color: Colors.white,
        fontSize: FontsSize.size18,
        fontFamily: fonts.LexendBold,
    },
    backButton: {
        marginTop: MarginHW.MarginH30,
        alignSelf: 'center',
    },
    backButtonText: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.greyText,
    },
});
