import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
    FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import ScreenWrapper from '../comman/ScreenWrapper';
import HWSize from '../comman/HWSize';
import fonts from '../comman/fonts';
import { questionData, QuestionType } from '../data/QuestionData';
import { Post_Api } from '../userApi/Request';
import ApiUrl from '../userApi/ApiUrl';

const { width } = Dimensions.get('window');

const Solution = ({ route }: { route: { params: { testId: string } } }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = React.useRef<FlatList>(null);
    const { testId } = route.params;
    const [questionsData, setQuestionData] = useState<QuestionType[]>([]);



    const question = questionsData[currentIndex];

    const transformQuestions = (data: any[]): QuestionType[] => {
        return data.map((item, index) => ({
            id: item._id,
            questionText: item?.question,

            options: item?.options?.map((opt: string) => {
                const [id, ...textParts] = opt.split('.');
                return {
                    id: id?.trim(),
                    text: textParts?.join('.').trim(),
                };
            }),

            correctAnswer: item.correctAnswer,
            type: "Multiple Choice",
            points: 1,
            hint: item?.explanation || "",
            solution: item?.explanation || "",
        }));
    };

    useEffect(() => {
        fetchQuestions()
    }, [])
    const fetchQuestions = async () => {
        try {
            const res = await Post_Api(ApiUrl?.GET_SOLUTIONS, {
                testId: testId,
            });

            console.log("FULL RESPONSE=========:", res.data)
            setQuestionData(transformQuestions(res?.data));
        } catch (error) {
            console.log(error, "error");
        }
    };

    React.useEffect(() => {
        if (flatListRef.current && questionsData.length > 0) {
            flatListRef.current.scrollToIndex({
                index: currentIndex,
                animated: true,
                viewPosition: 0.5,
            });
        }
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < questionsData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBFF" />
            <ScreenWrapper style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Solution Analysis</Text>
                </View>

                {/* Question Plate */}
                <View style={styles.plateWrapper}>
                    <FlatList
                        data={questionsData}
                        keyExtractor={(_, index) => index?.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.plateContent}
                        initialScrollIndex={currentIndex}
                        onScrollToIndexFailed={() => { }}
                        getItemLayout={(_, index) => ({
                            length: 44 + 12,
                            offset: (44 + 12) * index,
                            index,
                        })}
                        ref={flatListRef}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={[
                                    styles.plateItem,
                                    currentIndex === index && styles.activePlateItem
                                ]}
                                onPress={() => setCurrentIndex(index)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.plateText,
                                    currentIndex === index && styles.activePlateText
                                ]}>
                                    {index + 1}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Question Card */}
                    <View style={styles.solutionCard}>
                        <View style={styles.questionHeader}>
                            <View style={styles.questionNumberBadge}>
                                <Text style={styles.questionNumberText}>QUESTION {currentIndex + 1}</Text>
                            </View>
                        </View>

                        <Text style={styles.questionText}>{question?.questionText}</Text>

                        {question?.equation && (
                            <View style={styles.equationContainer}>
                                <Text style={styles.equationText}>{question?.equation}</Text>
                            </View>
                        )}

                        {/* Options */}
                        <View style={styles.optionsContainer}>
                            {question?.options?.map((option) => (
                                <View
                                    key={option.id}
                                    style={[
                                        styles.optionItem,
                                        question.correctAnswer === option.id && styles.correctOptionItem
                                    ]}
                                >
                                    <View style={[
                                        styles.optionLetterBox,
                                        question.correctAnswer === option.id && styles.correctOptionLetterBox
                                    ]}>
                                        <Text style={[
                                            styles.optionLetterText,
                                            question?.correctAnswer === option.id && styles.correctOptionLetterText
                                        ]}>{option.id}</Text>
                                    </View>
                                    <Text style={[
                                        styles.optionText,
                                        question?.correctAnswer === option.id && styles.correctOptionText
                                    ]}>{option.text}</Text>
                                    {question.correctAnswer === option.id && (
                                        <Text style={styles.checkIcon}>✓</Text>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Solution Section */}
                        <View style={styles.divider} />
                        <View style={styles.solutionContainer}>
                            <View style={styles.solutionHeader}>
                                <Text style={styles.solutionIcon}>💡</Text>
                                <Text style={styles.solutionTitle}>Step-by-Step Solution</Text>
                            </View>
                            <Text style={styles.solutionBody}>{question.solution}</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Navigation Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.navButton, styles.prevButton, currentIndex === 0 && styles.disabledButton]}
                        onPress={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        <Text style={[styles.navButtonText, styles.prevButtonText]}>Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navButton, styles.nextButton, currentIndex === questionData.length - 1 && styles.finishButton]}
                        onPress={currentIndex === questionData.length - 1 ? () => navigation?.navigate('Dashboard', { boardId: null, classId: null }) : handleNext}
                    >
                        <Text style={styles.navButtonText}>
                            {currentIndex === questionData.length - 1 ? 'Finish Review' : 'Next Solution'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScreenWrapper>
        </View>
    );
};

export default Solution;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9FAFE',
        paddingHorizontal: HWSize.W_Width20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3EFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 20,
        color: '#4B3E90',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: fonts.LexendBold,
        color: '#1A1A1A',
        flex: 1,
        textAlign: 'center',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    solutionCard: {
        backgroundColor: '#FFF',
        borderRadius: 30,
        padding: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    questionNumberBadge: {
        backgroundColor: '#EEF0FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    questionNumberText: {
        fontSize: 10,
        fontFamily: fonts.LexendBold,
        color: '#4B3E90',
        letterSpacing: 1,
    },
    pointsText: {
        fontSize: 12,
        fontFamily: fonts.Lexend_Regular,
        color: '#757575',
    },
    questionText: {
        fontSize: 20,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
        lineHeight: 28,
        marginBottom: 20,
    },
    equationContainer: {
        backgroundColor: '#F7F8FF',
        padding: 18,
        borderRadius: 15,
        marginBottom: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EFEFFF',
    },
    equationText: {
        fontSize: 22,
        fontFamily: fonts.LexendBold,
        color: '#4B3E90',
        fontStyle: 'italic',
    },
    optionsContainer: {
        gap: 12,
        marginBottom: 25,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#FDFBFF',
        borderWidth: 1,
        borderColor: '#EEF0FF',
    },
    correctOptionItem: {
        backgroundColor: '#E0F2F1',
        borderColor: '#00BFA5',
        borderWidth: 1.5,
    },
    optionLetterBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    correctOptionLetterBox: {
        backgroundColor: '#00BFA5',
    },
    optionLetterText: {
        fontSize: 15,
        fontFamily: fonts.LexendBold,
        color: '#4B3E90',
    },
    correctOptionLetterText: {
        color: '#FFF',
    },
    optionText: {
        fontSize: 15,
        fontFamily: fonts.Lexend_Medium,
        color: '#424242',
        flex: 1,
    },
    correctOptionText: {
        color: '#00695C',
        fontFamily: fonts.LexendBold,
    },
    checkIcon: {
        fontSize: 20,
        color: '#00BFA5',
        marginLeft: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 20,
    },
    solutionContainer: {
        backgroundColor: '#F8F9FF',
        padding: 20,
        borderRadius: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#6E5CE8',
    },
    solutionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    solutionIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    solutionTitle: {
        fontSize: 15,
        fontFamily: fonts.LexendBold,
        color: '#4B3E90',
    },
    solutionBody: {
        fontSize: 14,
        fontFamily: fonts.Lexend_Regular,
        color: '#545454',
        lineHeight: 22,
    },
    footer: {
        flexDirection: 'row',
        paddingVertical: 20,
        gap: 15,
        backgroundColor: '#F9FAFE',
    },
    navButton: {
        flex: 1,
        height: 55,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    prevButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#6E5CE8',
    },
    nextButton: {
        backgroundColor: '#6E5CE8',
    },
    disabledButton: {
        opacity: 0.5,
        borderColor: '#BDBDBD',
    },
    finishButton: {
        backgroundColor: '#00BFA5',
    },
    navButtonText: {
        fontSize: 16,
        fontFamily: fonts.LexendBold,
        color: '#FFF',
    },
    prevButtonText: {
        color: '#6E5CE8',
    },
    plateWrapper: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 10,
        marginBottom: 25,
        marginTop: 5,
        elevation: 4,
        shadowColor: '#6E5CE8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    plateContent: {
        paddingHorizontal: 15,
        alignItems: 'center',
        gap: 12,
    },

    plateItem: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F8F9FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEF0FF',
    },
    activePlateItem: {
        backgroundColor: '#6E5CE8',
        borderColor: '#6E5CE8',
        elevation: 5,
        shadowColor: '#6E5CE8',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        transform: [{ scale: 1.05 }],
    },
    plateText: {
        fontSize: 15,
        fontFamily: fonts.LexendBold,
        color: '#4B3E90',
    },
    activePlateText: {
        color: '#FFFFFF',
    },

});