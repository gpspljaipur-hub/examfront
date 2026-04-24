import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView,
    Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Colors } from '../comman/Colors';
import FontsSize from '../comman/FontsSize';
import MarginHW from '../comman/MarginHW';
import fonts from '../comman/fonts';
import ScreenWrapper from '../comman/ScreenWrapper';
import { useLanguage } from '../context/LanguageContext';
import BottomTab from '../comman/BottomTab';
import Header from '../comman/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'ProgressScreen'>;

const ProgressScreen = ({ navigation }: Props) => {
    const { labels } = useLanguage();
    const [selectedBadgeId, setSelectedBadgeId] = React.useState<string | null>(null);
    const [selectedUserRank, setSelectedUserRank] = React.useState<number | null>(null);
    const profile = useSelector((state: RootState) => state.profile);


    const badges = [
        {
            id: '1',
            title: labels.SevenDayStreak,
            subtitle: labels.UnlockedDaysAgo,
            icon: '🔥',
            color: '#FFF3E0',
        },
        {
            id: '2',
            title: labels.MathWhiz,
            subtitle: labels.PercentInGeometry,
            icon: 'Σ',
            color: '#E3F2FD',
        },
        {
            id: '3',
            title: labels.DoubtDestroyer,
            subtitle: labels.ResolvedDoubts,
            icon: '⚙️',
            color: '#F3E5F5',
        },
        {
            id: '4',
            title: labels.Solution,
            subtitle: labels.SolutionRead,
            icon: '💡',
            color: '#FFF9C4',
        },
    ];

    const leaderboard = [
        {
            rank: 1,
            name: 'Esha Malhotra',
            pts: '2,840',
            title: 'Physics Titan',
        },
        {
            rank: 2,
            name: 'Rahul Jaiswal',
            pts: '2,510',
            title: 'Bio Genius',
        },
        {
            rank: 3,
            name: 'Alex (You)',
            pts: '1,250',
            title: labels.RisingStar,
        },
        {
            rank: 4,
            name: 'Sana Khan',
            pts: '2,490',
            title: 'Grammar Guru',
        },
    ];

    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBFF" />

            {/* Header */}
            <Header />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Greeting */}
                <View style={styles.greetingSection}>
                    <Text style={styles.greetingText}>{labels.GreatJob}, {profile?.fullName || 'User'}! 👋</Text>
                    <Text style={styles.subGreetingText}>{labels.TopPercent}</Text>
                </View>

                {/* Claim Button */}
                <TouchableOpacity style={styles.claimButton}>
                    <Text style={styles.claimButtonText}>{labels.ClaimDailyBonus}</Text>
                </TouchableOpacity>

                {/* Level Card */}
                <TouchableOpacity style={styles.levelCard} activeOpacity={0.9}>
                    <View style={styles.progressCircleContainer}>
                        <View style={styles.progressCircleInner}>
                            <Text style={styles.levelLabel}>{labels.Level}</Text>
                            <Text style={styles.levelNumber}>12</Text>
                        </View>
                    </View>
                    <Text style={styles.xpText}>750 XP to Level 13</Text>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '60%' }]} />
                    </View>
                </TouchableOpacity>

                {/* My Badges */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{labels.MyBadges}</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>{labels.ViewAll}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.sectionSubHeader}>8 of 24 {labels.BadgesUnlocked}</Text>

                <View style={styles.badgesGrid}>
                    {badges.map((badge) => {
                        const isSelected = selectedBadgeId === badge.id;
                        return (
                            <TouchableOpacity
                                key={badge.id}
                                style={[
                                    styles.badgeCard,
                                    isSelected && styles.selectedCard
                                ]}
                                activeOpacity={0.8}
                                onPress={() => setSelectedBadgeId(isSelected ? null : badge.id)}
                            >
                                <View style={[styles.badgeIconContainer, { backgroundColor: badge.color }]}>
                                    <Text style={styles.badgeIcon}>{badge.icon}</Text>
                                </View>
                                <Text style={styles.badgeTitle}>{badge.title}</Text>
                                <Text style={styles.badgeSubtitle}>{badge.subtitle}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Leaderboard */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{labels.LeaderboardPreview}</Text>
                </View>

                {leaderboard.map((user, index) => {
                    const isSelected = selectedUserRank === user.rank;
                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.7}
                            onPress={() => setSelectedUserRank(isSelected ? null : user.rank)}
                            style={[
                                styles.leaderboardItem,
                                isSelected && styles.selectedLeaderboardItem
                            ]}
                        >
                            <Text style={[styles.rankText, user.rank === 1 && { color: '#FFD700' }]}>
                                {user.rank}
                            </Text>
                            <View style={styles.userAvatarContainer}>
                                <Text style={styles.avatarEmoji}>👤</Text>
                            </View>
                            <View style={styles.userInfoContainer}>
                                <Text style={styles.userName}>{user.name}</Text>
                                <Text style={styles.userTitle}>{user.title}</Text>
                            </View>
                            <Text style={styles.userPts}>{user.pts} {labels.Points}</Text>
                        </TouchableOpacity>
                    );
                })}

                <TouchableOpacity style={styles.viewFullButton}>
                    <Text style={styles.viewFullText}>{labels.ViewFullLeaderboard}</Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomTab activeTab="Progress" />
        </ScreenWrapper>
    );
};

