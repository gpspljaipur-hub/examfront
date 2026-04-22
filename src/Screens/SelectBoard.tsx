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
import Toast from 'react-native-toast-message';

import { useLanguage } from '../context/LanguageContext';
import { Get_Api, GET_API_PUBLIC } from '../userApi/Request';
import ApiUrl from '../userApi/ApiUrl';

import { useDispatch } from 'react-redux';
import { setUserData } from '../store/slice/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectBoard'>;

const SelectBoard = ({ navigation }: Props) => {
    const dispatch = useDispatch();
    const { labels } = useLanguage();
    const [selectedBoard, setSelectedBoard] = useState<string | null>('');
    const [boards, setBoards] = useState<any[]>([]);

    const board = async () => {
        try {
            const res = await GET_API_PUBLIC(ApiUrl.GET_BOARDS);
            setBoards(res?.data || []);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        board()
    }, [])

    const handleContinue = () => {
        if (!selectedBoard) {
            Toast.show({
                type: 'error',
                text1: 'Please select a board',
                text2: 'You must choose a board to continue',
            });
            return;
        }

        dispatch(setUserData({ boardId: selectedBoard }));
        navigation.navigate('SelectClass', {
            boardId: selectedBoard,
        });
    };

    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundColor} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{labels.HeaderTitle}</Text>
                <View style={styles.avatarContainer}>
                    <Image
                        source={require('../assets/images/ai_tutor_character.png')}
                        style={styles.avatarImage}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.stepText}>{labels.Step} 2 {labels.Of} 3</Text>
                        <Text style={styles.percentageText}>66%</Text>
                    </View>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '66%' }]} />
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>{labels.ChooseEducationalPath}</Text>
                    <Text style={styles.subTitle}>
                        {labels.BoardDescription}
                    </Text>
                </View>

                {boards.map((board) => (
                    <TouchableOpacity
                        key={board._id}
                        style={[
                            styles.boardCard,
                            selectedBoard === board._id && styles.selectedBoardCard
                        ]}
                        onPress={() => setSelectedBoard(board._id)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardTop}>
                            {selectedBoard === board._id && (
                                <View style={styles.checkCircle}>
                                    <Text style={styles.checkText}>✓</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.boardTitle}>{board.name}</Text>
                        <Text style={styles.boardDescription}>{board.description}</Text>

                        <View style={styles.cardFooter}>
                            <Text style={[
                                styles.selectLabel,
                                selectedBoard === board._id && styles.selectedLabelText
                            ]}>
                                {selectedBoard === board.id ? labels.Selected : labels.SelectBoard}
                            </Text>
                            {selectedBoard !== board._id && (
                                <Text style={styles.arrowRight}>→</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={styles.notSureCard}>
                    <View style={styles.notSureContent}>
                        <Image
                            source={require('../assets/images/ai_tutor_character.png')}
                            style={styles.notSureImage}
                        />
                        <View style={styles.notSureTextContainer}>
                            <Text style={styles.notSureTitle}>{labels.NotSureTitle}</Text>
                            <Text style={styles.notSureDescription}>
                                {labels.NotSureDesc}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.compareButton}>
                        <Text style={styles.compareButtonText}>{labels.CompareBoards}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomInfo}>
                    <View style={styles.infoIconContainer}>
                        <Text style={styles.infoIcon}>i</Text>
                    </View>
                    <Text style={styles.infoText}>
                        {labels.SelectionAffects}
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.footerActions}>
                <TouchableOpacity style={styles.skipButton}
                    onPress={handleContinue}>
                    <Text style={styles.skipText}>{labels.SkipForNow}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        !selectedBoard && { opacity: 0.5 }
                    ]}
                    onPress={handleContinue}
                    disabled={!selectedBoard}
                >
                    <Text style={styles.continueText}>{labels.Continue}</Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

export default SelectBoard;

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
    avatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#E9E7FF',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    scrollContent: {
        paddingHorizontal: MarginHW.PaddingW24,
        paddingBottom: 100, // For footer actions
    },
    titleContainer: {
        marginTop: MarginHW.MarginH20,
        marginBottom: MarginHW.MarginH24,
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: FontsSize.size28,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
        textAlign: 'center',
        lineHeight: 38,
        paddingVertical: 5,
        includeFontPadding: false,
    },
    subTitle: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 20,
        includeFontPadding: false,
    },
    progressContainer: {
        marginTop: MarginHW.MarginH10,
        marginBottom: MarginHW.MarginH10,
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
    boardCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: MarginHW.PaddingH20,
        marginBottom: MarginHW.MarginH20,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: Colors.background,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    selectedBoardCard: {
        borderColor: Colors.background,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#C5BFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconEmoji: {
        fontSize: 24,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    boardTitle: {
        fontSize: FontsSize.size20,
        fontFamily: fonts.LexendBold,
        color: Colors.nearBlack,
        marginBottom: 6,
    },
    boardDescription: {
        fontSize: FontsSize.size13,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
        lineHeight: 18,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectLabel: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
    selectedLabelText: {
        color: Colors.background,
    },
    arrowRight: {
        marginLeft: 4,
        fontSize: 16,
        color: Colors.background,
    },
    notSureCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: MarginHW.PaddingH20,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    notSureContent: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    notSureImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#F8F6FF',
    },
    notSureTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    notSureTitle: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.LexendBold,
        color: Colors.nearBlack,
        marginBottom: 4,
    },
    notSureDescription: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
        lineHeight: 16,
    },
    compareButton: {
        backgroundColor: '#F3F0FF',
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    compareButtonText: {
        color: Colors.background,
        fontSize: FontsSize.size14,
        fontFamily: fonts.LexendBold,
    },
    bottomInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    infoIconContainer: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: Colors.greyText,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    infoIcon: {
        color: Colors.white,
        fontSize: 10,
        fontFamily: fonts.LexendBold,
    },
    infoText: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
    },
    footerActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.backgroundColor,
        paddingHorizontal: MarginHW.PaddingW24,
        paddingBottom: MarginHW.PaddingH30,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skipButton: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    skipText: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
    continueButton: {
        backgroundColor: Colors.background,
        paddingHorizontal: 40,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueText: {
        color: Colors.white,
        fontSize: FontsSize.size16,
        fontFamily: fonts.LexendBold,
    },
});
