import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import ScreenWrapper from '../comman/ScreenWrapper';
import HWSize from '../comman/HWSize';
import fonts from '../comman/fonts';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
const Result = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Result'>>();
  const resultData = useSelector((state: RootState) => state.test.result);
  const {
    chapterId,
    chapterTitle,
    score,
    correctAnswers,
    incorrectAnswers,
    timeTaken,
    subjectId,
    boardId,
    classId
  } = route.params;

  console.log(resultData, "resultDataresultDataresultDataresultData");


  const stats = [
    { label: 'Correct', value: resultData?.correct, icon: '✓', color: '#00BFA5', bg: '#E0F2F1' },
    { label: 'Incorrect', value: resultData?.wrong, icon: '×', color: '#FF5252', bg: '#FFEBEE' },
    { label: 'Not Attempted', value: resultData?.notAttempted, icon: '⚠', color: '#FFC107', bg: '#FFF8E1' },
    { label: 'Time Taken', value: timeTaken, icon: '🕒', color: '#2196F3', bg: '#E3F2FD' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScreenWrapper style={styles.container} scroll={true} useScrollView={true}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assessment Results</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerIcon}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Score Circle */}
        <View style={styles.scoreContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.ringBackground} />
            <View style={[styles.progressSegment, { borderTopColor: '#6E5CE8', borderRightColor: '#6E5CE8', borderBottomColor: '#6E5CE8' }]} />
            <View style={styles.innerCircle}>
              <Text style={styles.scorePercentage}>{score}%</Text>
              <Text style={styles.scoreLabel}>TOTAL SCORE</Text>
            </View>
            <View style={styles.starBadge}>
              <Text style={{ fontSize: 18, color: '#FFF' }}>✨</Text>
            </View>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Great job!</Text>
          <Text style={styles.greetingSubtitle}>
            You're making significant progress in <Text style={styles.subjectHighlight}>{chapterTitle || "Subject"}</Text>.
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((item, index) => (
            <View key={index} style={styles.statCard}>
              <View>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
              <View style={[styles.statIconBadge, { backgroundColor: item.bg }]}>
                <Text style={[styles.statIconText, { color: item.color }]}>{item.icon}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* AI Analysis Card */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Image
              source={{ uri: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg' }}
              style={styles.aiAvatar}
            />
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI Analysis</Text>
            </View>
          </View>

          <Text style={styles.aiTitle}>Deep Learning Analysis Ready</Text>
          <Text style={styles.aiDescription}>
            "I've analyzed your performance in <Text style={{ fontFamily: fonts.LexendBold }}>{chapterTitle}</Text>.
            You're doing well! Would you like to see a personalized breakdown of your mistakes?"
          </Text>

          <TouchableOpacity 
            style={styles.aiButtonPrimary}
            onPress={() => navigation.navigate('Solution', { questionIndex: 0 })}
          >
            <Text style={styles.aiButtonTextPrimary}>💬 View Solution & Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.aiButtonSecondary}
            onPress={() => navigation.navigate('Question', { 
              chapterId, 
              chapterTitle, 
              subjectId, 
              boardId, 
              classId 
            })}
          >
            <Text style={styles.aiButtonTextSecondary}>Retake Test</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <TouchableOpacity
          style={styles.dashboardLink}
          onPress={() => navigation.navigate('Dashboard', { boardId: null, classId: null })}
        >
          <Text style={styles.dashboardLinkIcon}>⊞</Text>
          <Text style={styles.dashboardLinkText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFE',
    paddingHorizontal: HWSize.W_Width20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerButton: {
    padding: 5,
  },
  headerIcon: {
    fontSize: 22,
    color: '#4B3E90',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.LexendBold,
    color: '#1A1A1A',
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: HWSize.H_Height15,
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringBackground: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 12,
    borderColor: '#F0EFFF',
  },
  progressSegment: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 12,
    borderColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F9FAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scorePercentage: {
    fontSize: 50,
    fontFamily: fonts.LexendBold,
    color: '#1A1A1A',
  },
  scoreLabel: {
    fontSize: 10,
    fontFamily: fonts.Lexend_Medium,
    color: '#9E9E9E',
    letterSpacing: 1.5,
    marginTop: -5,
  },
  starBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4BD9F9',
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#4BD9F9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: HWSize.H_Height20,
  },
  greetingTitle: {
    fontSize: 26,
    fontFamily: fonts.LexendBold,
    color: '#1A1A1A',
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 14,
    fontFamily: fonts.Lexend_Regular,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  subjectHighlight: {
    fontFamily: fonts.LexendBold,
    color: '#4B3E90',
  },
  statsContainer: {
    gap: 12,
  },
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    paddingHorizontal: 24,
    borderRadius: 22,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fonts.Lexend_Medium,
    color: '#BDBDBD',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 22,
    fontFamily: fonts.LexendBold,
    color: '#1A1A1A',
  },
  statIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  aiCard: {
    backgroundColor: '#FFF',
    borderRadius: 35,
    padding: 24,
    marginTop: 25,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  aiHeader: {
    marginBottom: 16,
  },
  aiAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#F8F7FF',
  },
  aiBadge: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: '#6E5CE8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'center',
  },
  aiBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: fonts.LexendBold,
  },
  aiTitle: {
    fontSize: 19,
    fontFamily: fonts.LexendBold,
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  aiDescription: {
    fontSize: 13,
    fontFamily: fonts.Lexend_Regular,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  aiButtonPrimary: {
    backgroundColor: '#6E5CE8',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#6E5CE8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  aiButtonTextPrimary: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: fonts.LexendBold,
  },
  aiButtonSecondary: {
    backgroundColor: '#F5F5FF',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  aiButtonTextSecondary: {
    color: '#6E5CE8',
    fontSize: 15,
    fontFamily: fonts.LexendBold,
  },
  dashboardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  dashboardLinkIcon: {
    fontSize: 18,
    color: '#4B3E90',
    marginRight: 6,
  },
  dashboardLinkText: {
    fontSize: 14,
    fontFamily: fonts.LexendBold,
    color: '#4B3E90',
  },
});