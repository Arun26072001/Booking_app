import { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import NoFound from "../../components/ui/NoFound";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {EssentialValues} from "../_layout";
import { API_BASEURL } from "@env";
import { useRouter } from 'expo-router';

export default function BookingHistory() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [allotments, setAllotments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { data, changeBookings } = useContext(EssentialValues);
    const { account, _id, token } = data;
    const dayMonthFormatter = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
    });

    const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    async function fetchAllertedBooking() {
        try {
            const alts = await axios.get(`${API_BASEURL}/api/allotment`);
            setAllotments(alts.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getAllotorBooking() {
        setIsLoading(true);
        try {
            const trips = await axios.get(`${API_BASEURL}/api/booking/allotor-booking/${_id}`, {
                headers: {
                    Authorization: token || ""
                }
            });
            setBookings(trips.data.filter((data) => data.tripCompleted === true));
        } catch (error) {
            setErrorMsg(error?.response?.data?.error);
        }
        setIsLoading(false);
    }

    async function getDriverBookings() {
        setIsLoading(true);
        try {
            const trips = await axios.get(`${API_BASEURL}/api/booking/driver-booking/${_id}`);
            setBookings(trips.data.filter((data) => data.tripCompleted === true));
        } catch (error) {
            setErrorMsg(error?.response?.data?.error);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        const getBookings = async () => {
            setIsLoading(true);
            try {
                const booking = await axios.get(`${API_BASEURL}/api/booking`);
                const allBookings = booking.data.filter((data) => data.tripCompleted === true);
                if (account === "1") {
                    setBookings(allBookings);
                } else {
                    setBookings(allBookings.filter((booking) => booking.bookingOfficer === _id));
                }
            } catch (error) {
                setErrorMsg(error?.response?.data?.error);
            }
            setIsLoading(false);
        };
        if (["1", "2"].includes(account)) {
            getBookings();
        } else if (account === "3") {
            getAllotorBooking();
        } else if (account === "4") {
            getDriverBookings();
        }
        fetchAllertedBooking();
    }, [changeBookings]);

    return (
        <ScrollView>
            <View style={styles.container}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : (
                    errorMsg ? (
                        <NoFound message={errorMsg} />
                    ) : (
                        bookings.map((booking, index) => (
                            <View key={index} style={[styles.bookingItem, booking.tripCompleted ? styles.disabled : null]}>
                                <Text style={styles.tripText}>{booking?.vehicleType?.name}</Text>
                                <Text style={styles.tripText}>{booking?.tripType}</Text>
                            </View>
                        ))
                    )
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        marginBottom: 40
    },
    bookingItem: {
        width: '100%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    disabled: {
        backgroundColor: "#E4E0E1"
    },
    tripText: {
        color: 'black',
        fontWeight: "bold",
    }
});