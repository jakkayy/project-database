"use client";

import { useState } from "react";

const sidebarItems = [
  {
    label: "รายละเอียดบัญชี",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    label: "วิธีชำระเงิน",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    label: "ที่อยู่ส่งมอบ",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    active: true,
  },
  {
    label: "รูปแบบการสื่อสารสินค้า",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    label: "การติดต่อสื่อสารที่ใช้",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "การมองเห็นโปรไฟล์",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
      </svg>
    ),
  },
  {
    label: "บัญชีที่ผูกไว้",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
  },
  {
    label: "ความเป็นส่วนตัว",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
];

export default function SettingContent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 px-10 py-6">
        <h1 className="text-2xl font-medium text-black">การตั้งค่า</h1>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200 px-6 py-6">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.label}>
                <button
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm ${
                    item.active
                      ? "font-medium text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-16 py-10">
          <h2 className="text-xl font-medium text-black">
            ที่อยู่ส่งมอบที่บันทึกไว้
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-500">
            คุณไม่มีที่อยู่ส่งมอบที่บันทึกไว้ในบัญชีนี้ แนะนำให้เพิ่มที่อยู่ที่นี่
            แล้วระบบจะป้อนข้อมูลให้ช่วงหน้าใน ขั้นตอนเช็คเอาท์
            เพื่อให้การดำเนินการรวดเร็วยิ่งขึ้น
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-8 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            เพิ่มที่อยู่
          </button>
        </main>
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-xl rounded-lg bg-white p-8">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="mb-6 text-xl font-medium text-black">เพิ่มที่อยู่</h2>

            <form className="space-y-4">
              {/* Row 1: ชื่อ + นามสกุล */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="ชื่อ*"
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="นามสกุล*"
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
                />
              </div>

              {/* Row 2: ที่อยู่ */}
              <input
                type="text"
                placeholder="ที่อยู่*"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
              />

              {/* Row 3: อพาร์ทเมนต์ */}
              <input
                type="text"
                placeholder="อพาร์ทเมนต์, ห้องชุด, อาคาร"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
              />

              {/* Row 4: เมือง + รหัสไปรษณีย์ */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="เมือง*"
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="รหัสไปรษณีย์*"
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
                />
              </div>

              {/* Row 5: จังหวัด + ประเทศ/ภูมิภาค */}
              <div className="grid grid-cols-2 gap-4">
                <select className="rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-500 outline-none focus:border-black">
                  <option value="">จังหวัด*</option>
                  <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                  <option value="เชียงใหม่">เชียงใหม่</option>
                  <option value="ชลบุรี">ชลบุรี</option>
                  <option value="นนทบุรี">นนทบุรี</option>
                  <option value="ปทุมธานี">ปทุมธานี</option>
                  <option value="สมุทรปราการ">สมุทรปราการ</option>
                  <option value="ภูเก็ต">ภูเก็ต</option>
                  <option value="เชียงราย">เชียงราย</option>
                  <option value="ขอนแก่น">ขอนแก่น</option>
                  <option value="นครราชสีมา">นครราชสีมา</option>
                </select>
                <select
                  defaultValue="ไทย"
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
                >
                  <option value="">ประเทศ/ภูมิภาค*</option>
                  <option value="ไทย">ไทย</option>
                </select>
              </div>

              {/* Row 6: หมายเลขโทรศัพท์ */}
              <input
                type="tel"
                placeholder="หมายเลขโทรศัพท์*"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
              />

              {/* Checkbox */}
              <label className="flex items-center gap-2 text-sm text-black">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
                ตั้งเป็นที่อยู่จัดส่งหลัก
              </label>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full bg-black px-8 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
