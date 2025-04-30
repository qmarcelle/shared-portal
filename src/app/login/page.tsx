import { Metadata } from 'next';
import { LoginPageClient } from './components/LoginPageClient';

export const metadata: Metadata = {
  title: 'Login - Health Portal',
  description: 'Sign in to access your health portal',
};

// Server Component
export default async function LoginPage() {
  return <LoginPageClient />;
}
