import { Link, router } from "expo-router";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { useLoginMutation } from "@/store/userApi";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setError } from "@/store/userSlice";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const dispatch = useAppDispatch();
    const [login, { isLoading, error, data }] = useLoginMutation();

    useEffect(() => {
        if (error) {
            console.log('Login error:', error);
            if ('data' in error) {
                const errorData = error.data as { message?: string } | undefined;
                Alert.alert('Login Failed', errorData?.message || 'An error occurred');
                dispatch(setError(errorData?.message || 'An error occurred'));
            } else if ('error' in error) {
                // Handle network errors
                const errorMessage = error.error === 'TypeError: Network request failed' 
                    ? 'Network error. Please check your internet connection and try again.'
                    : error.error;
                Alert.alert('Login Failed', errorMessage);
                dispatch(setError(errorMessage));
            } else {
                Alert.alert('Login Failed', 'An error occurred');
                dispatch(setError('An error occurred'));
            }
        }

        if (data) {
            dispatch(setUser(data));
            router.replace('/home');
        }
    }, [error, data, dispatch]);

    const submit = async () => {
        if (!form.password || !form.email) {
            Alert.alert("Error", "Please fill in all the fields!");
            return;
        }

        try {
            await login(form);
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full min-h-[85vh] justify-center px-4 my-6">
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        className="w-[115px] h-[35px]"
                    />
                    <Text className="text-2xl text-white mt-10 font-psemibold">
                        Login to Aora
                    </Text>
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        placeholder="Your email address"
                        keyboardType="email-address"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        placeholder="Your password"
                        handleChangeText={(e) =>
                            setForm({ ...form, password: e })
                        }
                        otherStyles="mt-7"
                    />
                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isLoading}
                    />
                    <View className="justify-center pt-5 flex-row font-pregular gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don&#39;t have account?
                        </Text>
                        <Link
                            href="/register"
                            className="text-lg text-secondary font-psemibold"
                        >
                            Sign Up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Login;
