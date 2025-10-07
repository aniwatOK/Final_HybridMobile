import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useAuthStore } from "../lib/store";
import { Link } from "expo-router";
import LoginModal from "../components/LoginModal";
import PostComposer from "../components/PostComposer";
import Feed from "../components/Feed";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const apiKey = useAuthStore((s) => s.apiKey);
  const bearer = useAuthStore((s) => s.bearer);
  const logout = useAuthStore((s) => s.logout);

  const [showLogin, setShowLogin] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.header, isWide && { width: 900 }]}>
        <Text style={styles.title}>KKU CIS Social</Text>
        <View style={styles.row}>
          {!isLoggedIn ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={() => setShowLogin(true)}>
              <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={{ marginRight: 8 }}>
                สวัสดี, <Text style={{ fontWeight: "700" }}>{user?.name}</Text>
              </Text>
              <TouchableOpacity style={styles.btnGhost} onPress={logout}>
                <Text>Logout</Text>
              </TouchableOpacity>
            </>
          )}

          {isLoggedIn && (
            <Link href="/members" asChild>
              <TouchableOpacity style={styles.btnSecondary}>
                <Text style={styles.btnText}>ดูสมาชิกในชั้นปี</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>

        {isLoggedIn && (
          <Text style={styles.authInfo}>
            {(apiKey && bearer)
              ? "พร้อมใช้งาน API (Bearer + x-api-key)"
              : "ล็อกอินแล้ว แต่ยังไม่ครบเฮดเดอร์สำหรับเรียก API จริง"}
          </Text>
        )}
      </View>

      <View style={[styles.content, isWide && { width: 900, flexDirection: "row", gap: 16 }]}>
        {!isLoggedIn ? (
          <View style={[styles.welcomeCard, { flex: 1 }]}>
            <Text style={styles.welcomeTitle}>ยินดีต้อนรับ</Text>
            <Text style={styles.welcomeText}>
              กรุณาล็อกอินเพื่อใช้งานแอปได้อย่างเต็มประสิทธิภาพ
            </Text>
          </View>
        ) : (
          <>
            <View style={[styles.col, { flex: 1 }]}>
              <PostComposer />
            </View>
            <View style={[styles.col, { flex: 2 }]}>
              <Feed />
            </View>
          </>
        )}
      </View>

      <LoginModal visible={showLogin} onClose={() => setShowLogin(false)} />
      <Text style={styles.footer}>
        {Platform.OS === "web" ? "Web build via Expo" : `Running on ${Platform.OS}`}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16, gap: 16 },
  header: { width: "100%", maxWidth: 1000, gap: 10 },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap" },
  btnPrimary: { backgroundColor: "#007bff", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  btnSecondary: { backgroundColor: "#28a745", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  btnGhost: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff" },
  btnText: { color: "#fff", fontWeight: "700" },
  authInfo: { textAlign: "center", fontSize: 12, color: "#888" },
  content: { width: "100%", maxWidth: 1000, gap: 16 },
  welcomeCard: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#eee", padding: 16 },
  welcomeTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  welcomeText: { color: "#555" },
  col: { gap: 12 },
  footer: { color: "#aaa", fontSize: 12, marginTop: 4 },
});
