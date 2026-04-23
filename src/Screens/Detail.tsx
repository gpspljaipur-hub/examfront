import { StyleSheet, Text, View, } from 'react-native'
import React from 'react'
import ScreenWrapper from '../comman/ScreenWrapper'
import Header from '../comman/Header'
import BottomTab from '../comman/BottomTab'
const Detail = () => {
    return (
        <ScreenWrapper>
            <Header />
            <Text>Detail</Text>
            <BottomTab />
        </ScreenWrapper>
    )
}

export default Detail

const styles = StyleSheet.create({})