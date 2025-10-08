### นาย อนิวัตติ์ ณ หนองคาย 653450106-7 

------------------------------------------------------------
### KKU CIS Social (Expo + React Native + Web)

#### เว็บแอป CIS:

- ล็อกอินด้วย Email/Password + API Key → ได้ Bearer JWT

- ดู รายชื่อสมาชิกตามชั้นปี จาก GET /api/classroom/class/{year}

- โพสต์สถานะ / คอมเมนต์ / กด Like (mock ฝั่ง client)

- รองรับ Responsive (มือถือ/แท็บเล็ต/เดสก์ท็อป) และ expo-router

#### คุณสมบัติหลัก (Features)

- 🔐 Auth: Signin (email + password) พร้อม x-api-key → ใช้ Bearer JWT กับทุก request

- 👥 Members: ค้นหา/แสดงรายชื่อชั้นปี (พ.ศ.) พร้อมข้อมูล studentId, major, school, advisor

- 📝 โซเชียลเล็กๆ: โพสต์/คอมเมนต์/ไลก์ (mock เก็บใน Zustand)

- 🧭 Routing: expo-router (/ และ /members)

- 🧩 State: zustand

- 🌐 Run ได้ทั้ง web / iOS / Android

### Tech Stack

- Expo (TypeScript), React Native, expo-router

- Zustand (state), @expo/vector-icons

### เริ่มต้น (Getting Started)
#### 1) ติดตั้ง
```
npm i 
npm i expo-router react-native-safe-area-context react-native-gesture-handler @react-native-async-storage/async-storage zustand @expo/vector-icons 
```
#### 2) ตั้งค่า app.json
```
{
  "expo": {
    "name": "Final_Hybrid",
    "slug": "Final_Hybrid",
    "plugins": ["expo-router"],
    "extra": {
      "API_BASE_URL": "https://cis.kku.ac.th/api/classroom"
    }
  }
}
```
#### 3) รัน
```
npm run web       
npm run start     
```
### การตั้งค่า API & Auth
#### ล็อกอิน (ต้องใส่ 3 ช่อง)
- Email (อีเมลที่สมัครในระบบ)
- Password
- API Key (แนบใน header ชื่อ x-api-key)

#### โฟลว์การใช้งาน
1. เปิดหน้า Home → กด Login
2. กรอก Email/Password/API Key → Login สำเร็จ
3. ปุ่ม ดูสมาชิกในชั้นปี จะแสดง → เข้าไปกรอก ปี พ.ศ. (เช่น 2565) → ดึงรายชื่อ
4. กลับหน้า Home จะเห็น PostComposer + Feed (mock)
