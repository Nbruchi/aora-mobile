import React from 'react'
import {Text, TouchableOpacity} from "react-native";

interface CustomButtonProps {
    handlePress: () => void;
    containerStyles?: string;
    title: string;
    textStyles?: string;
    isLoading?: boolean;
}

const CustomButton = ({handlePress, containerStyles, title, textStyles, isLoading}: CustomButtonProps) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            disabled={isLoading}
            className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center cursor-pointer ${containerStyles} ${isLoading ? "opacity-50" : ""}`}
        >
            <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default CustomButton
