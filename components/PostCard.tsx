import { View, Text, Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/user/userSlice";
import { useLikePostMutation, useSavePostMutation } from "@/store/slices/post/postApi";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const currentUser = useAppSelector(selectUser);
  const [likePost] = useLikePostMutation();
  const [savePost] = useSavePostMutation();

  // Check if the post is liked or saved by the current user
  const isLiked = post.likes?.includes(currentUser?._id || '');
  const isSaved = post.saves?.includes(currentUser?._id || '');

  // Get the username from the post's creator (which could be a string ID or a User object)
  const getUsername = () => {
    if (typeof post.creator === 'string') {
      return 'User';
    } else {
      return (post.creator as User).username;
    }
  };

  // Get the avatar from the post creator
  const getAvatar = () => {
    if (typeof post.creator === 'string') {
      return 'https://via.placeholder.com/150';
    } else {
      return (post.creator as User).avatar || 'https://via.placeholder.com/150';
    }
  };

  // Get the first image URL from the post's images array
  const getImageUrl = () => {
    if (!post.images || post.images.length === 0) {
      return 'https://via.placeholder.com/300';
    }

    // If the first item is a string (ID), we can't display it directly
    // In a real app, we would fetch the image by ID
    if (typeof post.images[0] === 'string') {
      return 'https://via.placeholder.com/300';
    }

    // Otherwise, it's an Image object
    return `/images/${post.images[0]._id}`;
  };

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
              source={{ uri: getAvatar() }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
              defaultSource={require('../assets/images/profile.png')}
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
              {getUsername()}
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
        source={{ uri: getImageUrl() }}
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
