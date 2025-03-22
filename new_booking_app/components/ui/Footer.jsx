import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { EssentialValues } from '../App';

export default function Footer() {
    const { navigate } = useNavigation();
    const { data } = useContext(EssentialValues);
    function gotoResiter(page) {
        navigate(page);
    }
    return (
        <View style={styles.footer}>
            {
                data.account === "1" &&
                <TouchableOpacity onPress={() => gotoResiter("Add Employee")}>
                    <Text >
                        <FontAwesome6 name="user-plus" size={20} color="#006A67" />
                    </Text>
                </TouchableOpacity>
            }
            {
                ["1", "3"].includes(data.account) &&
                <TouchableOpacity onPress={() => gotoResiter("Add Vehicle")}>
                    <Text >
                        <FontAwesome6 name="car" size={20} color="#006A67" />
                    </Text>
                </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => gotoResiter("Home")}>
                <Text >
                    <FontAwesome6 name="house" size={20} color="#006A67" />
                </Text>
            </TouchableOpacity>
            {
                ["1", "2"].includes(data.account) &&
                <TouchableOpacity onPress={() => gotoResiter("Booking")}>
                    <Text >
                        <FontAwesome6 name="ticket" size={20} color="#006A67" />
                    </Text>
                </TouchableOpacity>
            }
            {
                data.account === "1" &&
                <TouchableOpacity onPress={() => gotoResiter("Customers")}>
                    <Text >
                        <FontAwesome6 name="users" size={20} color="#006A67" />
                    </Text>
                </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => gotoResiter("History")}>
                <Text >
                    <FontAwesome6 name="clock-rotate-left" size={20} color="#006A67" />
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    touchableHighlight: {
        padding: 10,
    },
    footer: {
        height: 50,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white",
        boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    }
});