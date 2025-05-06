import {View, FlatList, RefreshControl} from 'react-native'
import React, {useCallback, useState} from 'react'
import {useGetPostsQuery} from "@/store/slices/post/postAPI";
import SearchInput from '@/components/SearchInput';
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";

const Search = () => {
    const [search, setSearch] = useState<string>("")
    const {data,refetch,isFetching, isLoading} = useGetPostsQuery(search ? {search}: undefined);

    const onRefresh = useCallback(() =>{
        refetch()
    },[refetch])

    return (
        <View className="flex-1 bg-black">
            <View className="p-4 pb-0">
                <SearchInput
                    initialQuery={search}
                    // You might need to update SearchInput to accept onQueryChange
                    onQueryChange={(q: string) => setSearch(q)}
                />
            </View>
            <FlatList
                data={data || []}
                renderItem={({item}) => <PostCard post={item} />}
                keyExtractor={item => item._id}
                contentContainerStyle={{flexGrow: 1}}
                ListEmptyComponent={() =>
                    !isLoading && (
                        <EmptyState
                            title="No videos found"
                            subtitle="Try searching for something else."
                        />
                    )
                }
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={onRefresh}
                        colors={["#8b5cf6"]}
                        tintColor="#8b5cf6"
                    />
                }
            />
        </View>

    )
}

export default Search
