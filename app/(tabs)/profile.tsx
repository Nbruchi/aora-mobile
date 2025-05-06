import {View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import EmptyState from "@/components/EmptyState";
import PostCard from "@/components/PostCard";
import { icons } from "@/constants";
import InfoBox from "@/components/InfoBox";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import { useLogoutMutation } from "@/store/slices/user/userAPI";
import {useGetPostsByUserIdQuery} from "@/store/slices/post/postAPI";

const Profile = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);
    const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();


   const {
       data: posts = [],
       isLoading: isLoadingPosts,
       error: postsError,
       refetch: refetchPosts,
       isFetching: isFetchingPosts,
   } = useGetPostsByUserIdQuery(user?._id ?? "", {skip: !user?._id})

    const handleLogout = async () => {
       try{
           await logoutApi().unwrap();
           dispatch({type: 'user/clearUser'});
           router.replace("/login");
       }catch(error){
           console.error(`Logout failed: ${error instanceof Error ? error.message : String(error)}`)
       }
    }

    if (!user) {
        router.replace("/login");
        return (
            <SafeAreaView className="bg-primary h-full">
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text className="text-white mt-4">Redirecting to login...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <PostCard post={item} key={item._id} />
                )}
                refreshControl={
                <RefreshControl
                    refreshing={isFetchingPosts}
                    onRefresh={refetchPosts}
                    colors={["#fff"]}
                    tintColor="#fff"
                />
                }
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
                                source={require('@/assets/images/profile.png')}
                                className="w-[90%] h-[90%] rounded-lg"
                                resizeMode="cover"
                            />
                        </View>
                        <InfoBox
                            title={user?.username || 'User'}
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
                                title={user?.followers?.length || 0}
                                subtitle="Followers"
                                textStyles="text-lg"
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => {
                    if (isLoadingPosts || isFetchingPosts) {
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
            />
        </SafeAreaView>
    );
};

export default Profile;
