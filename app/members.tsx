import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { getMembersByYearReal, getMembersByYearMock, Member } from "../lib/api";
import { useAuthStore } from "../lib/store";

export default function MembersScreen() {
  const router = useRouter();
  const [year, setYear] = useState("2565");
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { apiKey, bearer } = useAuthStore();

  const canCallReal = Boolean(apiKey && bearer);

  const fetchData = async () => {
    setErr("");
    setLoading(true);
    try {
      const y = Number(year);
      const res = canCallReal
        ? await getMembersByYearReal(y, { apiKey: apiKey!, bearer: bearer! })
        : await getMembersByYearMock(y);
      setData(res);
      if (__DEV__) console.log("Normalized members:", res.slice(0, 2));
    } catch (e: any) {
      setErr(String(e?.message || e));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({ item }: { item: Member }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#eee" }}
          />
        ) : (
          <View
            style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: "#eaeaea", alignItems: "center", justifyContent: "center",
            }}
          >
            <Text style={{ color: "#888", fontSize: 12 }}>
              {(item.fullName ?? "U").slice(0, 1)}
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700" }}>
            {item.fullName || item.studentId || "Unknown"}
          </Text>
          <Text style={{ color: "#555", fontSize: 12 }}>
            {item.studentId ?? "-"}{item.major ? ` • ${item.major}` : ""}
          </Text>
          <Text style={{ color: "#777", fontSize: 12 }}>
            {item.schoolName ?? ""}{item.year ? ` • พ.ศ. ${item.year}` : ""}
          </Text>
          {item.email ? <Text style={{ color: "#777", fontSize: 12 }}>{item.email}</Text> : null}
          {item.advisorName ? (
            <Text style={{ color: "#777", fontSize: 12 }}>ที่ปรึกษา: {item.advisorName}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnGhost}>
          <Text>กลับ</Text>
        </TouchableOpacity>

        <TextInput
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          placeholder="ระบุปี (พ.ศ.) เช่น 2565"
          style={styles.input}
        />
        <TouchableOpacity onPress={fetchData} style={styles.btnPrimary}>
          <Text style={styles.btnText}>ดึงรายชื่อ</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 12, marginTop: 4, color: canCallReal ? "#2f7" : "#999" }}>
        API Mode: {canCallReal ? "ใช้ข้อมูลจริง (Bearer + x-api-key)" : "MOCK (ยังไม่ล็อกอินด้วย API)"}
      </Text>

      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
      {err ? <Text style={{ color: "red", marginTop: 8 }}>{err}</Text> : null}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 12, gap: 8 }}
        renderItem={renderItem}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ textAlign: "center", color: "#777", marginTop: 16 }}>
              ไม่พบข้อมูล
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  row: { flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" },
  btnGhost: {
    paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10,
    borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff",
  },
  input: {
    flexGrow: 1, minWidth: 160, borderWidth: 1, borderColor: "#ddd",
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8,
  },
  btnPrimary: { backgroundColor: "#007bff", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  btnText: { color: "#fff", fontWeight: "700" },
  card: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#eee", backgroundColor: "#fff" },
});
