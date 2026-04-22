import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Colors } from '../comman/Colors';
import FontsSize from '../comman/FontsSize';
import MarginHW from '../comman/MarginHW';
import fonts from '../comman/fonts';
import ScreenWrapper from '../comman/ScreenWrapper';

import { useLanguage } from '../context/LanguageContext';
import { Post_Api } from '../userApi/Request';
import ApiUrl from '../userApi/ApiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setProfile } from '../store/slice/profileSlice';

import { setUserData } from '../store/slice/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectClass'>;

const STORAGE_KEYS = {
    CLASSID: 'classId',
};


const SelectClass = ({ navigation, route }: Props) => {
    const { boardId } = route.params;
    console.log(boardId, "boardIdboardId");

    const { language, labels } = useLanguage();
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [classes, setClasses] = useState<any[]>([]);
    const userData = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();


    const getClass = async () => {
        try {
            const res = await Post_Api(ApiUrl.GET_CLASSES, {
                boardId: boardId,
            });
            setClasses(res?.data || []);

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getClass()
    }, [boardId])


    // const handleContinue = async () => {
    //     try {
    //         const res = await Post_Api(ApiUrl.ADD_PROFILE, {
    //             mobile: userData?.mobile,
    //             boardId: boardId,
    //             classId: selectedClass,
    //             language: language,
    //         });
    //         console.log(res, "res=====");
    //         if (res?.status == 201) {
    //             dispatch(setProfile(res?.data));
    //             navigation.navigate('Dashboard', {
    //                 boardId: boardId,
    //                 classId: selectedClass
    //             });


    //         }
    //     } catch (error) {
    //         console.log(error, "error");

    //     }


    //     // await AsyncStorage.setItem(STORAGE_KEYS.CLASS, classes.find(c => c._id === selectedClass)?.name || '');
    //     // await AsyncStorage.setItem(STORAGE_KEYS.CLASSID, selectedClass?.toString() || '');
    //     // navigation.navigate('Dashboard', {
    //     //     boardId: boardId,
    //     //     classId: selectedClass
    //     // });
    // };

    const handleContinue = async () => {
        try {
            const res = await Post_Api(ApiUrl.ADD_PROFILE, {
                mobile: userData?.mobile,
                boardId: boardId,
                classId: selectedClass,
                language: language,
            });

            if (res?.status === 201) {

                const profileRes = await Post_Api(ApiUrl.GET_PROFILE, {
                    mobile: userData?.mobile,
                });

                const profile = profileRes?.data;
                dispatch(setProfile({
                    mobile: profile.mobile,
                    boardId: profile.boardId._id,
                    classId: profile.classId._id,
                    language: profile.language,
                    boardName: profile.boardId.name,
                    className: profile.classId.name,
                }));

                navigation.navigate('Dashboard');

            }
        } catch (error) {
            console.log(error, "error");
        }
    };

    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundColor} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{labels.HeaderTitle}</Text>
                <View style={styles.helpButton}>
                    <Text style={styles.helpIcon}>?</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.stepText}>{labels.Step} 3 {labels.Of} 3</Text>
                        <Text style={styles.percentageText}>100%</Text>
                    </View>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '100%' }]} />
                    </View>
                </View>

                <View style={styles.tutorContainer}>
                    <Image
                        source={require('../assets/images/ai_tutor_character.png')}
                        style={styles.tutorImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeTitle}>
                        {language === 'en' ? (
                            <>{labels.WelcomeToCloud} <Text style={styles.cloudText}>{labels.Cloud}</Text></>
                        ) : (
                            <><Text style={styles.cloudText}>{labels.Cloud}</Text> {labels.WelcomeToCloud}</>
                        )}
                    </Text>
                    <Text style={styles.welcomeDescription}>
                        {labels.TutorDescription}
                    </Text>
                </View>

                <View style={styles.gridContainer}>
                    {Array?.isArray(classes) && classes.map((item) => (
                        <TouchableOpacity
                            key={item._id}
                            style={[
                                styles.classCard,
                                selectedClass === item._id && styles.selectedClassCard
                            ]}
                            onPress={() => setSelectedClass(item._id)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.classNumber,
                                    selectedClass === item._id && styles.selectedText
                                ]}
                            >
                                {item.name}
                            </Text>

                            {selectedClass === item._id && (
                                <View style={styles.checkmarkContainer}>
                                    <Text style={styles.checkmark}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                    >
                        <Text style={styles.continueButtonText}>{labels.Continue}  →</Text>
                    </TouchableOpacity>
                    <Text style={styles.footerNote}>
                        {labels.FooterNote}
                    </Text>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default SelectClass;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: MarginHW.PaddingW20,
        height: 60,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backArrow: {
        fontSize: FontsSize.size24,
        color: Colors.background,
    },
    headerTitle: {
        fontSize: FontsSize.size20,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
    helpButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0EFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpIcon: {
        fontSize: FontsSize.size14,
        color: Colors.background,
        fontFamily: fonts.LexendBold,
    },
    scrollContent: {
        paddingHorizontal: MarginHW.PaddingW24,
        paddingBottom: MarginHW.PaddingH30,
    },
    progressContainer: {
        marginTop: MarginHW.MarginH10,
        marginBottom: MarginHW.MarginH20,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stepText: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.LexendBold,
        color: Colors.nearBlack,
    },
    percentageText: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: '#E9E7FF',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.background,
        borderRadius: 3,
    },
    tutorContainer: {
        alignItems: 'center',
        marginVertical: MarginHW.MarginH10,
    },
    tutorImage: {
        width: 180,
        height: 180,
    },
    welcomeCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: MarginHW.PaddingH20,
        marginBottom: MarginHW.MarginH20,
        shadowColor: Colors.background,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    welcomeTitle: {
        fontSize: FontsSize.size24,
        fontFamily: fonts.LexendBold,
        color: Colors.nearBlack,
        marginBottom: 8,
    },
    cloudText: {
        color: Colors.background,
    },
    welcomeDescription: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
        lineHeight: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    classCard: {
        width: '30%',
        backgroundColor: '#F7F6FF',
        borderRadius: 16,
        paddingVertical: MarginHW.PaddingH16,
        alignItems: 'center',
        marginBottom: MarginHW.MarginH16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedClassCard: {
        backgroundColor: '#C5BFFF',
        borderColor: Colors.background,
    },
    classNumber: {
        fontSize: FontsSize.size24,
        fontFamily: fonts.LexendBold,
        color: Colors.nearBlack,
    },
    classLabel: {
        fontSize: FontsSize.size10,
        fontFamily: fonts.LexendBold,
        color: Colors.greyText,
        marginTop: 2,
    },
    selectedText: {
        color: Colors.background,
    },
    checkmarkContainer: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: Colors.white,
        fontSize: 10,
    },
    footer: {
        marginTop: MarginHW.MarginH10,
        alignItems: 'center',
    },
    continueButton: {
        backgroundColor: Colors.background,
        width: '100%',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: MarginHW.MarginH16,
    },
    continueButtonText: {
        color: Colors.white,
        fontSize: FontsSize.size18,
        fontFamily: fonts.LexendBold,
    },
    footerNote: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
    },
});
