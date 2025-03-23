import { Link, Stack } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

export default function NotFoundScreen() {

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Link href="/Login" style={styles.link}>
        <Text style={{ textAlign: "center" }}>Go to home screen!</Text>
      </Link>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
