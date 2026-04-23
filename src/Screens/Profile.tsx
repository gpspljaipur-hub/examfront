import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../comman/ScreenWrapper';
import HWSize from '../comman/HWSize';
import fonts from '../comman/fonts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { useLanguage } from '../context/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice';
import { RootState } from '../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_API_PUBLIC, Post_Api } from '../userApi/Request';
import ApiUrl from '../userApi/ApiUrl';
import { setProfile } from '../store/slice/profileSlice';
import Toast from 'react-native-toast-message';

const Profile = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const { language, setLanguage, labels } = useLanguage();
    const userData = useSelector((state: RootState) => state.auth.user);
    const profile = useSelector((state: RootState) => state.profile);
    const [boards, setBoards] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedBoard, setSelectedBoard] = useState({
        id: '',
        name: ''
    });

    const [selectedClass, setSelectedClass] = useState({
        id: '',
        name: ''
    });

    const [showBoardDropdown, setShowBoardDropdown] = useState(false);
    const [showClassDropdown, setShowClassDropdown] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.fullName || '');
            setEmail(profile.email || '');
            setMobile(profile.mobile || '');
        }
    }, [profile]);
    useEffect(() => {
        if (boards.length && profile?.boardId) {
            const b = boards.find(i => i._id === profile.boardId);
            if (b) setSelectedBoard({ id: b._id, name: b.name });
        }
    }, [boards]);

    useEffect(() => {
        if (selectedBoard.id) fetchClasses(selectedBoard.id);
    }, [selectedBoard.id]);

    useEffect(() => {
        if (classes.length && profile?.classId) {
            const c = classes.find(i => i._id === profile.classId);
            if (c) setSelectedClass({ id: c._id, name: c.name });
        }
    }, [classes]);


    useEffect(() => {
        fetchBoards();
    }, []);


    const fetchBoards = async () => {
        const res = await GET_API_PUBLIC(ApiUrl.GET_BOARDS);
        setBoards(res?.data || []);
    };

    const fetchClasses = async (boardId: string) => {
        const res = await Post_Api(ApiUrl.GET_CLASSES, { boardId });
        setClasses(res?.data || []);
    };

    const handleSubmit = async () => {
        const res = await Post_Api(ApiUrl.ADD_PROFILE, {
            fullName,
            email,
            mobile,
            boardId: selectedBoard.id,
            classId: selectedClass.id,
            language
        });

        if (res?.status === 201) {
            const profileRes = await Post_Api(ApiUrl.GET_PROFILE, {
                mobile: userData?.mobile,
            });

            const newProfile = profileRes?.data;

            dispatch(setProfile({
                fullName: newProfile.fullName,
                email: newProfile.email,
                mobile: newProfile.mobile,
                boardId: newProfile.boardId._id,
                classId: newProfile.classId._id,
                language: newProfile.language,
                boardName: newProfile.boardId.name,
                className: newProfile.classId.name,
            }));

            Toast.show({ type: 'success', text1: 'Profile Updated' });
            navigation.navigate('Dashboard');
        }
    };



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
                {/* Educational Board Dropdown */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{labels.EducationalBoard}</Text>

                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setShowBoardDropdown(!showBoardDropdown)}
                    >
                        <Text style={styles.dropdownText}>
                            {selectedBoard.name || 'Select Board'}
                        </Text>
                        <Text style={styles.dropdownIcon}>
                            {showBoardDropdown ? '⌃' : '⌄'}
                        </Text>
                    </TouchableOpacity>

                    {showBoardDropdown && (
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            marginTop: 5,
                            maxHeight: 200,
                            borderWidth: 1,
                            borderColor: '#eee'
                        }}>
                            <ScrollView nestedScrollEnabled>
                                {boards.map((item) => (
                                    <TouchableOpacity
                                        key={item._id}
                                        style={{
                                            padding: 12,
                                            borderBottomWidth: 1,
                                            borderColor: '#eee'
                                        }}
                                        onPress={() => {
                                            const newBoard = { id: item._id, name: item.name };
                                            setSelectedBoard(newBoard);
                                            setSelectedClass({ id: '', name: '' });
                                            fetchClasses(newBoard.id);
                                            setShowBoardDropdown(false);
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 15,
                                            color: selectedBoard.id === item._id ? '#6E5CE8' : '#000',
                                            fontWeight: selectedBoard.id === item._id ? 'bold' : 'normal'
                                        }}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Class Selection */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{labels.CurrentClass}</Text>

                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setShowClassDropdown(!showClassDropdown)}
                        disabled={!selectedBoard.id} // 👈 important
                    >
                        <Text style={styles.dropdownText}>
                            {selectedClass.name || 'Select Class'}
                        </Text>
                        <Text style={styles.dropdownIcon}>
                            {showClassDropdown ? '⌃' : '⌄'}
                        </Text>
                    </TouchableOpacity>

                    {showClassDropdown && (
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            marginTop: 5,
                            maxHeight: 200,
                            borderWidth: 1,
                            borderColor: '#eee'
                        }}>
                            <ScrollView nestedScrollEnabled>
                                {classes.map((item) => (
                                    <TouchableOpacity
                                        key={item._id}
                                        style={{
                                            padding: 12,
                                            borderBottomWidth: 1,
                                            borderColor: '#eee'
                                        }}
                                        onPress={() => {
                                            setSelectedClass({ id: item._id, name: item.name });
                                            setShowClassDropdown(false);
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 15,
                                            color: selectedClass.id === item._id ? '#6E5CE8' : '#000',
                                            fontWeight: selectedClass.id === item._id ? 'bold' : 'normal'
                                        }}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
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
                <TouchableOpacity style={styles.saveButton}
                    onPress={() => handleSubmit()}
                >
                    <View style={styles.buttonContent}>
                        <View style={styles.checkIconWrapper}>
                            <Text style={styles.checkIcon}>✓</Text>
                        </View>
                        <Text style={styles.saveButtonText}>{labels.SaveChanges}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => {
                        dispatch(logout());
                        navigation.replace('Login');
                    }}
                >
                    <Text style={styles.logoutButtonText}>{labels.Logout}</Text>
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
    logoutButton: {
        marginTop: 15,
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FF4B4B',
        backgroundColor: 'transparent',
    },
    logoutButtonText: {
        color: '#FF4B4B',
        fontSize: 16,
        fontFamily: fonts.LexendBold,
    },
});