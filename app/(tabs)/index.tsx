import { FlatList, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { styles } from "../../styles/feed.styles";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import { useEffect, useRef, useState } from "react";
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  Easing 
} from "react-native-reanimated";
import StoriesSection from "@/components/Stories";

export default function Index() {
  const { signOut } = useAuth();
  const posts = useQuery(api.posts.getFeedPosts);
  const { highlightedPostId } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);
  const [highlightedPostIndex, setHighlightedPostIndex] = useState<number | null>(null);
  const { height } = useWindowDimensions();

  useEffect(() => {
    if (highlightedPostId && posts) {
      const index = posts.findIndex(post => post._id.toString() === highlightedPostId);
      if (index !== -1) {
        setHighlightedPostIndex(index);
        // Scroll to the post
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5 // Center the post
        });
      }
    }
  }, [highlightedPostId, posts]);

  if(posts === undefined) return <Loader /> 
  if(posts.length === 0) return NoPostsFound()

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>spotlight</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View> 

      {/* POSTS */}
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={({ item, index }) => (
          <HighlightedPost 
            post={item} 
            isHighlighted={index === highlightedPostIndex}
          />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={<StoriesSection/>}
        getItemLayout={(data, index) => ({
          length: height * 0.7, // Approximate height of a post
          offset: height * 0.7 * index,
          index,
        })}
      />
    </View>
  );
}

const HighlightedPost = ({ post, isHighlighted }: { post: any, isHighlighted: boolean }) => {
  const animatedStyle = useAnimatedStyle(() => {
    if (!isHighlighted) return {};

    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.02, { duration: 200, easing: Easing.ease }),
              withTiming(1, { duration: 200, easing: Easing.ease })
            ),
            3,
            false
          )
        }
      ],
      backgroundColor: withRepeat(
        withSequence(
          withTiming(COLORS.primary + '20', { duration: 200 }),
          withTiming('transparent', { duration: 200 })
        ),
        3,
        false
      )
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Post post={post} />
    </Animated.View>
  );
};

const NoPostsFound = () => {
  return (
    <View
      style={{
        flex: 1, 
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
    </View> 
  )
};
