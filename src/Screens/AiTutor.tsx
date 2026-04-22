import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface Message {
    id: string;
    text: string;
    sender: string;
}

const AiTutor = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<Message[]>([]);

    const handleSend = () => {
        if (!message.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            text: message,
            sender: 'user',
        };

        // Dummy AI response
        const aiMsg = {
            id: (Date.now() + 1).toString(),
            text: "🤖 This is a dummy AI response. I'll help you with this soon!",
            sender: 'ai',
        };

        setChat(prev => [...prev, userMsg, aiMsg]);
        setMessage('');
    };

    const renderItem = ({ item }: { item: Message }) => {
        if (!item) return null;

        const isUser = item.sender === 'user';

        return (
            <View
                style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.aiBubble,
                ]}
            >
                <Text style={[styles.messageText, isUser && { color: '#fff' }]}>{item.text}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/splash_character.png')}
                style={styles.backgroundImage}
            />

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerLeft}>Ask AI Tutor</Text>
                <Text style={styles.headerRight}>EduAI</Text>
            </View>

            {/* CHAT AREA */}
            <FlatList
                data={chat}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
            />

            {/* INPUT AREA */}
            <View style={styles.inputContainer}>

                {/* Attach Icon */}
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="attach" size={22} color="#666" />
                </TouchableOpacity>

                {/* Text Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Ask anything..."
                    placeholderTextColor="#999"
                    value={message}
                    onChangeText={setMessage}
                />

                {/* Send Button */}
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                    <Ionicons name="send" size={18} color="#fff" />
                </TouchableOpacity>

            </View>
        </View>
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
        opacity: 0.5
    },

    /* HEADER */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        marginTop: 40,
    },
    headerLeft: {
        fontSize: 18,
        fontWeight: '600',
    },
    headerRight: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6C63FF',
    },

    /* CHAT */
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
    messageText: {
        color: '#000',
    },

    /* INPUT */
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