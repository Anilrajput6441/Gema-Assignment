"use client";

import SubmitButton from "./SubmitButton";

interface UserInfoSectionProps {
  studentName: string;
  testDate: string;
  mobile?: string;
  email?: string;
  profilePhoto?: string;
}

export default function UserInfoSection({
  studentName,
  testDate,
  mobile = "",
  email = "",
  profilePhoto,
}: UserInfoSectionProps) {
  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-start justify-between gap-6">
        {/* Left side: Profile Photo */}
        <div className="w-30 h-30 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden shrink-0">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={studentName}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </div>

        {/* Middle: User Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-4">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider min-w-[80px] pt-1">
              Name
            </span>
            <p className="text-gray-600 text-sm leading-6 flex-1">
              {studentName}
            </p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider min-w-[80px] pt-1">
              Date
            </span>
            <p className="text-gray-600 text-sm leading-6 flex-1">
              {new Date(testDate).toLocaleDateString()}
            </p>
          </div>
          {mobile && (
            <div className="flex items-start gap-4">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider min-w-[80px] pt-1">
                Mobile
              </span>
              <p className="text-gray-600 text-sm leading-6 flex-1">{mobile}</p>
            </div>
          )}
          {email && (
            <div className="flex items-start gap-4">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider min-w-[80px] pt-1">
                Email
              </span>
              <p className="text-gray-600 text-sm leading-6 flex-1">{email}</p>
            </div>
          )}
        </div>

        {/* Right side: Add Info Button */}
        <SubmitButton />
      </div>
    </div>
  );
}
