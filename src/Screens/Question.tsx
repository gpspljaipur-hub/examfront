import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Dimensions,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Colors } from '../comman/Colors';
import fonts from '../comman/fonts';
import MarginHW from '../comman/MarginHW';
import ScreenWrapper from '../comman/ScreenWrapper';
import { questionData, QuestionType } from '../data/QuestionData';
import ApiUrl from '../userApi/ApiUrl';
import { Post_Api } from '../userApi/Request';
import { useLanguage } from '../hooks/useLanguage';
import { useDispatch, useSelector } from 'react-redux';
import { saveAnswer, setQuestions, setTestId, submitTest } from '../store/slice/testSlice';
import { RootState } from '../store/store';

type Props = NativeStackScreenProps<RootStackParamList, 'Question'>;

const { width } = Dimensions.get('window');

const Question = ({ navigation, route }: Props) => {
    const { chapterId, chapterTitle, classId, boardId, subjectId } = route.params;
    const [timeLeft, setTimeLeft] = useState(2700);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
    const { language } = useLanguage();
    const [questions, setQuestion] = useState<QuestionType[]>([]);
    const dispatch = useDispatch();
    const testId = useSelector((state: RootState) => state.test.testId);
    const currentQuestion = questions[currentIndex];
    // const [testId, setTestId] = useState<string | null>(null);

    // const transformQuestions = (data: any[]): QuestionType[] => {

    //     return data.map((item, index) => ({
    //         id: item._id,
    //         questionText: item.question,

    //         options: item.options.map((opt: string) => {
    //             const [id, ...textParts] = opt.split('.');
    //             return {
    //                 id: id.trim(), // A, B, C, D
    //                 text: textParts.join('.').trim(),
    //             };
    //         }),

    //         correctAnswer: item.correctAnswer,
    //         type: "Multiple Choice",
    //         points: 1,
    //         hint: item.explanation || "",
    //     }));
    // };

    const transformQuestions = (data: any[]): QuestionType[] => {
        return data.map((item, index) => ({
            id: item._id,
            questionText: item.question,

            options: item.options.map((opt: string) => {
                const [id, ...textParts] = opt.split('.');
                return {
                    id: id.trim(),
                    text: textParts.join('.').trim(),
                };
            }),

            correctAnswer: item.correctAnswer,
            type: "Multiple Choice",
            points: 1,
            hint: item.explanation || "",
            solution: item.explanation || "",
        }));
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        fetchQuestions()
    }, [])
    const fetchQuestions = async () => {
        try {
            const res = await Post_Api('/ai/generate-questions', {
                subjectId,
                boardId,
                classId,
                chapterId,
                language: language ? (language === 'en' ? 'english' : 'hi') : 'Hindi',
            });

            console.log("FULL RESPONSE:", res.data);

            dispatch(setTestId(res.data.testId));
            const formatted = transformQuestions(res?.data?.data || []);
            setQuestion(formatted);
            dispatch(setQuestions(formatted));

        } catch (error) {
            console.log(error, "error");
        }
    };


    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (optionId: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion?.id]: optionId
        }));
        dispatch(saveAnswer({ qId: currentQuestion.id, ans: optionId }));
    };

    const toggleMarkForReview = () => {
        setMarkedForReview(prev => {
            const newSet = new Set(prev);
            if (newSet.has(currentQuestion?.id)) {
                newSet.delete(currentQuestion?.id);
            } else {
                newSet.add(currentQuestion?.id);
            }
            return newSet;
        });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = async () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }

    };

    const handleSubmit = () => {
        dispatch(submitTest());
        const results = questions.reduce((acc, q) => {
            const userAnswer = answers[q.id];

            if (!userAnswer) {
                acc.notAttempted++; // ✅ new
            } else if (userAnswer === q.correctAnswer) {
                acc.correct++;
            } else {
                acc.incorrect++;
            }

            return acc;
        }, { correct: 0, incorrect: 0, notAttempted: 0 });
        console.log(results, "resultsresultsresults");

        const score = Math.round((results.correct / questions.length) * 100) || 0;
        const timeTaken = 2700 - timeLeft;
        navigation.navigate('Result', {
            ...route.params,
            testId: testId,
            score,
            correctAnswers: results.correct,
            incorrectAnswers: results.incorrect,
            notAttempted: results.notAttempted,
            timeTaken: `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`
        });
    };
    const getProgress = () => {
        const answeredCount = Object.keys(answers).length;
        return (answeredCount / questions.length) * 100;
    };

    return (
        <ScreenWrapper style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerLeft}>
                    <View style={styles.timerIconContainer}>
                        <Text style={styles.timerIcon}>⏰</Text>
                    </View>
                    <View>
                        <Text style={styles.practiceText}>Practice Test:</Text>
                        <Text style={styles.chapterTitleText} numberOfLines={1}>{chapterTitle}</Text>
                    </View>
                </View>
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                </View>
                <TouchableOpacity style={styles.settingsBtn}>
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Question Card */}
                <View style={styles.questionCard}>
                    <View style={styles.questionMeta}>
                        <View style={styles.questionBadge}>
                            <Text style={styles.questionBadgeText}>QUESTION</Text>
                            <Text style={styles.questionNumberText}>{(currentIndex + 1).toString().padStart(2, '0')}</Text>
                        </View>
                        <Text style={styles.questionType}>{currentQuestion?.type} • {currentQuestion?.points} Points</Text>
                    </View>

                    <Text style={styles.questionText}>{currentQuestion?.questionText}</Text>

                    {currentQuestion?.equation && (
                        <View style={styles.equationContainer}>
                            <Text style={styles.equationText}>{currentQuestion?.equation}</Text>
                        </View>
                    )}

                    {currentQuestion?.options.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionCard,
                                answers[currentQuestion?.id] === option?.id && styles.selectedOptionCard
                            ]}
                            onPress={() => handleOptionSelect(option?.id)}
                        >
                            <View style={[
                                styles.optionLetterContainer,
                                answers[currentQuestion?.id] === option?.id && styles.selectedOptionLetterContainer
                            ]}>
                                <Text style={[
                                    styles.optionLetter,
                                    answers[currentQuestion?.id] === option?.id && styles.selectedOptionLetter
                                ]}>{option?.id}</Text>
                            </View>
                            <Text style={styles.optionText}>{option?.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Navigation Buttons */}
                <View style={styles.navButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.prevButton, currentIndex === 0 && { opacity: 0.5 }]}
                        onPress={handlePrevious}
                        disabled={currentIndex === questions.length - 1}                    >
                        <Text style={styles.prevButtonText}>← Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.markReviewButton,
                            markedForReview.has(currentQuestion?.id) && { backgroundColor: '#E0CCFF' }
                        ]}
                        onPress={toggleMarkForReview}
                    >
                        <Text style={styles.markReviewIcon}>{markedForReview.has(currentQuestion?.id) ? '🔖' : '📑'}</Text>
                        <Text style={styles.markReviewText}>
                            {markedForReview.has(currentQuestion?.id) ? 'Marked' : 'Mark for Review'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.nextButton, currentIndex === questions.length - 1 && { opacity: 0.5 }]}
                        onPress={handleNext}
                        disabled={currentIndex === questions.length - 1}                    >
                        <Text style={styles.nextButtonText}>Next Question</Text>
                    </TouchableOpacity>
                </View>

                {/* Question Palette */}
                <View style={styles.paletteContainer}>
                    <Text style={styles.paletteHeading}>QUESTION PALETTE</Text>
                    <View style={styles.paletteGrid}>
                        {questions?.map((q, index) => {
                            const isAnswered = !!answers[q?.id];
                            const isMarked = markedForReview.has(q?.id);
                            const isCurrent = index === currentIndex;

                            return (
                                <TouchableOpacity
                                    key={q?.id}
                                    onPress={() => setCurrentIndex(index)}
                                    style={[
                                        styles.paletteCircle,
                                        isAnswered && styles.paletteCircleAnswered,
                                        isMarked && styles.paletteCircleMarked,
                                        isCurrent && styles.paletteCircleCurrent,
                                    ]}
                                >
                                    <View style={[
                                        styles.paletteCircleContent,
                                        isCurrent && styles.paletteCircleContentCurrent
                                    ]}>
                                        <Text style={[
                                            styles.paletteText,
                                            (isAnswered || isMarked) && styles.paletteTextSelected,
                                            isCurrent && styles.paletteTextCurrent
                                        ]}>{index + 1}</Text>
                                    </View>
                                    {isMarked && <View style={styles.markedDot} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#4B49C1' }]} />
                            <Text style={styles.legendText}>Answered</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#8A2BE2' }]} />
                            <Text style={styles.legendText}>Marked</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#EBEBFF' }]} />
                            <Text style={styles.legendText}>Not Visited</Text>
                        </View>
                    </View>
                </View>

                {/* AI Study Buddy */}
                <View style={styles.aiBuddyCard}>
                    <View style={styles.aiBuddyHeader}>
                        <View style={styles.aiIconContainer}>
                            <Text>👤</Text>
                        </View>
                        <View>
                            <Text style={styles.aiBuddyTitle}>AI Study Buddy</Text>
                            <Text style={styles.aiBuddySub}>Available for 2 hints</Text>
                        </View>
                    </View>
                    <Text style={styles.aiBuddyText}>
                        {currentQuestion?.hint}
                    </Text>
                    <TouchableOpacity style={styles.hintButton}>
                        <Text style={styles.hintButtonText}>Unlock Hint (1)</Text>
                    </TouchableOpacity>
                </View>

                {/* Progress */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>PROGRESS</Text>
                        <View style={styles.progressPercentContainer}>
                            <Text style={styles.progressPercent}>{Math.round(getProgress())}%</Text>
                        </View>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${getProgress()}%` }]} />
                    </View>
                </View>

                {/* Bottom Options */}
                <View style={styles.bottomLinkContainer}>
                    <TouchableOpacity>
                        <Text style={styles.bottomLink}>Help</Text>
                    </TouchableOpacity>
                    <View style={styles.dotSeparator} />
                    <TouchableOpacity>
                        <Text style={styles.bottomLink}>Formula Sheet</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit Test</Text>
                </TouchableOpacity>

            </ScrollView>
        </ScreenWrapper>
    );
};

export default Question;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FDFBFF',
    },
    backButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        backgroundColor: '#F3EFFF',
        marginRight: 10,
    },
    backIcon: {
        fontSize: 20,
        color: Colors.background,
        fontWeight: 'bold',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        overflow: 'hidden',
    },
    timerIconContainer: {
        marginRight: 10,
    },
    timerIcon: {
        fontSize: 20,
    },
    practiceText: {
        fontSize: 12,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
    },
    chapterTitleText: {
        fontSize: 16,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
    },
    timerContainer: {
        backgroundColor: '#E0E0FF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginHorizontal: 5,
        minWidth: 80,
        alignItems: 'center',
    },
    timerText: {
        fontSize: 13,
        fontFamily: fonts.LexendBold,
        color: '#5c52cb',
    },
    settingsBtn: {
        padding: 5,
    },
    settingsIcon: {
        fontSize: 20,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    questionCard: {
        backgroundColor: '#FFF',
        borderRadius: 30,
        padding: 25,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    questionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    questionBadge: {
        backgroundColor: '#EEF0FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    questionBadgeText: {
        fontSize: 10,
        fontFamily: fonts.LexendBold,
        color: '#9C9CAD',
        marginRight: 4,
    },
    questionNumberText: {
        fontSize: 12,
        fontFamily: fonts.LexendBold,
        color: '#5c52cb',
    },
    questionType: {
        fontSize: 12,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
    },
    questionText: {
        fontSize: 22,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
        marginBottom: 20,
    },
    equationContainer: {
        backgroundColor: '#F3F5FF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 25,
        alignItems: 'center',
    },
    equationText: {
        fontSize: 20,
        fontFamily: fonts.LexendBold,
        color: '#5c52cb',
        fontStyle: 'italic',
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FDFBFF',
        borderWidth: 1,
        borderColor: '#EEF0FF',
        borderRadius: 20,
        padding: 15,
        marginBottom: 12,
    },
    selectedOptionCard: {
        borderColor: '#5c52cb',
        backgroundColor: '#F3F5FF',
    },
    optionLetterContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    selectedOptionLetterContainer: {
        backgroundColor: '#5c52cb',
    },
    optionLetter: {
        fontSize: 16,
        fontFamily: fonts.LexendBold,
        color: '#5c52cb',
    },
    selectedOptionLetter: {
        color: '#FFF',
    },
    optionText: {
        fontSize: 16,
        fontFamily: fonts.Lexend_Medium,
        color: '#1A1A3F',
    },
    navButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    prevButton: {
        backgroundColor: '#3c33a0ff',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
    },
    prevButtonText: {
        color: '#ffffffff',
        fontFamily: fonts.LexendBold,
        fontSize: 13,
    },
    markReviewButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#33a085ff',
        padding: 10,
        borderRadius: 30,
        width: 100,
        height: 70,
    },
    markReviewIcon: {
        fontSize: 18,

        marginBottom: 2,
    },
    markReviewText: {
        fontSize: 9,
        fontFamily: fonts.LexendBold,
        color: '#FFF',
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: '#5c52cb',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 4,
    },
    nextButtonText: {
        color: '#FFF',
        fontFamily: fonts.LexendBold,
        fontSize: 13,
    },
    paletteContainer: {
        backgroundColor: '#F8F7FF',
        borderRadius: 30,
        padding: 25,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EFEFFF',
    },
    paletteHeading: {
        fontSize: 13,
        fontFamily: fonts.LexendBold,
        color: '#4B4B87',
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    paletteGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    paletteCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EBEBFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 16,
        position: 'relative',
    },
    paletteCircleContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    paletteCircleContentCurrent: {
        borderWidth: 2,
        borderColor: '#4B49C1',
        backgroundColor: '#FFF',
        width: '88%',
        height: '88%',
        borderRadius: 25,
    },
    paletteCircleAnswered: {
        backgroundColor: '#4B49C1',
    },
    paletteCircleMarked: {
        backgroundColor: '#8A2BE2',
    },
    paletteCircleCurrent: {
        borderWidth: 1,
        borderColor: '#4B49C1',
        backgroundColor: 'transparent',
    },
    paletteText: {
        fontSize: 16,
        fontFamily: fonts.LexendBold,
        color: '#8E8EA9',
    },
    paletteTextSelected: {
        color: '#FFF',
    },
    paletteTextCurrent: {
        color: '#4B49C1',
    },
    markedDot: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#8A2BE2',
        borderWidth: 2,
        borderColor: '#F8F7FF',
    },
    divider: {
        height: 1,
        backgroundColor: '#EFEFFF',
        marginVertical: 15,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        fontSize: 13,
        fontFamily: fonts.Lexend_Medium,
        color: '#4B4B87',
    },
    aiBuddyCard: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
    },
    aiBuddyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    aiIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0097A7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    aiBuddyTitle: {
        fontSize: 16,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
    },
    aiBuddySub: {
        fontSize: 12,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
    },
    aiBuddyText: {
        fontSize: 14,
        fontFamily: fonts.Lexend_Regular,
        color: '#707070',
        lineHeight: 20,
        marginBottom: 20,
    },
    hintButton: {
        backgroundColor: '#B2EBF2',
        paddingVertical: 12,
        borderRadius: 15,
        alignItems: 'center',
    },
    hintButtonText: {
        color: '#00838F',
        fontFamily: fonts.LexendBold,
    },
    progressContainer: {
        backgroundColor: '#E0E0FF',
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
        overflow: 'hidden',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    progressLabel: {
        fontSize: 12,
        fontFamily: fonts.LexendBold,
        color: '#5c52cb',
    },
    progressPercentContainer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        elevation: 2,
    },
    progressPercent: {
        fontSize: 14,
        fontFamily: fonts.LexendBold,
        color: '#1A1A3F',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 4,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#5c52cb',
        borderRadius: 4,
    },
    bottomLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    bottomLink: {
        fontSize: 14,
        fontFamily: fonts.Lexend_Medium,
        color: '#707070',
    },
    dotSeparator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#CCC',
        marginHorizontal: 15,
    },
    submitButton: {
        backgroundColor: '#5c52cb',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#5c52cb',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    submitButtonText: {
        fontSize: 18,
        fontFamily: fonts.LexendBold,
        color: '#FFF',
    },
});

