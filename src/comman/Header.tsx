import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { Colors } from './Colors';
import FontsSize from './FontsSize';
import MarginHW from './MarginHW';
import fonts from './fonts';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Images } from '../assets/images/Images';

const Header = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { labels } = useLanguage();

    return (
        <View style={styles.header}>
            <View style={styles.userInfo}>
                <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('Profile')}>
                    <Image
                        // source={require('../assets/images/')}
                        source={Images.aiTutor}
                        style={styles.avatarImage}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{labels.HeaderTitle}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
                <Text style={styles.notificationIcon}>🔔</Text>
                <View style={styles.notificationDot} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: MarginHW.PaddingW20,
        height: 60,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E9E7FF',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    headerTitle: {
        fontSize: FontsSize.size18,
        fontFamily: fonts.LexendBold,
        color: Colors.background,
        marginLeft: 10,
    },
    notificationButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationIcon: {
        fontSize: 22,
        color: Colors.background,
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.red,
    },
});

export default Header;
