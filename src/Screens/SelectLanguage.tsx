import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Colors } from '../comman/Colors';
import FontsSize from '../comman/FontsSize';
import MarginHW from '../comman/MarginHW';
import fonts from '../comman/fonts';
import ScreenWrapper from '../comman/ScreenWrapper';
import { useLanguage } from '../context/LanguageContext';
type Props = NativeStackScreenProps<RootStackParamList, 'SelectLanguage'>;
const SelectLanguage = ({ navigation }: Props) => {
    const { language, setLanguage, labels } = useLanguage();
    const languages = [
        {
            id: 'en' as const,
            title: labels.English,
            subtitle: labels.EnglishSubtitle,
            icon: 'US',
        },
        {
            id: 'hi' as const,
            title: labels.Hindi,
            subtitle: labels.HindiSubtitle,
            icon: '文A',
        },
    ];

    const handleComplete = () => {
        navigation.navigate('SelectBoard');
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

            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={styles.stepText}>{labels.Step} 1 {labels.Of} 3</Text>
                    <Text style={styles.percentageText}>33%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: '33%' }]} />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.mainTitle}>{labels.YourJourney}</Text>
                <Text style={styles.description}>
                    {labels.ChooseLanguageDescription}
                </Text>
                {languages.map((lang) => (
                    <TouchableOpacity
                        key={lang.id}
                        style={[
                            styles.languageCard,
                            language === lang.id && styles.selectedLanguageCard
                        ]}
                        onPress={() => setLanguage(lang.id)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.iconText}>{lang.icon}</Text>
                            </View>
                            <View style={[
                                styles.radioButton,
                                language === lang.id && styles.radioButtonSelected
                            ]}>
                                {language === lang.id && <View style={styles.radioButtonInner} />}
                            </View>
                        </View>
                        <Text style={styles.languageTitle}>{lang.title}</Text>
                        <Text style={styles.languageSubtitle}>{lang.subtitle}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.completeButton}
                    onPress={handleComplete}
                >
                    <Text style={styles.completeButtonText}>{labels.Continue}</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}>
                    {labels.BilingualPart1}
                    <Text style={styles.bilingualText}>{labels.BilingualText}</Text>
                    {labels.BilingualPart2}
                </Text>
            </View>
        </ScreenWrapper>
    );
};

export default SelectLanguage;

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
    stepText: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
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
    progressContainer: {
        marginTop: MarginHW.MarginH10,
        paddingHorizontal: MarginHW.PaddingW24,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
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
    content: {
        paddingHorizontal: MarginHW.PaddingW24,
        paddingTop: MarginHW.PaddingH30,
    },
    mainTitle: {
        fontSize: FontsSize.size32,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
        lineHeight: 44,
        paddingVertical: 5,
        includeFontPadding: false,
        marginBottom: MarginHW.MarginH16,
    },
    description: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
        lineHeight: 22,
        includeFontPadding: false,
        marginBottom: MarginHW.MarginH40,
    },
    languageCard: {
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
    selectedLanguageCard: {
        borderColor: Colors.background,
        backgroundColor: '#F8F6FF',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: MarginHW.MarginH12,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E9E7FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: FontsSize.size18,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Colors.lightBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: Colors.background,
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.background,
    },
    languageTitle: {
        fontSize: FontsSize.size20,
        fontFamily: fonts.LexendBold,
        color: Colors.nearBlack,
        marginBottom: 4,
    },
    languageSubtitle: {
        fontSize: FontsSize.size13,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
        lineHeight: 18,
    },
    footer: {
        marginTop: 'auto',
        paddingHorizontal: MarginHW.PaddingW24,
        paddingBottom: MarginHW.PaddingH30,
        alignItems: 'center',
    },
    completeButton: {
        backgroundColor: Colors.background,
        width: '100%',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: MarginHW.MarginH20,
    },
    completeButtonText: {
        color: Colors.white,
        fontSize: FontsSize.size18,
        fontFamily: fonts.LexendBold,
    },
    footerText: {
        fontSize: FontsSize.size13,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
    },
    bilingualText: {
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
});
