'use client';

import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-surface">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
