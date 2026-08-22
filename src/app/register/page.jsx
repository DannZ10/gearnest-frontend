'use client';

import React, { Suspense } from 'react';
import AuthShell from '@/components/templates/AuthShell';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-bone text-ink/50 text-sm">Memuat…</div>}>
      <AuthShell initialMode="register" />
    </Suspense>
  );
}
