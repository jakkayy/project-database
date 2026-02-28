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
  }
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
