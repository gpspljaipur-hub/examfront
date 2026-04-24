import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    KeyboardAvoidingView,

} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Post_Api } from '../userApi/Request';
import ApiUrl from '../userApi/ApiUrl';
import Markdown from 'react-native-markdown-display';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

const AiTutor = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const userData = useSelector((state: RootState) => state.auth.user);

    const handleSend = async () => {
        if (!message.trim()) return;
        const userMsg: Message = {
            id: Date.now().toString(),
            text: message,
            sender: 'user',
        };

        setChat(prev => [...prev, userMsg]);
        setMessage('');
        setLoading(true);

        try {
            const res = await Post_Api(ApiUrl.AI_CHAT_QUESTIONS, {
                userId: userData?._id,
                question: message,
            });

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: res?.data?.answer || "🤖 No response",
                sender: 'ai',
            };

            setChat(prev => [...prev, aiMsg]);

        } catch (error) {
            setChat(prev => [
                ...prev,
                {
                    id: (Date.now() + 2).toString(),
                    text: "Something went wrong",
                    sender: 'ai',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';

        return (
            <View
                style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.aiBubble,
                ]}
            >
                <Markdown
                    style={{
                        body: {
                            color: isUser ? '#fff' : '#000',
                            fontSize: 14,
                        },
                    }}
                >
                    {item.text}
                </Markdown>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={'height'}
        >

            {/* Background */}
            <Image
                source={require('../assets/images/splash_character.png')}
                style={styles.backgroundImage}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerLeft}>Ask AI Tutor</Text>
                <Text style={styles.headerRight}>EduAI</Text>
            </View>

            {/* Chat */}
            <FlatList
                ref={flatListRef}
                data={chat}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                }
            />

            {/* Typing Loader */}
            {loading && (
                <View style={[styles.messageBubble, styles.aiBubble, { marginHorizontal: 16 }]}>
                    <Text>Typing...</Text>
                </View>
            )}

            {/* Input */}
            <View style={styles.inputContainer}>

                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="attach" size={22} color="#666" />
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Ask anything..."
                    placeholderTextColor="#999"
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={handleSend}
                />

                <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                    <Ionicons name="send" size={18} color="#fff" />
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    );
};

export default AiTutor;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7FB',
    },
    backgroundImage: {
        position: 'absolute',
        width: 300,
        height: 300,
        top: '30%',
        alignSelf: 'center',
        opacity: 0.5,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginTop: 30,
    },
    backButton: {
        marginRight: 15,
    },
    backIcon: {
        fontSize: 24,
        color: '#4B3E90',
    },
    headerLeft: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    headerRight: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6C63FF',
    },

    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
    },
    userBubble: {
        backgroundColor: '#6C63FF',
        alignSelf: 'flex-end',
    },
    aiBubble: {
        backgroundColor: '#E5E5EA',
        alignSelf: 'flex-start',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
    },
    iconBtn: {
        paddingHorizontal: 6,
    },
    input: {
        flex: 1,
        backgroundColor: '#F1F1F1',
        borderRadius: 20,
        paddingHorizontal: 12,
        height: 40,
        marginHorizontal: 8,
    },
    sendBtn: {
        backgroundColor: '#6C63FF',
        padding: 10,
        borderRadius: 20,
    },
});