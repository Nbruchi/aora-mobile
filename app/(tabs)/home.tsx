import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { useGetPostsQuery } from "@/store/slices/post/postAPI";
import PostCard from "@/components/PostCard";
import { useAppSelector } from "@/store/hooks";

const Home = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const user = useAppSelector((state) => state.user.user);

    // Fetch all posts
    const { data: posts, refetch } = useGetPostsQuery();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <PostCard post={item} key={item._id} />
                )}
                ListHeaderComponent={() => (
                    <View className="my-6 px-4 space-y-6">
                        <View className="justify-between items-start flex-row mb-6">
                            <View>
                                <Text className="font-pmedium text-sm text-gray-100">
                                    Welcome Back,
                                </Text>
                                <Text className="text-2xl font-psemibold text-white">
                                    {user?.username}
                                </Text>
                            </View>
                            <View className="mt-1.5">
                                <Image
                                    source={images.logoSmall}
                                    className="w-9 h-10"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                        <SearchInput />
                        <View className="w-full flex-1 pt-5 pb-8">
                            <Text className="text-gray-100 text-lg font-pregular mb-3">
                                Latest Videos
                            </Text>
                            <Trending />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No videos found"
                        subtitle="Be the first one to upload a video"
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />
        </SafeAreaView>
    );
};

export default Home;
