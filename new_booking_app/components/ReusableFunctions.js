import Toast from "react-native-toast-message";
import { API_BASEURL } from "@env";
console.log(API_BASEURL);

function warnMsg(type) {
    if (type === "call") {
        Toast.show({
            type: "error",
            text1: "Warning",
            text2: "You can't make call, until allot the taxi for this trip"
        })
    } else if (type === "share") {
        Toast.show({
            type: "error",
            text1: "Warning",
            text2: "You can't share details, until allot the taxi for this trip"
        })
    } else if ("complete") {
        Toast.show({
            type: "error",
            text1: "Warning",
            text2: "You can't access trip-completed form, until allot the taxi for this trip"
        })
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