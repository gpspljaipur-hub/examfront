import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Colors } from '../comman/Colors';
import MarginHW from '../comman/MarginHW';
import fonts from '../comman/fonts';
import ScreenWrapper from '../comman/ScreenWrapper';
import { Post_Api } from '../userApi/Request';
import ApiUrl from '../userApi/ApiUrl';

type Props = NativeStackScreenProps<RootStackParamList, 'SyllabusList'>;

const SyllabusList = ({ navigation, route }: Props) => {
    const { subjectId, boardId, classId } = route.params || {};
    const [syllabusData, setSyllabusData] = useState<any[]>([]);
    const getChapters = async () => {
        try {
            const res = await Post_Api(ApiUrl.GET_CHAPTER, {
                subjectId: subjectId,
            });

            const apiData = res?.data || [];
            const formatted = apiData.map((item: any, index: number) => ({
                id: item._id,
                unit: `Unit ${index + 1}`,
                chapters: [
                    {
                        id: item._id,
                        title: item.name,
                        status: 'Not Started',
                        progress: 0,
                    },
                ],
            }));

            setSyllabusData(formatted);

        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getChapters()
    }, [boardId])



    const renderChapter = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.chapterCard}
            onPress={() => navigation.navigate('Question', {
                chapterId: item.id,
                chapterTitle: item.title,
                subjectId: subjectId,
                boardId: boardId,
                classId: classId,
            })}
        >
            <View style={styles.chapterInfo}>
                <Text style={styles.chapterTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderUnit = ({ item }: { item: any }) => (
        <View style={styles.unitContainer}>
            <View style={styles.unitHeader}>
                <Text style={styles.unitLabel}>{item.unit}</Text>
            </View>
            {item.chapters.map((chapter: any) => (
                <View key={chapter.id}>
                    {renderChapter({ item: chapter })}
                </View>
            ))}
        </View>
    );

    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBFF" />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{subjectId}</Text>
                <View style={{ width: 40 }} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {syllabusData.map((unit) => (
                    <View key={unit.id}>
                        {renderUnit({ item: unit })}
                    </View>
                ))}
            </ScrollView>
        </ScreenWrapper>
    );
};

export default SyllabusList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: MarginHW.PaddingW20,
        height: 60,
        backgroundColor: '#FDFBFF',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#F3EFFF',
    },
    backIcon: {
        fontSize: 24,
        color: Colors.background,
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',

    },
    scrollContent: {
        paddingHorizontal: MarginHW.PaddingW20,
        paddingBottom: 40,
    },
    topInfo: {
        marginTop: 20,
        marginBottom: 30,
    },
    syllabusHeading: {
        fontSize: 24,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
    },
    syllabusSubHeading: {
        fontSize: 14,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
        marginTop: 4,
    },
    unitContainer: {
        marginBottom: 24,
    },
    unitHeader: {
        marginBottom: 12,
    },
    unitLabel: {
        fontSize: 12,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    unitTitle: {
        fontSize: 20,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
        marginTop: 2,
    },
    chapterCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    chapterInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    chapterTitle: {
        fontSize: 16,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
        flex: 1,
        marginRight: 10,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
    },
});