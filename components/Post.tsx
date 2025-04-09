import { styles } from "@/styles/feed.styles";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from 'react-native'
import { Image } from "expo-image";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

type PostProps = {
  post:{
    _id: Id<"posts">;
    imageUrl: string;
    caption?: string;
    likes: number;
    comments: number;
    _creationTime: number;  
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      _id: string;
      username: string;
      image: string;
    }
  }
}

// TODO: add the actual type here
export default function Post({ post }: PostProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likesCount, setLikesCount] = useState(post.likes);

    const handleLike = async () => {

    }

    return (
    <View style={styles.post}>
    
    {/* POST HEADER */}
    <View style={styles.postHeader}>
        <Link href={"/(tabs)/notifications"}>
            <TouchableOpacity style={styles.postHeaderLeft}>
                <Image 
                  source={post.author.image}
                  style={styles.postAvatar}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
                <Text style={styles.postUsername}>{post.author.username}</Text>
            </TouchableOpacity>
        </Link>

        {/* Todo: set delete button for owner post only */}
        {/* <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
        </TouchableOpacity> */}
        <TouchableOpacity>
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        </View>

        {/* IMAGE */}
        <Image 
            source={post.imageUrl}
            style={styles.postImage}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
        />

        {/* POST ACTIONS */}
        <View style={styles.postActions}>
            <View style={styles.postActionsLeft}>
                <TouchableOpacity>
                    <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="chatbubble-outline" size={22} color={COLORS.white} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity>
                <Ionicons name={"bookmark-outline"} size={22} color={COLORS.white} />
            </TouchableOpacity>
        </View>

        {/* POST INFO  */}
        <View style={styles.postInfo}>
            <Text style={styles.likesText}>Be the first to like</Text>
            {post.caption && (
                <View style={styles.captionContainer}>
                    <Text style={styles.captionUsername}>{post.author.username}</Text>
                    <Text style={styles.captionText}>{post.caption}</Text>
                </View>
            )}
            <TouchableOpacity>
                <Text style={styles.commentsText}>View all 2 comments</Text>
            </TouchableOpacity>
            <Text style={styles.timeAgo}>2 hours ago</Text>
        </View>
    </View>
  );
}