import React, {useState, useEffect} from 'react'
import {Alert, Image, SafeAreaView, ScrollView, View, Text} from "react-native";
import {images} from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import {Link, router} from "expo-router";
import { useRegisterMutation } from "@/store/userApi";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setError } from "@/store/userSlice";

const Register = () => {
    const [form, setForm] = useState({
        username:"",
        email:"",
        password:""
    });

    const dispatch = useAppDispatch();
    const [register, { isLoading, error, data }] = useRegisterMutation();

    useEffect(() => {
        if (error) {
            console.log('Registration error:', error);
            if ('data' in error) {
                const errorData = error.data as { message?: string } | undefined;
                Alert.alert('Registration Failed', errorData?.message || 'An error occurred');
                dispatch(setError(errorData?.message || 'An error occurred'));
            } else if ('error' in error) {
                // Handle network errors
                const errorMessage = error.error === 'TypeError: Network request failed' 
                    ? 'Network error. Please check your internet connection and try again.'
                    : error.error;
                Alert.alert('Registration Failed', errorMessage);
                dispatch(setError(errorMessage));
            } else {
                Alert.alert('Registration Failed', 'An error occurred');
                dispatch(setError('An error occurred'));
            }
        }

        if (data) {
            dispatch(setUser(data));
            router.replace('/login');
        }
    }, [error, data, dispatch]);

    const submitHandler = async () =>{
        if (!form.username || !form.email || !form.password){
            Alert.alert("Error", "Please fill all the fields");
            return;
        }

        try {
            await register(form);
        } catch (err) {
            console.error('Registration error:', err);
        }
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full min-h-[85vh] justify-center px-4 my-6">
                    <Image source={images.logo} resizeMode="contain" className="w-[115px] h-[35px]"/>
                    <Text className="text-2xl text-white mt-10 font-psemibold">
                        Sign up to Aora
                    </Text>
                    <FormField
                        title="Username"
                        placeholder="Your unique username"
                        value={form.username}
                        handleChangeText={(e) => setForm({ ...form, username: e })}
                        otherStyles="mt-10"
                    />
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
                        placeholder="Your unique password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                    />
                    <CustomButton
                        title="Sign Up"
                        handlePress={submitHandler}
                        containerStyles="mt-7"
                        isLoading={isLoading}
                    />
                    <View className="justify-center pt-5 flex-row font-pregular gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Already have account?
                        </Text>
                        <Link
                            href="/login"
                            className="text-lg text-secondary font-psemibold"
                        >
                            Sign In
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Register
