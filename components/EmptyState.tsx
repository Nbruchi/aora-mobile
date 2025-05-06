import React from 'react'
import {Image, Text, View} from "react-native";
import {images} from "@/constants";
import CustomButton from "@/components/CustomButton";

interface Props {
    title: string;
    subtitle: string;
}

const EmptyState = ({title,subtitle}:Props) => {
    return (
        <View className="justify-center items-center px-4">
            <Image source={images.empty} className="w-[270px] h-[215px]" resizeMode="contain"/>
            <Text className="text-xl text-center font-psemibold text-white mt-2">
                {title}
            </Text>
            <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>
            <CustomButton handlePress={() =>{}} containerStyles="w-full my-5" title="Create Video" />
        </View>
    )
}
export default EmptyState
