import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Post, useFeedStore } from "../lib/store";
import CommentList from "./CommentList";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Feed() {
  const posts = useFeedStore((s) => s.posts);
  const toggleLike = useFeedStore((s) => s.toggleLike);

  if (posts.length === 0) {
    return <Text style={{ textAlign: "center", color: "#777" }}>ยังไม่มีโพสต์</Text>;
  }

  return (
    <View style={{ gap: 12 }}>
      {posts.map((p) => (
        <View key={p.id} style={styles.card}>
          <Text style={styles.author}>{p.author}</Text>
          <Text style={styles.text}>{p.text}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.likeBtn}
              onPress={() => toggleLike(p.id)}
              accessibilityRole="button"
              accessibilityLabel={p.likedByMe ? "Unlike" : "Like"}
            >
              <AntDesign name={p.likedByMe ? "like" : "like"} size={18} />
              <Text style={styles.likeText}>{p.likes}</Text>
            </TouchableOpacity>
          </View>

          <CommentList postId={p.id} comments={p.comments} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#eee" },
  author: { fontWeight: "700", marginBottom: 4 },
  text: { fontSize: 16 },
  actions: { marginTop: 8, flexDirection: "row", gap: 12, alignItems: "center" },
  likeBtn: { flexDirection: "row", gap: 6, alignItems: "center" },
  likeText: { fontWeight: "600" },
});