export default ProgressScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBFF',
    },

    scrollContent: {
        paddingBottom: 110,
    },
    greetingSection: {
        paddingHorizontal: MarginHW.PaddingW20,
        marginTop: 20,
        marginBottom: 20,
    },
    greetingText: {
        fontSize: 28,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
    },
    subGreetingText: {
        fontSize: 14,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
        lineHeight: 20,
        marginTop: 8,
    },
    claimButton: {
        backgroundColor: Colors.background,
        marginHorizontal: MarginHW.PaddingW20,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    claimButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: fonts.LexendBold,
    },
    levelCard: {
        backgroundColor: '#F8F6FF',
        borderRadius: 30,
        marginHorizontal: MarginHW.PaddingW20,
        padding: 30,
        alignItems: 'center',
        marginBottom: 40,
    },
    progressCircleContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 10,
        borderColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    progressCircleInner: {
        alignItems: 'center',
    },
    levelLabel: {
        fontSize: 12,
        fontFamily: fonts.LexendBold,
        color: '#707070',
        letterSpacing: 1,
    },
    levelNumber: {
        fontSize: 40,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
    },
    xpText: {
        fontSize: 14,
        fontFamily: fonts.LexendBold,
        color: '#707070',
        marginBottom: 10,
    },
    progressBarBackground: {
        width: '100%',
        height: 6,
        backgroundColor: '#E0D8FF',
        borderRadius: 3,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.background,
        borderRadius: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: MarginHW.PaddingW20,
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
    },
    sectionSubHeader: {
        fontSize: 14,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
        paddingHorizontal: MarginHW.PaddingW20,
        marginBottom: 20,
    },
    viewAllText: {
        fontSize: 14,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
    badgesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        justifyContent: 'center',
        marginBottom: 30,
    },
    badgeCard: {
        width: (width - 60) / 2,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        margin: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCard: {
        borderColor: Colors.background,
        backgroundColor: '#F3EFFF',
        elevation: 5,
    },
    badgeIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    badgeIcon: {
        fontSize: 24,
    },
    badgeTitle: {
        fontSize: 14,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
        textAlign: 'center',
        marginBottom: 4,
    },
    badgeSubtitle: {
        fontSize: 10,
        fontFamily: fonts.Lexend_Regular,
        color: '#A0A0A0',
        textAlign: 'center',
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: MarginHW.PaddingW20,
        paddingVertical: 12,
        marginHorizontal: MarginHW.PaddingW20,
        borderRadius: 20,
        marginBottom: 8,
        backgroundColor: '#F8F7FF',
        borderWidth: 1,
        borderColor: '#E9E4FF',
    },
    selectedLeaderboardItem: {
        backgroundColor: '#E9E4FF',
        borderWidth: 2,
        borderColor: Colors.background,
        transform: [{ scale: 1.02 }],
    },
    rankText: {
        fontSize: 16,
        fontFamily: fonts.LexendBold,
        color: '#A0A0A0',
        width: 30,
    },
    userAvatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarEmoji: {
        fontSize: 20,
    },
    userInfoContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
    },
    userTitle: {
        fontSize: 10,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
    },
    userPts: {
        fontSize: 14,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
    viewFullButton: {
        backgroundColor: '#F3EFFF',
        height: 50,
        borderRadius: 25,
        marginHorizontal: MarginHW.PaddingW20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    viewFullText: {
        fontSize: 14,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
});
