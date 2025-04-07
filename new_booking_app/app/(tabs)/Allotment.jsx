import { ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { FormControl, Center, Box, Heading, VStack, Button } from 'native-base';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_BASEURL } from '@env';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EssentialValues } from "../_layout";
import { Picker } from '@react-native-picker/picker';
import Loader from '@/components/ui/Loader';

export default function Allotment() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { data, updateBooking } = useContext(EssentialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [allotment, setAllotment] = useState({});
  const [isWokringApi, setIsWorkingApi] = useState(false);

  function fillAllotmentForm(value, name) {
    setAllotment((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const addAllotment = async () => {
    setIsWorkingApi(true);
    try {
      const newAllotment = {
        ...allotment,
        allotmentOfficer: data._id
      }
      const allot = await axios.post(`${API_BASEURL}/api/allotment/${bookingData._id}`, newAllotment, {
        headers: { Authorization: data.token }
      });
      Toast.show({ type: 'success', text1: allot?.data?.message });
      setAllotment({});
      updateBooking();
      router.push('/Home');
    } catch (error) {
      Toast.show({ type: 'error', text1: "Error", text2: error.response.data.error });
    }
    setIsWorkingApi(false);
  };

  async function updateAllotment() {
    setIsWorkingApi(true)
    try {
      const updatedDetails = {
        ...allotment
      };

      const update = await axios.put(`${API_BASEURL}/api/allotment/${bookingData._id}`, updatedDetails, {
        headers: { Authorization: data.token || '' },
      });
      Toast.show({ type: 'success', text1: 'Success', text2: update?.data?.message });
      setAllotment({ allotmentOfficer: '', driver: '', vehicle: '' });
      updateBooking();
      router.push('/Home');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed', text2: error.response.data.error });
    }
    setIsWorkingApi(false);
  }

  async function fetchVehicles() {
    try {
      const res = await axios.get(`${API_BASEURL}/api/vehicle`, {
        headers: { Authorization: data.token }
      });
      setVehicles(res.data);
    } catch (error) {
      setVehicles([]);
      console.log(error.response.error.data);
    }
  }
  async function fetchEmps() {
    setIsLoading(true);
    try {
      const emps = await axios.get(`${API_BASEURL}/api/auth`, {
        headers: {
          Authorization: data.token || ""
        }
      });
      setDrivers(emps.data.filter((emp) => emp.account === 4));
      setEmployees(emps.data);
    } catch (error) {
      Toast.show({ type: 'error', text1: error.response.data.message });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const initialize = async () => {
      if (!params?._id) {
        Toast.show({
          type: "info",
          text1: "Warning",
          text2: "You can allot only for selected trip",
        });
        router.push("/Home");
        return;
      }

      setBookingData(params);
      setIsLoading(true);
      try {
        await Promise.all([fetchVehicles(), fetchEmps()]);
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Initialization Failed",
          text2: "Check your network or try again",
        });
      } finally {
        setIsLoading(false); // ✅ End loading state
      }
    };

    initialize();
  }, []);

  // ✅ Fetch allotment only when needed
  useEffect(() => {
    const fetchAllotment = async () => {
      try {
        const res = await axios.get(`${API_BASEURL}/api/allotment/${params._id}`, {
          headers: { Authorization: data.token },
        });
        setAllotment(res.data);
      } catch (error) {
        Toast.show({
          type: "info",
          text1: "Fill up below details",
          text2: error?.response?.data?.error || "Error fetching allotment",
        });
      }
    };

    if (['1', '3'].includes(data.account) && params?._id) {
      fetchAllotment();
    }
  }, [params?._id]);
  console.log(drivers);
  console.log(allotment);


  return (
    <ScrollView>
      {isLoading ? (
        <Loader size="large" color="blue" />
      ) : (
        <Center w="100%">
          <Box safeArea p="2" w="90%" maxW="290" py="8">
            <Heading size="lg" fontWeight="semibold">Allot {bookingData?.vehicleType?.vehicleType} Taxi</Heading>
            <Heading mt="1" fontWeight="medium" size="xs">
              For {bookingData?.pickupLocation?.charAt(0)?.toUpperCase() + bookingData?.pickupLocation?.slice(1)} - {bookingData?.destination?.charAt(0)?.toUpperCase() + bookingData?.destination?.slice(1)} Trip
            </Heading>
            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label>Allotment Officer</FormControl.Label>
                <Picker selectedValue={allotment?.allotmentOfficer || data._id} onValueChange={(value) => fillAllotmentForm(value, 'allotmentOfficer')}>
                  <Picker.Item label="Select Allotment Office" />
                  {employees.map((emp) => (
                    <Picker.Item key={emp._id} label={emp.name} value={emp._id} />
                  ))}
                </Picker>
              </FormControl>
              <FormControl>
                <FormControl.Label>Driver</FormControl.Label>
                <Picker selectedValue={allotment?.driver} onValueChange={(value) => fillAllotmentForm(value, 'driver')}>
                  <Picker.Item label="Select Driver" />
                  {drivers.map((emp) => (
                    <Picker.Item key={emp._id} label={emp.name} value={emp._id} />
                  ))}
                </Picker>
              </FormControl>
              <FormControl>
                <FormControl.Label>Vehicle</FormControl.Label>
                <Picker selectedValue={allotment?.vehicle} onValueChange={(value) => fillAllotmentForm(value, 'vehicle')}>
                  <Picker.Item label="Select Vehicle" />
                  {vehicles.map((taxi) => (
                    <Picker.Item key={taxi._id} label={taxi.name} value={taxi._id} />
                  ))}
                </Picker>
              </FormControl>
              <Button mt="2" colorScheme="indigo" onPress={allotment?._id && ['1', '3'].includes(data.account) ? updateAllotment : addAllotment}>
                {isWokringApi ? <Loader color={"white"} /> : allotment?._id && ['1', '3'].includes(data.account) ? 'Update Allotment' : 'Allot Now'}
              </Button>
            </VStack>
          </Box>
        </Center>
      )}
    </ScrollView>
  );
}
