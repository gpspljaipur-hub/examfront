import React from 'react';
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
import FontsSize from '../comman/FontsSize';
import MarginHW from '../comman/MarginHW';
import fonts from '../comman/fonts';
import ScreenWrapper from '../comman/ScreenWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'SyllabusList'>;

const SyllabusList = ({ navigation, route }: Props) => {
    const { subjectTitle = 'Mathematics' } = route.params || {};

    const syllabusData = [
        {
            id: '1',
            unit: 'Unit 1',
            title: 'Number Systems',
            chapters: [
                { id: '1-1', title: 'Real Numbers', status: 'Completed', progress: 1 },
                { id: '1-2', title: 'Rational & Irrational Numbers', status: 'In Progress', progress: 0.6 },
            ],
        },
        {
            id: '2',
            unit: 'Unit 2',
            title: 'Algebra',
            chapters: [
                { id: '2-1', title: 'Polynomials', status: 'Not Started', progress: 0 },
                { id: '2-2', title: 'Linear Equations in Two Variables', status: 'Not Started', progress: 0 },
            ],
        },
        {
            id: '3',
            unit: 'Unit 3',
            title: 'Coordinate Geometry',
            chapters: [
                { id: '3-1', title: 'Introduction to Coordinate Geometry', status: 'Not Started', progress: 0 },
            ],
        },
        {
            id: '4',
            unit: 'Unit 4',
            title: 'Geometry',
            chapters: [
                { id: '4-1', title: 'Lines and Angles', status: 'Not Started', progress: 0 },
                { id: '4-2', title: 'Triangles', status: 'Not Started', progress: 0 },
                { id: '4-3', title: 'Quadrilaterals', status: 'Not Started', progress: 0 },
            ],
        },
    ];

    const renderChapter = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.chapterCard}>
            <View style={styles.chapterInfo}>
                <Text style={styles.chapterTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderUnit = ({ item }: { item: any }) => (
        <View style={styles.unitContainer}>
            <View style={styles.unitHeader}>
                <Text style={styles.unitLabel}>{item.unit}</Text>
                <Text style={styles.unitTitle}>{item.title}</Text>
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
                <Text style={styles.headerTitle}>{subjectTitle}</Text>
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