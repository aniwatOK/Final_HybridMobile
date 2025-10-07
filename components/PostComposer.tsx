import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useAuthStore, useFeedStore } from "../lib/store";

export default function PostComposer() {
  const [text, setText] = useState("");
  const user = useAuthStore((s) => s.user);
  const addPost = useFeedStore((s) => s.addPost);

  const onPost = () => {
    if (!text.trim() || !user) return;
    addPost(text.trim(), user.name);
    setText("");
  };

  return (
    <View style={styles.card}>
      <TextInput
        placeholder="วันนี้อยากโพสต์ว่าอะไร..."
        value={text}
        onChangeText={setText}
        style={styles.input}
        multiline
      />
      <TouchableOpacity onPress={onPost} style={styles.btn}>
        <Text style={styles.btnText}>โพสต์</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#eee" },
  input: { minHeight: 60, fontSize: 16, padding: 8 },
  btn: { marginTop: 8, alignSelf: "flex-end", backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
  btnText: { color: "#fff", fontWeight: "600" },
});
