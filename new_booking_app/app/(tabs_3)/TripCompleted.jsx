import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Box, Heading, VStack, FormControl, Input, Button } from "native-base";
import axios from "axios";
import Toast from "react-native-toast-message";
import { EssentialValues } from "../_layout";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { API_BASEURL } from "@env";
import Loader from "@/components/ui/Loader";

export default function TripCompleted() {
  const router = useRouter();
  const bookingData = useLocalSearchParams(); // ✅ Replace route.params with Expo Router method
  const { _id, tripCompleted } = bookingData;
  const { data, updateBooking } = useContext(EssentialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [tripDetails, setTripDetails] = useState({});
  const [isWorkingApi, setIsWorkingApi] = useState(false);

  async function completeTrip() {
    const body = { ...tripDetails };
    setIsWorkingApi(true);
    try {
      const response = await axios.post(`${API_BASEURL}/api/trip-complete/${_id}`, body, {
        headers: {
          Authorization: data.token || "",
        },
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.message,
      });

      setTripDetails({});
      setFiles([]);
      updateBooking();
      router.replace("/Home"); // ✅ Use router.replace() for Expo Router navigation
    } catch (error) {
      console.log(error);
      
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: error?.response?.data?.error || "Something went wrong",
      });
    }
    setIsWorkingApi(false);
  }

  async function updateCompletedTrip() {
    setIsWorkingApi(true);
    try {
      const updatedTripDetails = {
        bookingId: _id,
        ...tripDetails
      };

      const response = await axios.put(`${API_BASEURL}/api/trip-complete/${_id}`, updatedTripDetails, {
        headers: {
          Authorization: data.token || "",
        },
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.message,
      });

      setTripDetails({});
      setFiles([]);
      router.replace("/Home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: error?.response?.data?.error || "Something went wrong",
      });
    }
    setIsWorkingApi(false);
  }

  function updateTripDetails(value, name) {
    setTripDetails((prev) => ({ ...prev, [name]: value }));
  }

  async function upload() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedFiles = result.assets.map((src) => src.uri);
        setFiles(selectedFiles);

        const data = new FormData();
        result.assets.forEach((src) => {
          data.append("photo", {
            name: src.fileName || `photo-${Date.now()}.jpg`,
            type: "image/jpeg",
            uri: src.uri,
          });
        });

        const response = await fetch(`${API_BASEURL}/api/upload`, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }
        const uploadedFiles = await response.json();
        setTripDetails((prev) => ({
          ...prev,
          tripDoc: uploadedFiles.files.map((file) => file.filename),
        }));
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: error.message || "Something went wrong",
      });
    }
  }

  function removeImage(img) {
    setFiles((prev) => prev.filter((file) => file !== img));
  }

  useEffect(() => {
    async function fetchTripCompletedDetails() {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASEURL}/api/trip-complete/${_id}`, {
          headers: { Authorization: data.token }
        });

        setTripDetails(response.data);
      } catch (error) {
        router.push("/Home")
        // console.error(error. response.data.error);
        Toast.show({
          type: "error",
          text1: "Failed",
          text2: error?.response?.data?.error || "Something went wrong",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (bookingData.allotment && ["1", "4"].includes(data?.account) && bookingData.vehicleInTrip) {
      fetchTripCompletedDetails();
    } else {
      router.push("/Home");
      Toast.show({
        type: "info",
        text1: "Warning",
        text2: "Trip Not yet started"
      })
    }
  }, [_id, data.account, tripCompleted]); // ✅ Added dependencies

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <Loader size="large" color="blue" />
      ) : (
        <Box safeArea p="2" py="2" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800">
            Trip Completed Details
          </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>Starting Km</FormControl.Label>
              <Input keyboardType="numeric" value={tripDetails?.startingKm ? String(tripDetails?.startingKm) : ""} onChangeText={(value) => updateTripDetails(value, "startingKm")} />
            </FormControl>

            <FormControl>
              <FormControl.Label>Closing Km</FormControl.Label>
              <Input keyboardType="numeric" value={tripDetails?.closingKm ? String(tripDetails?.closingKm) : ""} onChangeText={(value) => updateTripDetails(value, "closingKm")} />
            </FormControl>

            <FormControl>
              <FormControl.Label>Received Amount</FormControl.Label>
              <Input keyboardType="numeric" value={tripDetails?.receivedAmount ? String(tripDetails?.receivedAmount) : ""} onChangeText={(value) => updateTripDetails(value, "receivedAmount")} />
            </FormControl>

            {files.length > 0 && (
              <View style={{ flexDirection: "row" }}>
                {files.map((img) => (
                  <TouchableOpacity key={img} onPress={() => removeImage(img)}>
                    <Image source={{ uri: img }} style={styles.img} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Button onPress={upload}>
              Upload Trip Documents
            </Button>
            <Button
              onPress={["1", "4"].includes(data.account) && completeTrip}
            >
              {isWorkingApi ? <Loader color={"white"} /> : data.account === "1" && tripDetails?._id ? "Update Completed Trip" : "Complete Trip"}
            </Button>
          </VStack>
        </Box>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  img: { width: 50, height: 50, resizeMode: "cover", margin: 5 },
});
