import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../comman/ScreenWrapper'
import Header from '../comman/Header'
import BottomTab from '../comman/BottomTab'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Post_Api } from '../userApi/Request'
import ApiUrl from '../userApi/ApiUrl'
import { useLanguage } from '../context/LanguageContext'

type Props = NativeStackScreenProps<RootStackParamList, 'DetailPage'>;

const Detail = ({ navigation, route }: Props) => {
    const { subjectId, boardId, classId, chapterId } = route.params;
    const { language } = useLanguage();
    const [data, setData] = useState<any>(null);

    const getData = async () => {
        try {
            const res = await Post_Api(ApiUrl.AI_CHAPTER_SUMMARY, {
                boardId,
                classId,
                chapterId,
                subjectId,
                language
            });

            setData(res?.data?.data);
        } catch (error) {
            console.log("API ERROR:", error);
        }
    }
    useEffect(() => {
        if (!data) {
            getData();
        }
    }, []);

    if (!data) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F7F8FF'
            }}>
                <ActivityIndicator size="large" color="#5c52cb" />

                <Text style={{
                    marginTop: 15,
                    fontSize: 16,
                    color: '#5c52cb',
                    fontWeight: '600'
                }}>
                    Fetching chapter content...
                </Text>
            </View>
        );
    }
    return (
        <ScreenWrapper>
            <Header />

            <ScrollView style={styles.container}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}>

                <Text style={styles.title}>{data.chapterName}</Text>

                {data.introduction && (
                    <>
                        <Text style={styles.heading}>Introduction</Text>
                        <Text style={styles.text}>{data.introduction}</Text>
                    </>
                )}
                {data.importantPoints?.length > 0 && (
                    <>
                        <Text style={styles.heading}>Important Points</Text>
                        {data.importantPoints.map((item: string, index: number) => (
                            <Text key={index} style={styles.bullet}>• {item}</Text>
                        ))}
                    </>
                )}

                {data.theory?.length > 0 && (
                    <>
                        <Text style={styles.heading}>Theory</Text>
                        {data.theory.map((item: any, index: number) => (
                            <View key={index}>
                                <Text style={styles.subHeading}>{item.topic}</Text>
                                <Text style={styles.text}>{item.content}</Text>
                            </View>
                        ))}
                    </>
                )}

                {data.examples?.length > 0 && (
                    <>
                        <Text style={styles.heading}>Examples</Text>
                        {data.examples.map((item: any, index: number) => (
                            <View key={index} style={styles.card}>
                                <Text style={styles.question}>Q: {item.question}</Text>
                                <Text style={styles.answer}>Ans: {item.solution}</Text>
                            </View>
                        ))}
                    </>
                )}

                {data.mcqs?.length > 0 && (
                    <>
                        <Text style={styles.heading}>MCQs</Text>
                        {data.mcqs.map((item: any, index: number) => (
                            <View key={index} style={styles.card}>
                                <Text style={styles.question}>{item.question}</Text>
                                {item.options?.map((opt: string, i: number) => (
                                    <Text key={i} style={styles.option}>• {opt}</Text>
                                ))}
                                <Text style={styles.answer}>Answer: {item.answer}</Text>
                            </View>
                        ))}
                    </>
                )}

                {data.shortQuestions?.length > 0 && (
                    <>
                        <Text style={styles.heading}>Short Questions</Text>
                        {data.shortQuestions.map((item: any, index: number) => (
                            <View key={index}>
                                <Text style={styles.question}>{item.question}</Text>
                                <Text style={styles.answer}>{item.answer}</Text>
                            </View>
                        ))}
                    </>
                )}

                {data.longQuestions?.length > 0 && (
                    <>
                        <Text style={styles.heading}>Long Questions</Text>
                        {data.longQuestions.map((item: any, index: number) => (
                            <View key={index} style={styles.card}>
                                <Text style={styles.question}>Q: {item.question}</Text>
                                <Text style={styles.answer}>Ans: {item.answer}</Text>
                            </View>
                        ))}
                    </>
                )}

                {data.revisionNotes?.length > 0 && (
                    <>
                        <Text style={styles.heading}>Revision Notes</Text>
                        {data.revisionNotes.map((item: string, index: number) => (
                            <Text key={index} style={styles.bullet}>• {item}</Text>
                        ))}
                    </>
                )}

            </ScrollView>

            <BottomTab />
        </ScreenWrapper>
    )
}

export default Detail

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
    },
    subHeading: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
    },
    text: {
        fontSize: 14,
        marginTop: 5,
    },
    bullet: {
        fontSize: 14,
        marginLeft: 10,
        marginTop: 3,
    },
    card: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    question: {
        fontWeight: 'bold',
    },
    answer: {
        marginTop: 5,
        color: 'green',
    },
    option: {
        marginLeft: 10,
    },
})