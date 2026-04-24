import React, { useEffect } from 'react';
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
import { Post_Api } from '../userApi/Request';
import ApiUrl from '../userApi/ApiUrl';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { Images } from '../assets/images/Images';


const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const Dashboard = ({ navigation, route }: Props) => {
    const { labels } = useLanguage();
    const [subjects, setSubjects] = React.useState<any[]>([]);
    const profile = useSelector((state: RootState) => state.profile);
    console.log(profile, "profileprofileprofileprofileprofile");


    const getIcon = (name: any) => {
        const n = name.toLowerCase();

        if (n.includes('math')) return '📐';
        if (n.includes('science')) return '🧬';
        if (n.includes('english')) return '📖';
        if (n.includes('hindi')) return '📝';
        if (n.includes('sanskrit')) return '📜';

        return '📚'; // default
    };

    const getColor = (name: any) => {
        const colors = ['#E0F2F1', '#E8EAF6', '#FFF3E0', '#FCE4EC'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const getSubjects = async () => {
        try {
            const res = await Post_Api(ApiUrl.GET_SUBJECT, {
                // boardId: boardId,
                classId: profile.classId,
            });

            const apiData = res?.data || [];

            const formatted = apiData.map((item: any) => ({
                id: item._id,
                title: item.name,
                subtitle: `${item.classId?.name} • ${item.classId?.boardId?.name}`,
                icon: getIcon(item.name),
                progress: Math.random(),
                color: getColor(item.name),
            }));

            setSubjects(formatted);

        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getSubjects()
    }, [profile?.boardId, profile?.classId])

    const recommended = [
        {
            id: '1',
            title: 'Algebra Basics: Solving for X',
            duration: '15 min',
            level: 'Beginner',
            category: 'MATH • ALGEBRA',
            // image: require('../assets/images/algebra_lesson.png'),
        },
        {
            id: '2',
            title: "Newton's Laws of Motion",
            duration: '22 min',
            level: 'Intermediate',
            category: 'SCIENCE • PHYSICS',
            // image: require('../assets/images/physics_lesson.png'),
        },
    ];

    const handleChat = () => {
        navigation.navigate('AiTutor');
    };
    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBFF" />

            {/* Header */}
            <Header />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Greeting */}
                <View style={styles.greetingSection}>
                    <Text style={styles.greetingText}>{labels.Hello}, {profile?.fullName || 'User'}!</Text>
                    <Text style={styles.subGreetingText}>{labels.LetsLearnSomethingNew}</Text>
                </View>

                {/* Streak Card */}
                <View style={styles.streakCard}>
                    <View style={styles.streakHeader}>
                        <View style={styles.streakInfo}>
                            <View style={styles.lightningIconContainer}>
                                <Text style={styles.lightningIcon}>⚡</Text>
                            </View>
                            <Text style={styles.streakTitle}>5 {labels.DayStreak}</Text>
                        </View>
                        <Text style={styles.badgeText}>{labels.FocusMasterBadge}</Text>
                    </View>

                    <View style={styles.goalSection}>
                        <View style={styles.progressCircleContainer}>
                            {/* Simplified Progress Circle */}
                            <View style={styles.progressCircleInner}>
                                <Text style={styles.progressPercentage}>75%</Text>
                            </View>
                        </View>
                        <View style={styles.goalTextContainer}>
                            <Text style={styles.goalTitle}>{labels.DailyGoal}</Text>
                            <Text style={styles.goalProgress}>45/60 {labels.MinsCompleted}</Text>
                        </View>
                    </View>
                </View>

                {/* AI Tutor Card */}
                <TouchableOpacity style={styles.aiTutorCard} activeOpacity={0.9}>
                    <View style={styles.aiTutorContent}>
                        <Text style={styles.aiTutorTitle}>{labels.StuckOnConcept}</Text>
                        <Text style={styles.aiTutorDesc}>{labels.AITutorReady}</Text>
                        <TouchableOpacity style={styles.askButton}
                            onPress={handleChat}>
                            <Text style={styles.askButtonText}>{labels.AskAITutor}</Text>
                            <Text style={styles.arrowIcon}> →</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        // source={require('src/assets/images/ai_tutor_character.png')}
                        source={Images.aiTutor}
                        style={styles.aiTutorCharacter}
                    />
                </TouchableOpacity>

                {/* Your Subjects */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{labels.YourSubjects}</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>{labels.ViewAll}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                    {subjects.map((subject) => (
                        <TouchableOpacity key={subject.id} style={styles.subjectCard}
                            onPress={() => navigation.navigate('SyllabusList', { subjectId: subject.id, boardId: profile?.boardId, classId: profile?.classId, subjectName: subject.title, nextScreen: 'Question' })}
                        >
                            <View style={[styles.subjectIconContainer, { backgroundColor: subject.color }]}>
                                <Text style={styles.subjectIcon}>{subject.icon}</Text>
                            </View>
                            <Text style={styles.subjectTitle}>{subject.title}</Text>
                            <Text style={styles.subjectSubtitle}>{subject.subtitle}</Text>
                            <View style={styles.subjectProgressBar}>
                                <View style={[styles.subjectProgressFill, { width: `${subject.progress * 100}%` }]} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Recommended */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{labels.RecommendedForYou}</Text>
                </View>

                {recommended.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.recommendedCard}>
                        {/* <Image source={item.image} style={styles.recommendedImage} /> */}
                        <View style={styles.recommendedInfo}>
                            <Text style={styles.recommendedCategory}>{item.category}</Text>
                            <Text style={styles.recommendedTitle}>{item.title}</Text>
                            <View style={styles.recommendedMeta}>
                                <Text style={styles.metaIcon}>🕒</Text>
                                <Text style={styles.metaText}>{item.duration}</Text>
                                <Text style={[styles.metaIcon, { marginLeft: 10 }]}>📈</Text>
                                <Text style={styles.metaText}>{item.level}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.playButton}>
                            <Text style={styles.playIcon}>▶</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <BottomTab activeTab="Home" />
        </ScreenWrapper>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBFF',
    },
    scrollContent: {
        paddingBottom: 100,
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
        fontSize: 16,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
        marginTop: 4,
    },
    streakCard: {
        backgroundColor: '#F3EFFF',
        borderRadius: 30,
        marginHorizontal: MarginHW.PaddingW20,
        padding: 24,
        marginBottom: 20,
    },
    streakHeader: {
        marginBottom: 20,
    },
    streakInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    lightningIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    lightningIcon: {
        fontSize: 20,
    },
    streakTitle: {
        fontSize: 22,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
    },
    badgeText: {
        fontSize: 14,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
        lineHeight: 20,
    },
    goalSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressCircleContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#E0D8FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 6,
        borderColor: Colors.background,
    },
    progressCircleInner: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#F3EFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressPercentage: {
        fontSize: 14,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
    goalTextContainer: {
        marginLeft: 16,
    },
    goalTitle: {
        fontSize: 16,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
    },
    goalProgress: {
        fontSize: 12,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
        marginTop: 2,
    },
    aiTutorCard: {
        height: 200,
        borderRadius: 30,
        marginHorizontal: MarginHW.PaddingW20,
        marginBottom: 30,
        backgroundColor: Colors.background,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    aiTutorContent: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    aiTutorTitle: {
        fontSize: 22,
        fontFamily: fonts.LexendBold,
        color: '#FFF',
        marginBottom: 10,
    },
    aiTutorDesc: {
        fontSize: 14,
        fontFamily: fonts.Lexend_Regular,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 20,
        marginBottom: 20,
    },
    askButton: {
        backgroundColor: '#FFF',
        height: 48,
        borderRadius: 24,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    askButtonText: {
        fontSize: 16,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
    arrowIcon: {
        fontSize: 18,
        color: Colors.background,
    },
    aiTutorCharacter: {
        width: 140,
        height: '100%',
        opacity: 0.3,
        position: 'absolute',
        right: -20,
        bottom: -20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: MarginHW.PaddingW20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
    },
    viewAllText: {
        fontSize: 14,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
    },
    horizontalScroll: {
        paddingLeft: MarginHW.PaddingW20,
        paddingRight: 10,
        marginBottom: 30,
    },
    subjectCard: {
        width: 220,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    subjectIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    subjectIcon: {
        fontSize: 24,
    },
    subjectTitle: {
        fontSize: 18,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
        marginBottom: 4,
    },
    subjectSubtitle: {
        fontSize: 12,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
        marginBottom: 16,
    },
    subjectProgressBar: {
        height: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    subjectProgressFill: {
        height: '100%',
        backgroundColor: '#1B6A7F',
        borderRadius: 3,
    },
    recommendedCard: {
        flexDirection: 'row',
        backgroundColor: '#F8F6FF',
        borderRadius: 24,
        marginHorizontal: MarginHW.PaddingW20,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    recommendedImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EEE',
    },
    recommendedInfo: {
        flex: 1,
        marginLeft: 16,
    },
    recommendedCategory: {
        fontSize: 10,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
        letterSpacing: 1,
        marginBottom: 4,
    },
    recommendedTitle: {
        fontSize: 16,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
        marginBottom: 8,
    },
    recommendedMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    metaText: {
        fontSize: 12,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
    },
    playButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    playIcon: {
        fontSize: 14,
        color: Colors.background,
        marginLeft: 2,
    },
});
