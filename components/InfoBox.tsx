import { View, Text } from "react-native";

interface Props {
    title: string | number;
    subtitle?: string;
    containerStyles?: string;
    textStyles?: string;
}

const InfoBox = ({ title, subtitle, containerStyles, textStyles }:Props) => {
    return (
        <View className={containerStyles}>
            <Text
                className={`text-white text-center font-psemibold ${textStyles}`}
            >
                {title}
            </Text>
            <Text className="text-sm text-gray-100 text-center font-pregular">
                {subtitle}
            </Text>
        </View>
    );
};

export default InfoBox;
