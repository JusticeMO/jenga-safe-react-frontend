import React from "react";

interface LoginHeaderProps {
  message: string;
}

export function LoginHeader({ message }: LoginHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
      <p className="text-gray-600 mt-2">{message}</p>
    </div>
  );
}
