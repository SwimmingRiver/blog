"use client";
import { useEffect, useState } from "react";
import type { SiteStats } from "@/types/post";

export default function ViewStats() {
  const [stats, setStats] = useState<SiteStats>({
    totalVisitors: 0,
    todayVisitors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/site/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch site stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 text-sm text-gray-500">
        <span>로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <span className="font-semibold">전체 방문자:</span>
        <span>{stats.totalVisitors.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">오늘 방문자:</span>
        <span>{stats.todayVisitors.toLocaleString()}</span>
      </div>
    </div>
  );
}
