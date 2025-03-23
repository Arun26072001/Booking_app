import Toast from "react-native-toast-message";
import { API_BASEURL } from "@env";

function warnMsg(type) {
    if (type === "call") {
        Toast.show({
            type: "error",
            text1: "Warning",
            text2: "You can't make a call until you allot the taxi for this trip"
        });
    } else if (type === "share") {
        Toast.show({
            type: "error",
            text1: "Warning",
            text2: "You can't share details until you allot the taxi for this trip"
        });
    } else if (type === "complete") {
        Toast.show({
            type: "error",
            text1: "Warning",
            text2: "You can't access the trip-completed form until you allot the taxi for this trip"
        });
    } else if (type === "starting km") {
        Toast.show({
            type: "error",
            text1: "Warning",
            text2: "You have already uploaded the starting Km image"
        });
    } else if (type === "closing km") {
        Toast.show({
            type: "error",
            text1: "Warning",
            text2: "First of all upload starting Km Image"
        });
    } else {
        Toast.show({
            type: "error",
            text1: "Warning",
            text2: "Invalid action type"
        });
    }
}

async function fetchVehicle() {
    try {
        const vehicles = await axios.get(`${API_BASEURL}/api/vehicle`);
        // setVehicles(vehiclesData.data);
        return vehicles.data

    } catch (error) {
        Toast.show({
            type: "error",
            text1: error?.response?.data?.error
        })
    }
}

module.exports = {
    warnMsg,
    fetchVehicle,
}