import { router } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";

import FormField from "@/components/FormField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useCreatePostMutation } from "@/store/slices/post/postAPI";
import {useUploadImageMutation} from "@/store/slices/image/imageAPI";

interface FormState {
    title: string;
   images: ImagePicker.ImagePickerAsset[];
   imageIds: string[];
   description: string;
}

const Create = () => {
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState<FormState>({
        title: "",
        images: [],
        imageIds: [],
        description: "",
    });
    const [createPost] = useCreatePostMutation();
    const [uploadImage] = useUploadImageMutation()

    const openPicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality:1
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setForm(prev => ({
                ...prev,
                images: result.assets,
            }))
        }
    };

    const uploadPickedImages = async () =>{
        if(!form.images.length) return [];

        const ids: string[] = [];

        for(const picked of form.images){
            try{
                const fd = new FormData();
                fd.append("image",{
                    uri: picked.uri,
                    type: picked.type || "image/jpg",
                    name: picked.fileName || "image.jpg"
                } as any)
                const imgRes = await uploadImage(fd).unwrap();
                if(imgRes._id) ids.push(imgRes._id);
            }catch(e){
                Alert.alert("Image upload failed", picked.fileName || picked.uri);
                return [];
            }
        }
        return ids;
    }

    const submit = async () => {
        if (!form.title || !form.description || form.images.length === 0) {
            Alert.alert("Please fill in all the fields");
            return;
        }

        setUploading(true);

        const uploadedIds = await uploadPickedImages();
        if (!uploadedIds.length) {
            setUploading(false);
            return;
        }

        try {
            const payload = {
                title: form.title,
                description: form.description,
                images: uploadedIds,
            }
            await createPost(payload).unwrap();
            Alert.alert("Success", "Post created successfully");
            router.push("/home")
        }catch (error:any) {
            Alert.alert("Error", error?.message || "Failed to upload post")
        }finally {
            setForm({
                title:"",
                images:[],
                imageIds:[],
                description:""
            })
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView className="px-4 my-6">
                <Text className="text-2xl text-white font-psemibold">Create Post</Text>
                <FormField
                    title="Title"
                    value={form.title}
                    placeholder="Your post title..."
                    handleChangeText={(e) => setForm({ ...form, title: e })}
                    otherStyles="mt-10"
                />
                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">Upload Images</Text>
                    <TouchableOpacity onPress={openPicker}>
                        <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center mt-10">
                            {form.images.length ? (
                                <ScrollView horizontal>
                                    {form.images.map((img, i) => (
                                        <Image key={i} source={{ uri: img.uri }} style={{ width: 100, height: 100, marginRight: 8, borderRadius: 10 }} />
                                    ))}
                                </ScrollView>
                            ) : (
                                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                                    <Image source={icons.upload} resizeMode="contain" className="w-1/2 h-1/2" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
                <FormField
                    title="Description"
                    value={form.description}
                    placeholder="What inspired this post?"
                    handleChangeText={(e) => setForm({ ...form, description: e })}
                    otherStyles="mt-7"
                />
                <CustomButton
                    title="Submit & Publish"
                    handlePress={submit}
                    containerStyles="mt-40"
                    isLoading={uploading}
                />
            </ScrollView>
        </SafeAreaView>

    );
};

export default Create;
