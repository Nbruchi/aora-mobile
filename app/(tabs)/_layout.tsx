import React from 'react'
import {View, Image, Text, ImageSourcePropType} from "react-native";
import {Tabs} from "expo-router";
import {icons} from "@/constants";

interface IconProps {
    icon: ImageSourcePropType;
    color: string;
    name: string;
    focused?: boolean;
}

const TabIcon = ({icon, color, name, focused}:IconProps) =>{
    return (
        <View className="items-center justify-center">
            <Image
                source={icon}
                className="w-6 h-6 mb-1"
                resizeMode="contain"
                tintColor={color}
            />
            <Text
                className={`${
                    focused ? "font-psemibold" : "font-pregular"
                } text-xs w-full`}
                style={{ color: color }}
            >
                {name}
            </Text>
        </View>
    );
}

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#FFA001",
            tabBarInactiveTintColor: "#CDCDE0",
            tabBarStyle:{
                backgroundColor: "#161622",
                borderTopWidth:1,
                borderTopColor: "#232533",
                marginBottom: -10,
                paddingTop: 20,
                height: 80
            }
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({color,focused}) =>(
                        <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
                    )
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: "Create",
                    tabBarIcon: ({color,focused}) =>(
                        <TabIcon icon={icons.plus} color={color} name="Create" focused={focused} />
                    )
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: "Saved",
                    tabBarIcon: ({color,focused}) =>(
                        <TabIcon icon={icons.bookmark} color={color} name="Saved" focused={focused} />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({color,focused}) =>(
                        <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
                    )
                }}
            />
        </Tabs>
    )
}

export default TabsLayout
