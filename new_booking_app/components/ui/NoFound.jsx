import { View, Text } from 'react-native'
import React from 'react'

export default function NoFound({message}) {
  return (
    <View style={{justifyContent: "center", alignItems: "center"}}>
      <Text style={{color: "red"}}>{message}</Text>
    </View>
  )
}