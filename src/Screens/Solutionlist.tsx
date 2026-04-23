import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '../comman/ScreenWrapper'
import Header from '../comman/Header'
import BottomTab from '../comman/BottomTab'
import { useLanguage } from '../context/LanguageContext'
import { Colors } from '../comman/Colors'
import MarginHW from '../comman/MarginHW'
import fonts from '../comman/fonts'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Post_Api } from '../userApi/Request';
import ApiUrl from '../userApi/ApiUrl';
type Props = NativeStackScreenProps<RootStackParamList, 'Solutionlist'>;
const Solutionlist = ({ navigation, route }: Props) => {
    const { labels } = useLanguage();
    const [subjects, setSubjects] = React.useState<any[]>([]);
    const profile = useSelector((state: RootState) => state.profile);

    const getIcon = (name: any) => {
        const n = name.toLowerCase();

        if (n.includes('math')) return '📐';
        if (n.includes('science')) return '🧬';
        if (n.includes('english')) return '📖';
        if (n.includes('hindi')) return '📝';
        if (n.includes('sanskrit')) return '📜';

        return '📚';
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
    return (
        <ScreenWrapper>
            <Header />
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{labels.YourSubjects}</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>{labels.ViewAll}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.verticalScroll}>
                {subjects.map((subject) => (
                    <TouchableOpacity key={subject.id} style={styles.subjectCard}
                        onPress={() => navigation.navigate('SyllabusList', { subjectId: subject.id, boardId: profile?.boardId, classId: profile?.classId, subjectName: subject.title, nextScreen: 'DetailPage' })}
                    >
                        <View style={styles.cardHeader}>
                            <View style={[styles.subjectIconContainer, { backgroundColor: subject.color }]}>
                                <Text style={styles.subjectIcon}>{subject.icon}</Text>
                            </View>
                            <View style={styles.subjectTextContainer}>
                                <Text style={styles.subjectTitle}>{subject.title}</Text>
                                <Text style={styles.subjectSubtitle}>{subject.subtitle}</Text>
                            </View>
                        </View>
                        <View style={styles.subjectProgressBar}>
                            <View style={[styles.subjectProgressFill, { width: `${subject.progress * 100}%` }]} />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <BottomTab />
        </ScreenWrapper>
    )
}

export default Solutionlist

const styles = StyleSheet.create({
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
    verticalScroll: {
        paddingHorizontal: MarginHW.PaddingW20,
        paddingBottom: 30,
    },
    subjectCard: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    subjectIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subjectIcon: {
        fontSize: 28,
    },
    subjectTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    subjectTitle: {
        fontSize: 18,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
        marginBottom: 4,
    },
    subjectSubtitle: {
        fontSize: 13,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
    },
    subjectProgressBar: {
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    subjectProgressFill: {
        height: '100%',
        backgroundColor: '#1B6A7F',
        borderRadius: 4,
    },
})