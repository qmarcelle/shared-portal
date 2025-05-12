import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard, which is likely the main page after login
  redirect('/dashboard');
}
