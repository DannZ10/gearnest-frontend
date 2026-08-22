'use client';

import React from 'react';
import AdminShell from '@/components/organisms/AdminShell';
import AnalyticsCharts from '@/components/organisms/AnalyticsCharts';
import { SectionHead } from '@/components/admin/ui';

function AdminAnalytics() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHead eyebrow="// 02 — Analitik" title="Analitik Bisnis" />
      <AnalyticsCharts />
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <AdminShell title="Analitik">
      <AdminAnalytics />
    </AdminShell>
  );
}
