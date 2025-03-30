import { View } from 'react-native'
import React from 'react'
import { Spinner } from 'native-base'

export default function Loader ({ color = "blue", size="lg" }) {
    return (
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
            <Spinner size={size} color={color} />
        </View>
    )
}