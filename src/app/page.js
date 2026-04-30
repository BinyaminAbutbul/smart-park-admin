'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (window.location.pathname === '/') {
      router.replace('/login');
    }
  }, [router]);

  return null;
}