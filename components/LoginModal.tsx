import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuthStore } from "../lib/store";
import { signin } from "../lib/api";

type Props = { visible: boolean; onClose: () => void };

export default function LoginModal({ visible, onClose }: Props) {
  const { loginWithBearer } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async () => {
    setErr("");
    try {
      if (!email.trim() || !password.trim() || !apiKey.trim()) {
        setErr("กรอกอีเมล/รหัสผ่าน และ API Key ให้ครบ");
        return;
      }
      setLoading(true);
      const { token, name: apiName } = await signin(
        email.trim(),
        password.trim(),
        apiKey.trim()
      );
      loginWithBearer({
        name: name.trim() || apiName,
        email: email.trim(),
        apiKey: apiKey.trim(),
        bearer: token,
      });
      onClose();
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>เข้าสู่ระบบ</Text>

          <TextInput
            placeholder="ชื่อที่จะแสดง (ไม่บังคับ)"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#4B5563"
          />
          <TextInput
            placeholder="อีเมลมหาวิทยาลัย"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#4B5563"
          />
          <View style={styles.row}>
            <TextInput
              placeholder="รหัสผ่าน"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure}
              style={[styles.input, { flex: 1, marginTop: 0 }]}
              placeholderTextColor="#4B5563"
            />
            <TouchableOpacity
              onPress={() => setSecure((s) => !s)}
              style={styles.secureBtn}
            >
              <Text style={{ color: "#007bff", fontWeight: "600" }}>
                {secure ? "แสดง" : "ซ่อน"}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="API Key (x-api-key)"
            value={apiKey}
            onChangeText={setApiKey}
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#4B5563"
          />

          {err ? <Text style={{ color: "red", marginTop: 6 }}>{err}</Text> : null}

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={onSubmit}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 8 }}>
            <Text style={{ color: "#555" }}>ยกเลิก</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: { width: "85%", maxWidth: 420, backgroundColor: "#fff", borderRadius: 14, padding: 16 },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, fontSize: 16, marginTop: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  secureBtn: { paddingVertical: 10, paddingHorizontal: 12 },
  btn: { backgroundColor: "#007bff", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 12 },
  btnText: { color: "#fff", fontWeight: "700" },
});
