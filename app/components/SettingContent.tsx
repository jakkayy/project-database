"use client";

import { useState } from "react";

const sidebarItems = [
  {
    label: "Account Details",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    label: "Payment Methods",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    label: "Delivery Addresses",
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
        <h1 className="text-2xl font-medium text-black">Settings</h1>
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
            Saved Delivery Addresses
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-500">
            You have no saved delivery addresses on this account. We recommend adding an address here
            so it will be pre-filled during checkout to speed up the process.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-8 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Add Address
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

            <h2 className="mb-6 text-xl font-medium text-black">Add Address</h2>

            <form className="space-y-4">
              {/* Row 1: First Name + Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name*"
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Last Name*"
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
                />
              </div>

              {/* Row 2: Address */}
              <input
                type="text"
                placeholder="Address*"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
              />

              {/* Row 3: Apartment */}
              <input
                type="text"
                placeholder="Apartment, suite, building"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
              />

              {/* Row 4: City + Postal Code */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City*"
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Postal Code*"
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
                />
              </div>

              {/* Row 5: Province + Country */}
              <div className="grid grid-cols-2 gap-4">
                <select className="rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-500 outline-none focus:border-black">
                  <option value="">Province*</option>
                  <option value="Bangkok">Bangkok</option>
                  <option value="Chiang Mai">Chiang Mai</option>
                  <option value="Chonburi">Chonburi</option>
                  <option value="Nonthaburi">Nonthaburi</option>
                  <option value="Pathum Thani">Pathum Thani</option>
                  <option value="Samut Prakan">Samut Prakan</option>
                  <option value="Phuket">Phuket</option>
                  <option value="Chiang Rai">Chiang Rai</option>
                  <option value="Khon Kaen">Khon Kaen</option>
                  <option value="Nakhon Ratchasima">Nakhon Ratchasima</option>
                </select>
                <select
                  defaultValue="Thailand"
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
                >
                  <option value="">Country/Region*</option>
                  <option value="Thailand">Thailand</option>
                </select>
              </div>

              {/* Row 6: Phone */}
              <input
                type="tel"
                placeholder="Phone Number*"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black"
              />


              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full bg-black px-8 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
