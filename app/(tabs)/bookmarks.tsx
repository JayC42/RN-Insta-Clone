import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { COLORS } from '@/constants/theme';
import { Loader } from '@/components/Loader';
import { styles } from '@/styles/create.styles';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';

export default function bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);
  const router = useRouter();

  if (bookmarkedPosts === undefined) return <Loader />
  if (bookmarkedPosts.length === 0) return <NoBookmarksFound />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {/* POSTS */}
      <ScrollView contentContainerStyle={{
        padding: 8, 
        flexDirection: "row", 
        flexWrap: "wrap",
      }}>
        {bookmarkedPosts.map((post) => {
          if (!post) return null;
          return (
            <Link
              asChild
              key={post._id}
              href={{
                pathname: "/",
                params: { highlightedPostId: post._id.toString() }
              }}
            >
              <TouchableOpacity style={{ width: "33.33%", padding: 1 }}>
                <Image 
                  source={{ uri: post.imageUrl }} 
                  style={{ width: "100%", aspectRatio: 1 }} 
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </TouchableOpacity>
            </Link>
          );
        })}
      </ScrollView>
    </View>
  );
}

function NoBookmarksFound() {
  return (
    <View
      style={{ 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: COLORS.background, 
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 22 }}>No bookmarked posts yet</Text>
    </View>
  );
}