import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Linking, Share, Alert } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import NoFound from "../../components/ui/NoFound";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { EssentialValues } from "../_layout";
import TripCard from "../../components/ui/TripCard";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as ImagePicker from 'expo-image-picker';
import { warnMsg } from "../../components/ReusableFunctions";
import { API_BASEURL } from "@env";
import { useRouter } from 'expo-router';

export default function Home() {
    const router = useRouter();
    const { data, changeBookings, updateBooking } = useContext(EssentialValues);
    const { account, _id, token } = data;
    const [allotments, setAllotments] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    async function getAllotorBooking() {
        setIsLoading(true);
        try {
            const trips = await axios.get(`${API_BASEURL}/api/booking/allotor-booking/${_id}`, {
                headers: {
                    Authorization: token || ""
                }
            });
            setBookings(trips.data.filter((data) => data.tripCompleted === false));
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
                const allBookings = booking.data.filter((data) => data.tripCompleted === false);

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
        }
    }, [account, changeBookings]);

    function updateTripCompleted(booking) {
        router.push({ pathname: "/trip-completed", params: { id: booking._id, tripCompleted: booking.tripCompleted } });
    }

    async function deleteBooking(booking) {
        try {
            await axios.delete(`${API_BASEURL}/api/booking/${booking._id}`);
            Toast.show({ type: "success", text1: "Success", text2: "Booking deleted successfully" });
            updateBooking();
        } catch (error) {
            Toast.show({ type: "error", text1: "Failed", text2: error.response.data.error });
        }
    }

    function chooseBookingChange(booking) {
        Alert.alert('Delete Booking', 'Are you sure you want to delete this booking?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () => deleteBooking(booking) },
        ]);
    }

    if (isLoading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    if (errorMsg) {
        return <NoFound message={errorMsg} />;
    }

    const renderBooking = ({ item: booking }) => (
        <TripCard
            booking={booking}
            account={account}
            allotments={allotments}
            updateTripCompleted={updateTripCompleted}
        />
    );

    return (
        <GestureHandlerRootView>
            <FlatList
                style={styles.container}
                showsVerticalScrollIndicator={false}
                data={bookings}
                keyExtractor={(item, index) => item._id || index.toString()}
                renderItem={renderBooking}
                ListEmptyComponent={<NoFound message="No bookings available." />}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        height: "fit-content",
        marginBottom: 40
    },
    actionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
});