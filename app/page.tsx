'use client';

import { useState } from 'react';
import Menu from './components/Menu';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Hick's Law Menu Demo</h1>
        <Menu />
      </div>
    </main>
  );
}
