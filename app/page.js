// app/page.js
'use client'; // This is a Client Component

import { useRouter } from 'next/navigation';
import Table from './components/product/table';

export default function Home() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the JWT token from cookies
    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    // Redirect to the login page
    router.push('/login');
  };

  return (
    <div>
      <Table/>
    </div>
  );
}