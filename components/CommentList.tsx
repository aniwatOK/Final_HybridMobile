import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Comment, useAuthStore, useFeedStore } from "../lib/store";

export default function CommentList({ postId, comments }: { postId: string; comments: Comment[] }) {
  const [text, setText] = useState("");
  const user = useAuthStore((s) => s.user);
  const addComment = useFeedStore((s) => s.addComment);

  const onAdd = () => {
    if (!text.trim() || !user) return;
    addComment(postId, user.name, text.trim());
    setText("");
  };

  return (
    <View style={{ marginTop: 8 }}>
      {comments.map((c) => (
        <View key={c.id} style={styles.comment}>
          <Text style={styles.name}>{c.author}</Text>
          <Text>{c.text}</Text>
        </View>
      ))}
      <View style={styles.row}>
        <TextInput
          placeholder="พิมพ์คอมเมนท์..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <TouchableOpacity onPress={onAdd} style={styles.btn}>
          <Text style={styles.btnText}>ส่ง</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment: { backgroundColor: "#f7f7f7", padding: 8, borderRadius: 8, marginBottom: 6 },
  name: { fontWeight: "600", marginBottom: 2 },
  row: { flexDirection: "row", gap: 8, alignItems: "center", marginTop: 6 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  btn: { backgroundColor: "#007bff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "600" },
});
