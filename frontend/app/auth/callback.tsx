import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { saveJWT } from "../../src/storage/authStorage";
import {Text} from "react-native";

export default function AuthCallback() {
    const params = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = params.token as string | undefined;

        if (token) {
            saveJWT(token);
        }

        // redirect after a short delay
        setTimeout(() => {
            router.replace("/");
        }, 10);
    }, [params]);

    return <Text>Logging you in...</Text>
}
