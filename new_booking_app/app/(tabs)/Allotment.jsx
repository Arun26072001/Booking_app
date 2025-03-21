import { ScrollView, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { FormControl, Center, Box, Heading, VStack, Button } from 'native-base';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_BASEURL } from '@env';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EssentialValues } from "../_layout";
import { Picker } from '@react-native-picker/picker';

export default function Allotment() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, updateBooking } = useContext(EssentialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [allotment, setAllotment] = useState({
    allotmentOfficer: data._id,
    driver: '',
    vehicle: '',
  });

  function fillAllotmentForm(value, name) {
    setAllotment((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const addAllotment = async () => {
    try {
      const allot = await axios.post(`${API_BASEURL}/api/allotment/${id}`, allotment);
      Toast.show({ type: 'success', text1: allot?.data?.message });
      setAllotment({ allotmentOfficer: '', driver: '', vehicle: '' });
      updateBooking();
      router.push('/home');
    } catch (error) {
      Toast.show({ type: 'error', text1: error.response.data.error });
    }
  };

  async function updateAllotment() {
    try {
      const updatedDetails = {
        allotmentOfficer: allotment.allotmentOfficer,
        driver: allotment.driver,
        vehicle: allotment.vehicle,
      };

      const update = await axios.put(`${API_BASEURL}/api/allotment/${id}`, updatedDetails, {
        headers: { Authorization: data.token || '' },
      });
      Toast.show({ type: 'success', text1: 'Success', text2: update?.data?.message });
      updateBooking();
      router.push('/home');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed', text2: error.response.data.error });
    }
  }

  async function fetchBookingData() {
    setIsLoading(true);
    try {
      const booking = await axios.get(`${API_BASEURL}/api/booking/${id}`);
      setBookingData(booking.data);
    } catch (error) {
      Toast.show({ type: 'error', text1: error.response.data.error });
    }
    setIsLoading(false);
  }

  async function fetchVehicles() {
    try {
      const res = await axios.get(`${API_BASEURL}/api/vehicle`);
      setVehicles(res.data);
    } catch (error) {
      setVehicles([]);
      console.log(error.response.error.data);
    }
  }

  useEffect(() => {
    async function fetchEmps() {
      setIsLoading(true);
      try {
        const emps = await axios.get(`${API_BASEURL}/api/auth`);
        setDrivers(emps.data.filter((emp) => emp.account === 4));
        setEmployees(emps.data);
      } catch (error) {
        Toast.show({ type: 'error', text1: error.response.data.message });
      }
      setIsLoading(false);
    }

    fetchVehicles();
    fetchBookingData();
    fetchEmps();
  }, []);

  useEffect(() => {
    async function fetchAllotment() {
      try {
        const allotedDatails = await axios.get(`${API_BASEURL}/api/allotment/${id}`);
        setAllotment(allotedDatails.data);
      } catch (error) {
        Toast.show({ type: 'info', text1: 'Fill up below details', text2: error.response.data.error });
      }
    }

    if (['1', '3'].includes(data.account)) {
      fetchAllotment();
    }
  }, []);

  return (
    <ScrollView>
      {isLoading ? (
        <ActivityIndicator size="large" color="blue" />
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
                <Picker selectedValue={allotment.allotmentOfficer} onValueChange={(value) => fillAllotmentForm(value, 'allotmentOfficer')}>
                  <Picker.Item label="Select Allotment Office" />
                  {employees.map((emp) => (
                    <Picker.Item key={emp._id} label={emp.name} value={emp._id} />
                  ))}
                </Picker>
              </FormControl>
              <FormControl>
                <FormControl.Label>Driver</FormControl.Label>
                <Picker selectedValue={allotment.driver} onValueChange={(value) => fillAllotmentForm(value, 'driver')}>
                  <Picker.Item label="Select Driver" />
                  {drivers.map((emp) => (
                    <Picker.Item key={emp._id} label={emp.name} value={emp._id} />
                  ))}
                </Picker>
              </FormControl>
              <FormControl>
                <FormControl.Label>Vehicle</FormControl.Label>
                <Picker selectedValue={allotment.vehicle} onValueChange={(value) => fillAllotmentForm(value, 'vehicle')}>
                  <Picker.Item label="Select Vehicle" />
                  {vehicles.map((taxi) => (
                    <Picker.Item key={taxi._id} label={taxi.name} value={taxi._id} />
                  ))}
                </Picker>
              </FormControl>
              <Button mt="2" colorScheme="indigo" onPress={allotment?._id && ['1', '3'].includes(data.account) ? updateAllotment : addAllotment}>
                {allotment?._id && ['1', '3'].includes(data.account) ? 'Update Allotment' : 'Allot Now'}
              </Button>
            </VStack>
          </Box>
        </Center>
      )}
    </ScrollView>
  );
}
