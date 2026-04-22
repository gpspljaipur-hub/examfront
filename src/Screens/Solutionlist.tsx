import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../comman/ScreenWrapper'
import Header from '../comman/Header'
import BottomTab from '../comman/BottomTab'

const Solutionlist = () => {
    return (
        <ScreenWrapper>
            <Header />
            <View>
                <Text>Solutionlist</Text>
            </View>
            <BottomTab />
        </ScreenWrapper>
    )
}

export default Solutionlist

const styles = StyleSheet.create({})