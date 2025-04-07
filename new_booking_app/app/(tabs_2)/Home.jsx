import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import NoFound from "../../components/ui/NoFound";
import { EssentialValues } from "../_layout";
import TripCard from "../../components/ui/TripCard";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { warnMsg } from "../../components/ReusableFunctions";
import { API_BASEURL } from "@env";
import { useRouter } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Loader from "@/components/ui/Loader";

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
        }finally{
            
            setIsLoading(false);
        }
    }
    async function fetchAllertedBooking() {
        try {
            const alts = await axios.get(`${API_BASEURL}/api/allotment`, {
                headers: { Authorization: token }
            });
            setAllotments(alts.data);
        } catch (error) {

            Toast.show({
                type: "error",
                text1: error.response.data.message
            })
        }
    }

    const getBookings = async () => {
        setIsLoading(true);
        try {
            const booking = await axios.get(`${API_BASEURL}/api/booking`, {
                headers: { Authorization: token }
            });
            const allBookings = booking.data.filter((data) => data.tripCompleted === false);

            if (account === "1") {
                setBookings(allBookings);
            } else {
                setBookings(allBookings.filter((booking) => booking.bookingOfficer === _id));
            }
        } catch (error) {
            console.log(error);

            setErrorMsg(error?.response?.data?.error);
        }finally{
            
            setIsLoading(false);
        }
    };

    async function getDriverBookings() {
        setIsLoading(true);
        try {
            const trips = await axios.get(`${API_BASEURL}/api/booking/driver-booking/${_id}`, {
                headers: { Authorization: token }
            });
            setBookings(trips.data.filter((data) => data.tripCompleted === false));
        } catch (error) {
            console.log("Error in fetch driver bookings", error);
            setErrorMsg(error?.response?.data?.error)
        }finally{
            
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (["1", "2"].includes(account)) {
            getBookings();
        } else if (account === "3") {
            getAllotorBooking();
            // setIsLoading(false);
        } else if (account === "4") {
            getDriverBookings();
        }
        fetchAllertedBooking()
    }, [account, changeBookings]);

    async function deleteBooking(booking) {
        try {
            await axios.delete(`${API_BASEURL}/api/booking/${booking._id}`, {
                headers: { Authorization: token }
            });
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

    function updateTripCompleted(booking) {
        if (account === "1") {
            router.push({ pathname: "/TripCompleted", params: { id: booking._id, tripCompleted: booking.tripCompleted } })
        } else {
            const isAlloted = allotments.find((allot) => allot.bookingId === booking._id);
            if (isAlloted) {
                handleNavigationOrToast(booking)
            } else {
                return warnMsg("complete")
            }
        }
    }

    const handleNavigationOrToast = (booking) => {

        if (booking.tripCompleted) {
            if (account === "1") {
                // Navigate if account is "1" and trip is completed
                router.push({ pathname: "/TripCompleted", params: { id: booking._id, tripCompleted: booking.tripCompleted } })
            } else {
                // Show toast if trip is already completed
                Toast.show({
                    type: "info",
                    text1: "Trip already completed with starting and closing Kms.",
                });
            }
        } else if (["1", "3", "4"].includes(account)) {
            // Navigate for accounts "1", "3", or "4" if the trip is not completed
            router.push({ pathname: "/TripCompleted", params: { id: booking._id, tripCompleted: booking.tripCompleted, allotment: booking.allotment } })
        }
    };

    async function deleteBooking(booking) {
        try {
            const deletedBooking = await axios.delete(`${API_BASEURL}/api/booking/${booking._id}`, {
                headers: { Authorization: token }
            });
            Toast.show({
                type: "success",
                text1: "success",
                text2: deletedBooking?.data?.message
            })
            updateBooking();

        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed",
                text2: error.response.data.error
            })
        }
    }

    function chooseBookingChange(booking) {
        Alert.alert('Delete Booking', 'Are you sure you want to delete This booking ?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => deleteBooking(booking) },
        ]);
    }

    function onSwipe(type, booking) {
        if (type === "left" && ["1", "2"].includes(account)) {
            if (booking.tripCompleted === false) {
                chooseBookingChange(booking)
            } else {
                Toast.show({
                    type: "info",
                    text1: "warning",
                    text2: "You can't delete this booking, Because trip has been completed!"
                })
            }
        } else {
            router.push({ pathname: "/Booking", params: { bookingId: booking._id } })
        }
    }

    const renderLeftActions = () => (
        <View style={[styles.actionContainer, styles.leftAction]}>
            <Text style={styles.actionText}><FontAwesome6 name="pen" size={15} color="white" /></Text>
        </View>
    );

    const renderRightActions = () => (
        <View style={[styles.actionContainer, styles.rightAction]}>
            <Text style={styles.actionText}><FontAwesome6 name="trash" size={15} color="white" /></Text>
        </View>
    );

    if (isLoading) {
        return <Loader size="large" color="blue" />;
    }

    if (errorMsg) {
        return <NoFound message={errorMsg} />;
    }

    const renderBooking = ({ item: booking }) => (
        ["1", "2"].includes(account) ?
            <Swipeable
                renderLeftActions={renderLeftActions}
                renderRightActions={renderRightActions}
                onSwipeableLeftOpen={() => onSwipe("right", booking)}
                onSwipeableRightOpen={() => onSwipe("left", booking)}
            >
                <TripCard
                    booking={booking}
                    account={account}
                    allotments={allotments}
                    updateTripCompleted={updateTripCompleted}
                />
            </Swipeable> :
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
    }, leftAction: {
        backgroundColor: '#FCC737',
        height: "98%"
    },
    rightAction: {
        backgroundColor: '#F44336',
        height: "98%"
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    }
});