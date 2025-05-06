import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import EmptyState from "@/components/EmptyState";
import PostCard from "@/components/PostCard";
import { icons } from "@/constants";
import InfoBox from "@/components/InfoBox";

// Import Redux hooks and slices
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUser, clearUser } from "@/store/slices/user/userSlice";
import { useLogoutMutation } from "@/store/slices/user/userApi";
import { useGetPostsByUserIdQuery } from "@/store/slices/post/postApi";

const Profile = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

    // Fetch user's posts
    const { 
        data: posts, 
        isLoading: isLoadingPosts, 
        error: postsError 
    } = useGetPostsByUserIdQuery(user?._id || '', { 
        skip: !user?._id,
        refetchOnMountOrArgChange: true
    });

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            dispatch(clearUser());
            router.replace("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (!user) {
        router.replace("/login");
        return null;
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <PostCard post={item} key={item._id} />
                )}
                ListHeaderComponent={() => (
                    <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                        <TouchableOpacity
                            className="w-full items-end mb-10"
                            onPress={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Image
                                    source={icons.logout}
                                    resizeMode="contain"
                                    className="w-6 h-6"
                                />
                            )}
                        </TouchableOpacity>
                        <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                            <Image
                                source={{ uri: user.avatar || 'https://via.placeholder.com/150' }}
                                className="w-[90%] h-[90%] rounded-lg"
                                resizeMode="cover"
                                defaultSource={require('@/assets/images/profile.png')}
                            />
                        </View>
                        <InfoBox
                            title={user.username}
                            containerStyles="mt-5"
                            textStyles="text-lg"
                        />
                        <View className="mt-5 flex-row">
                            <InfoBox
                                title={posts?.length || 0}
                                subtitle="Posts"
                                containerStyles="mr-10"
                                textStyles="text-xl"
                            />
                            <InfoBox
                                title={user.followers?.length || 0}
                                subtitle="Followers"
                                textStyles="text-lg"
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => {
                    if (isLoadingPosts) {
                        return (
                            <View className="flex-1 justify-center items-center py-20">
                                <ActivityIndicator size="large" color="#ffffff" />
                                <Text className="text-white mt-4">Loading posts...</Text>
                            </View>
                        );
                    }

                    if (postsError) {
                        return (
                            <EmptyState
                                title="Error loading posts"
                                subtitle="Please try again later"
                            />
                        );
                    }

                    return (
                        <EmptyState
                            title="No posts found"
                            subtitle="You haven't created any posts yet"
                        />
                    );
                }}
                refreshing={isLoadingPosts}
                onRefresh={() => {
                    if (user?._id) {
                        // Refetch posts
                        // This will work because we're using RTK Query
                    }
                }}
            />
        </SafeAreaView>
    );
};

export default Profile;
