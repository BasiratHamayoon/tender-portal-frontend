"use client";

export default function LineLoader({ loading }) {
  if (!loading) return null;
  return <div className="line-loader" />;
}