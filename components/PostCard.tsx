import { View, Text, Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants";
import { useLikePostMutation, useSavePostMutation } from "@/store/slices/post/postAPI";
import { usePostCreator } from "@/hooks/usePostCreator";
import { useImageUrl } from "@/hooks/useImageUrl";
import {useAppSelector} from "@/store";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const currentUser = useAppSelector(state => state.user.user)
  const [likePost] = useLikePostMutation();
  const [savePost] = useSavePostMutation();

  // Check if the post is liked or saved by the current user
  const isLiked = post.likes?.includes(currentUser?._id || '');
  const isSaved = post.saves?.includes(currentUser?._id || '');

  // Get the username from the post's creator using our custom hook
  const creatorUsername = usePostCreator(post.creator);


  // Get the first image URL from the post's images array using our custom hook
  const firstImage = post.images && post.images.length > 0 ? post.images[0] : undefined;
  const imageUrl = useImageUrl(firstImage);

  const handleLike = async () => {
    try {
      await likePost(post._id).unwrap();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleSave = async () => {
    try {
      await savePost(post._id).unwrap();
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row items-start gap-3">
        <View className="flex-row items-center justify-center flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={require('../assets/images/profile.png')}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-sm text-white font-psemibold">
              {post.title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creatorUsername}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image
            source={icons.menu}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </View>
      </View>

      <Image
        source={{ uri: imageUrl }}
        className="w-full h-60 mt-3 rounded-xl"
        resizeMode="cover"
        defaultSource={require('../assets/images/thumbnail.png')}
      />

      <View className="flex-row justify-between w-full mt-3">
        <TouchableOpacity onPress={handleLike} className="flex-row items-center">
          <Image
            source={icons.plus}
            className="w-6 h-6 mr-2"
            resizeMode="contain"
            style={{ tintColor: isLiked ? '#FF6B6B' : 'white' }}
          />
          <Text className="text-white">{post.likes?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave}>
          <Image
            source={icons.bookmark}
            className="w-6 h-6"
            resizeMode="contain"
            style={{ tintColor: isSaved ? '#FFD700' : 'white' }}
          />
        </TouchableOpacity>
      </View>

      <Text className="text-white text-sm mt-2 self-start">
        {post.description}
      </Text>
    </View>
  );
};

export default PostCard;
