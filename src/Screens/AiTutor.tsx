import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
    Platform,
    ActivityIndicator,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import ScreenWrapper from '../comman/ScreenWrapper';
import { Colors } from '../comman/Colors';
import fonts from '../comman/fonts';
interface Action {
    id: string;
    label: string;
    icon?: string;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    time: string;
    type?: 'text' | 'insight' | 'image' | 'options';
    actions?: Action[];
    imageUri?: string;
}

const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    useEffect(() => {
        const welcomeMsg: Message = {
            id: 'welcome',
            sender: 'ai',
            text: "Hello! I'm Sophia, your AI Study Assistant. 📚 How can I help you with your exam preparation today?",
            time: getCurrentTime(),
            actions: [
                { id: '1', label: 'Check Schedule', icon: '📅' },
                { id: '2', label: 'Quick Quiz', icon: '🧠' },
                { id: '3', label: 'Review Notes', icon: '✍️' },
            ]
        };
        setMessages([welcomeMsg]);
    }, []);

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSend = (text?: string) => {
        const messageText = text || inputText;
        if (!messageText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            time: getCurrentTime(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);
        setTimeout(() => {
            generateAIResponse(messageText);
        }, 1200);
    };

    const generateAIResponse = (userText: string) => {
        const lower = userText.toLowerCase();
        let response: Message = {
            id: Date.now().toString(),
            sender: 'ai',
            time: getCurrentTime(),
            text: '',
        };

        if (lower.includes('quiz')) {
            response.text = "Great! Let's start a quick science quiz. Ready for the first question?";
            response.actions = [
                { id: 'y', label: "I'm Ready!", icon: '✅' },
                { id: 'n', label: 'Maybe later', icon: '⏰' }
            ];
        } else if (lower.includes('schedule')) {
            response.text = "Your next exam is Physics on Monday, 22nd April. You have 3 study modules left to complete.";
            response.type = 'insight';
        } else {
            response.text = "That's a good question! I'm looking into your materials to give you the best answer. Would you like a summary or a detailed explanation?";
            response.actions = [
                { id: 's', label: 'Summary', icon: '📝' },
                { id: 'd', label: 'Detailed', icon: '🔍' }
            ];
        }

        setMessages(prev => [...prev, response]);
        setIsTyping(false);
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';

        return (
            <View style={isUser ? styles.userBubbleContainer : styles.aiBubbleContainer}>
                <View style={!isUser && styles.messageRow}>
                    {!isUser && (
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/100?u=sophia' }}
                            style={styles.miniAvatar}
                        />
                    )}
                    <View style={isUser ? styles.userBubble : styles.aiBubble}>
                        {item.type === 'insight' ? (
                            <View style={styles.insightCard}>
                                <View style={styles.insightHeader}>
                                    <Text style={styles.insightEmoji}>💡</Text>
                                    <Text style={styles.insightTitle}>Study Tip</Text>
                                </View>
                                <Text style={styles.insightText}>{item.text}</Text>
                            </View>
                        ) : (
                            <Text style={isUser ? styles.userText : styles.aiText}>{item.text}</Text>
                        )}
                        <Text style={isUser ? styles.userTime : styles.time}>{item.time}</Text>
                    </View>
                </View>
                {!isUser && item.actions && (
                    <View style={styles.msgActionsContainer}>
                        {item.actions.map(action => (
                            <TouchableOpacity
                                key={action.id}
                                style={styles.msgActionBtn}
                                onPress={() => handleSend(action.label)}
                            >
                                <Text style={styles.msgActionText}>
                                    {action.icon} {action.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <ScreenWrapper scroll={false} style={styles.screen}>
            {/* DYNAMIC HEADER */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/100?u=sophia' }}
                            style={styles.avatar}
                        />
                        <View style={[styles.onlineDot, { backgroundColor: isTyping ? '#FFB100' : '#4CAF50' }]} />
                    </View>
                    <View>
                        <Text style={styles.name}>Sophia</Text>
                        <Text style={[styles.status, { color: isTyping ? Colors.background : '#666' }]}>
                            {isTyping ? 'Typing...' : 'Online'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.menuBtn}>
                    <Text style={styles.menuIcon}>⋮</Text>
                </TouchableOpacity>
            </View>

            {/* CHAT AREA */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                style={styles.chatArea}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                ListFooterComponent={() => (
                    <View style={{ height: 20 }}>
                        {isTyping && (
                            <View style={[styles.aiBubbleContainer, styles.messageRow, { opacity: 0.7 }]}>
                                <View style={[styles.aiBubble, { paddingVertical: 10, paddingHorizontal: 20 }]}>
                                    <ActivityIndicator size="small" color={Colors.background} />
                                </View>
                            </View>
                        )}
                    </View>
                )}
            />

            {/* INPUT BAR */}
            <View style={styles.footer}>
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachBtn}>
                        <Text style={styles.attachIcon}>+</Text>
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Ask me anything..."
                        placeholderTextColor={Colors.lightGreyText}
                        style={styles.input}
                        multiline
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, { opacity: inputText.trim() ? 1 : 0.6 }]}
                        onPress={() => handleSend()}
                        disabled={!inputText.trim()}
                    >
                        <Text style={styles.sendIcon}>▶</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: Platform.OS === 'ios' ? 10 : 15,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
    },
    backBtn: {
        padding: 5,
    },
    backIcon: {
        fontSize: 24,
        color: Colors.nearBlack,
        fontFamily: fonts.LexendBold,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F0F0F0',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 1,
        right: 1,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    name: {
        fontSize: 18,
        fontFamily: fonts.LexendBold,
        color: Colors.nearBlack,
        marginLeft: 12,
    },
    status: {
        fontSize: 12,
        fontFamily: fonts.Lexend_Regular,
        marginLeft: 12,
        marginTop: -2,
    },
    menuBtn: {
        padding: 5,
    },
    menuIcon: {
        fontSize: 22,
        color: Colors.nearBlack,
    },
    chatArea: {
        flex: 1,
        backgroundColor: '#F8F9FE',
    },
    chatContent: {
        padding: 20,
        paddingBottom: 30,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    miniAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
        marginBottom: 5,
    },
    aiBubbleContainer: {
        alignSelf: 'flex-start',
        maxWidth: '85%',
        marginBottom: 15,
    },
    aiBubble: {
        backgroundColor: Colors.white,
        padding: 14,
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    aiText: {
        color: Colors.darkText,
        fontSize: 15,
        fontFamily: fonts.Lexend_Regular,
        lineHeight: 22,
    },
    userBubbleContainer: {
        alignSelf: 'flex-end',
        maxWidth: '80%',
        marginBottom: 15,
    },
    userBubble: {
        backgroundColor: Colors.background,
        padding: 14,
        borderRadius: 18,
        borderBottomRightRadius: 4,
        elevation: 3,
        shadowColor: Colors.background,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    userText: {
        color: Colors.white,
        fontSize: 15,
        fontFamily: fonts.Lexend_Regular,
        lineHeight: 22,
    },
    time: {
        fontSize: 10,
        fontFamily: fonts.Lexend_Light,
        color: Colors.lightGreyText,
        marginTop: 6,
    },
    userTime: {
        fontSize: 10,
        fontFamily: fonts.Lexend_Light,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 6,
        textAlign: 'right',
    },
    msgActionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        marginLeft: 36,
    },
    msgActionBtn: {
        backgroundColor: Colors.white,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        elevation: 1,
    },
    msgActionText: {
        fontSize: 12,
        fontFamily: fonts.Lexend_Medium,
        color: Colors.nearBlack,
    },
    insightCard: {
        backgroundColor: '#F0EEFF',
        padding: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.background,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    insightEmoji: {
        fontSize: 14,
        marginRight: 6,
    },
    insightTitle: {
        fontFamily: fonts.LexendBold,
        fontSize: 12,
        color: Colors.background,
    },
    insightText: {
        fontSize: 13,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.darkText,
        lineHeight: 18,
    },
    footer: {
        paddingHorizontal: 15,
        paddingBottom: Platform.OS === 'ios' ? 25 : 15,
        paddingTop: 10,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F9',
        borderRadius: 25,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    attachBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#DEE1F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    attachIcon: {
        fontSize: 20,
        color: '#8A8D9F',
        fontWeight: '300',
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 15,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.nearBlack,
        maxHeight: 120,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sendBtn: {
        backgroundColor: Colors.background,
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    sendIcon: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
