import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from './Colors';
import fonts from './fonts';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigations/AppNavigator';

interface BottomTabProps {
    activeTab?: string;
}

const BottomTab = ({ activeTab }: BottomTabProps) => {
    const { labels } = useLanguage();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const tabs = [
        { id: 'Home', label: labels.Home, icon: '🏠', screen: 'Dashboard' },
        { id: 'Study', label: labels.Study, icon: '📚', screen: 'NoScreen' },
        { id: 'AITutor', label: labels.AITutor, icon: '🤖', screen: 'AiTutor' },
        { id: 'Progress', label: labels.Progress, icon: '📊', screen: 'ProgressScreen' },
    ];

    const handlePress = (screenName: any) => {

        navigation.navigate(screenName);
    };

    return (
        <View style={styles.bottomTab}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tabItem}
                        onPress={() => handlePress(tab.screen as any)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.tabIcon,
                            isActive && styles.activeTabIcon
                        ]}>
                            {tab.icon}
                        </Text>
                        <Text style={[
                            styles.tabLabel,
                            isActive && styles.activeTabLabel
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default BottomTab;

const styles = StyleSheet.create({
    bottomTab: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 85,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
    },
    tabIcon: {
        fontSize: 20,
        color: '#A0A0A0',
        marginBottom: 4,
    },
    activeTabIcon: {
        color: Colors.background,
    },
    tabLabel: {
        fontSize: 10,
        fontFamily: fonts.LexendBold,
        color: '#A0A0A0',
    },
    activeTabLabel: {
        color: Colors.background,
    },
});
