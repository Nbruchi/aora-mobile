interface User {
    _id: string;
    username: string;
    email: string;
    token: string;
    likedPosts?: string[];
    savedPosts?: string[];
    followers?: string[];
    avatar?: string;
}

interface Image {
    _id: string;
    name: string;
    contentType: string;
    size: string;
    createdAt: string;
    updatedAt: string;
}

interface Post {
    _id: string;
    title: string;
    description: string;
    slug: string;
    creator: string | User;
    images: string[] | Image[];
    likes: string[];
    saves: string[];
    createdAt: string;
    updatedAt: string;
}