import Constants from "expo-constants";

const BASE_URL: string =
  ((Constants?.expoConfig?.extra as any)?.API_BASE_URL as string) ||
  "https://cis.kku.ac.th/api/classroom";

export type Member = {
  id: string;
  fullName: string;          // ← ใช้ fullName แทน name เพื่อชัดเจน
  studentId?: string;
  year?: number;             // พ.ศ.
  email?: string;
  image?: string;
  major?: string;
  schoolName?: string;
  advisorName?: string;
};

/** ---------- SIGNIN: Email/Password + x-api-key → JWT ---------- */
export async function signin(email: string, password: string, apiKey: string) {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey, // จำเป็นต้องแนบ
    },
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("อีเมล/รหัสผ่าน หรือ API Key ไม่ถูกต้อง");
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  const token = json?.token || json?.accessToken || json?.jwt || json?.data?.token;
  if (!token) throw new Error("ไม่พบ token ในผลลัพธ์จาก /signin");

  const name = json?.name || json?.user?.name || json?.profile?.name;
  return { token, name };
}

/** helper: แปลงค.ศ.→พ.ศ. ถ้าตัวเลขดูเป็นค.ศ. */
function toThaiYear(input?: string | number): number | undefined {
  if (input === undefined || input === null) return undefined;
  const y = Number(input);
  if (!Number.isFinite(y)) return undefined;
  // ถ้าเป็นค.ศ. (~1900-2100) → +543
  if (y > 1800 && y < 2600) {
    return y < 2500 ? y + 543 : y; // กันกรณีรับมาเป็นพ.ศ. อยู่แล้ว
  }
  return undefined;
}

/** ---------- GET: ใช้ Bearer + x-api-key ---------- */
export async function getMembersByYearReal(
  yearThaiRequested: number, // พ.ศ. ที่ใส่มาใน URL เช่น 2565
  opts: { apiKey: string; bearer: string }
): Promise<Member[]> {
  const res = await fetch(`${BASE_URL}/class/${yearThaiRequested}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": opts.apiKey,
      Authorization: `Bearer ${opts.bearer}`,
      Accept: "application/json",
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("ไม่ได้รับอนุญาต (ตรวจสอบ Bearer หรือ API Key)");
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  const arr: any[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

  const normalize = (x: any): Member => {
    // ตามสคีมาที่ให้มา
    // {
    //  _id, firstname, lastname, email, image, education: { enrollmentYear, studentId, major, school:{name}, advisor:{name} }
    // }
    const firstname = x.firstname ?? x.firstName ?? "";
    const lastname = x.lastname ?? x.lastName ?? "";
    const fullName = `${firstname} ${lastname}`.trim() || x.name || "Unknown";

    const edu = x.education ?? {};
    const studentId = edu.studentId ?? undefined;

    const yearThaiFromEdu = toThaiYear(edu.enrollmentYear);
    const yearThai = yearThaiFromEdu ?? yearThaiRequested;

    return {
      id: String(x._id ?? x.id ?? studentId ?? `${Date.now()}_${Math.random()}`),
      fullName,
      studentId,
      year: yearThai,
      email: x.email ?? undefined,
      image: x.image ?? undefined,
      major: edu.major ?? undefined,
      schoolName: edu.school?.name ?? undefined,
      advisorName: edu.advisor?.name ?? undefined,
    };
  };

  // (Dev) log sample ไว้ช่วยเช็คฟิลด์
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log("Members raw sample:", arr[0]);
  }

  return arr.map(normalize);
}

/** ---------- MOCK (ใช้ตอนยังไม่ล็อกอินให้ UI เล่นได้) ---------- */
export async function getMembersByYearMock(yearThai: number): Promise<Member[]> {
  await new Promise((r) => setTimeout(r, 300));
  return Array.from({ length: 8 }).map((_, i) => ({
    id: `m${i + 1}`,
    fullName: `Student #${i + 1}`,
    studentId: `65${String(1000 + i)}`,
    year: yearThai,
    email: `student${i + 1}@example.com`,
    image: undefined,
    major: "Computer Science",
    schoolName: "KKU",
    advisorName: "Advisor Name",
  }));
}
