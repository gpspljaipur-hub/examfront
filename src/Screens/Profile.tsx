import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../comman/ScreenWrapper';
import HWSize from '../comman/HWSize';
import fonts from '../comman/fonts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedBoard, setSelectedBoard] = useState('');
    const { language, setLanguage, labels } = useLanguage();


    return (
        <ScreenWrapper style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{labels.EditProfile}</Text>
            </View>

            {/* Profile Picture Section */}
            <View style={styles.avatarContainer}>
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg' }}
                        style={styles.avatarImage}
                    />
                    <TouchableOpacity style={styles.cameraButton}>
                        <Text style={styles.cameraIcon}>📷</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Text style={styles.changePictureText}>{labels.ChangeProfilePicture}</Text>
                </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{labels.FullName}</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={fullName}
                            placeholder={labels.FullNamePlaceholder}
                            placeholderTextColor="#BDBDBD"
                            onChangeText={setFullName}
                        />
                        <Text style={styles.fieldIcon}>👤</Text>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{labels.EmailAddress}</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={email}
                            placeholder={labels.ProfileEmailPlaceholder}
                            placeholderTextColor="#BDBDBD"
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                        <Text style={styles.fieldIcon}>✉️</Text>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{labels.MobileNumberLabel}</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={mobile}
                            placeholder={labels.MobilePlaceholder}
                            placeholderTextColor="#BDBDBD"
                            onChangeText={setMobile}
                            keyboardType="phone-pad"
                        />
                        <Text style={styles.fieldIcon}>📱</Text>
                    </View>
                </View>

                {/* Class Selection */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{labels.CurrentClass}</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => navigation.navigate('SelectClass', { boardId: 'default' })}
                    >
                        <Text style={styles.dropdownText}>{selectedClass || 'Select Class'}</Text>
                        <Text style={styles.dropdownIcon}>⌄</Text>
                    </TouchableOpacity>
                </View>

                {/* Educational Board Dropdown */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{labels.EducationalBoard}</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => navigation.navigate('SelectBoard')}
                    >
                        <Text style={styles.dropdownText}>{selectedBoard || 'Select Board'}</Text>
                        <Text style={styles.dropdownIcon}>⌄</Text>
                    </TouchableOpacity>
                </View>

                {/* Language Preference */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{labels.LanguagePreference}</Text>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            onPress={() => setLanguage('en')}
                            style={[styles.toggleButton, language === 'en' && styles.activeToggle]}
                        >
                            <Text style={[styles.toggleText, language === 'en' && styles.activeToggleText]}>{labels.English}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setLanguage('hi')}
                            style={[styles.toggleButton, language === 'hi' && styles.activeToggle]}
                        >
                            <Text style={[styles.toggleText, language === 'hi' && styles.activeToggleText]}>{labels.Hindi}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Privacy/Info Box */}
                <View style={styles.infoBox}>
                    <View style={styles.infoIconWrapper}>
                        <Text style={styles.infoIcon}>i</Text>
                    </View>
                    <Text style={styles.infoText}>
                        {labels.ProfilePrivacyNote}
                    </Text>
                </View>
            </View>

            {/* Save Changes Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton}>
                    <View style={styles.buttonContent}>
                        <View style={styles.checkIconWrapper}>
                            <Text style={styles.checkIcon}>✓</Text>
                        </View>
                        <Text style={styles.saveButtonText}>{labels.SaveChanges}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F7FF',
        paddingHorizontal: HWSize.W_Width20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingVertical: HWSize.H_Height20,
    },
    backButton: {
        marginRight: HWSize.W_Width15,
    },
    backIcon: {
        fontSize: 24,
        color: '#4B3E90',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: fonts.LexendBold,
        color: '#1A1A1A',
    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: HWSize.H_Height20,
    },
    imageWrapper: {
        position: 'relative',
        marginBottom: 10,
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#5C4DB1',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#F8F7FF',
    },
    cameraIcon: {
        fontSize: 16,
    },
    changePictureText: {
        fontSize: 14,
        color: '#666',
        fontFamily: fonts.Lexend_Medium,
    },
    formContainer: {
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        fontFamily: fonts.Lexend_Medium,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 20,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        fontFamily: fonts.Lexend_Regular,
    },
    fieldIcon: {
        fontSize: 18,
        color: '#BDBDBD',
    },
    classScroll: {
        paddingVertical: 5,
    },
    classChip: {
        backgroundColor: '#F0EFFF',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
    },
    selectedClassChip: {
        backgroundColor: '#5C4DB1',
    },
    classText: {
        fontSize: 14,
        color: '#666',
        fontFamily: fonts.Lexend_Medium,
    },
    selectedClassText: {
        color: '#FFF',
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 20,
        height: 50,
        borderWidth: 1,
        borderColor: '#F0EFFF',
    },
    dropdownText: {
        fontSize: 15,
        color: '#333',
        fontFamily: fonts.Lexend_Medium,
    },
    dropdownIcon: {
        fontSize: 20,
        color: '#BDBDBD',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F0EFFF',
        borderRadius: 25,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        height: 40,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeToggle: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    toggleText: {
        fontSize: 14,
        color: '#666',
        fontFamily: fonts.Lexend_Medium,
    },
    activeToggleText: {
        color: '#5C4DB1',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F3EFFF',
        borderRadius: 20,
        padding: 15,
        marginTop: 10,
        alignItems: 'flex-start',
    },
    infoIconWrapper: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#9C27B0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 2,
    },
    infoIcon: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#5C4DB1',
        fontFamily: fonts.Lexend_Regular,
        lineHeight: 18,
    },
    footer: {
        marginVertical: 30,
    },
    saveButton: {
        backgroundColor: '#6E5CE8',
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6E5CE8',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkIconWrapper: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkIcon: {
        color: '#FFF',
        fontSize: 12,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: fonts.LexendBold,
    },
});