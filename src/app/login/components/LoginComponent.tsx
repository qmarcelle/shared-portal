import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextField } from '@/components/foundation/TextField';
import { googleAnalytics } from '@/utils/analytics';

import { TextBox } from '@/components/foundation/TextBox';
import { AnalyticsData } from '@/models/app/analyticsData';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { MIN_CODE_LENGTH } from '../models/app/login_constants';
import { useLoginStore } from '../stores/loginStore';

export type LoginComponentProps = {
  onFormSubmit: (username: string, password: string) => void;
  emailPreFill?: string;
  showError?: boolean;
  errorMessage?: string;
};

export const LoginComponent = ({
  onFormSubmit,
  emailPreFill,
  showError,
  errorMessage,
}: LoginComponentProps) => {
  const {
    username: storeUsername,
    password: storePassword,
    loginProg,
    apiErrors,
    updateUsername,
    updatePassword,
    login,
    resetApiErrors,
  } = useLoginStore((state) => ({
    username: state.username,
    password: state.password,
    loginProg: state.loginProg,
    apiErrors: state.apiErrors,
    updateUsername: state.updateUsername,
    updatePassword: state.updatePassword,
    login: state.login,
    resetApiErrors: state.resetApiErrors,
  }));
  const router = useRouter();
  const showTooltip =
    storeUsername.length < MIN_CODE_LENGTH &&
    storePassword.length < MIN_CODE_LENGTH;
  const [username, setUsername] = useState(emailPreFill ?? '');
  const [password, setPassword] = useState('');
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on username field when component mounts
    if (emailInputRef.current && !username) {
      emailInputRef.current.focus();
    }
  }, [username]);

  const validateEmail = (email: string) => {
    setUsername(email);

    if (!email) {
      setEmailErrors(['Email is required']);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailErrors(['Please enter a valid email address']);
    } else {
      setEmailErrors([]);
    }
  };

  const validatePassword = (pwd: string) => {
    setPassword(pwd);

    if (!pwd) {
      setPasswordErrors(['Password is required']);
    } else {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submitting
    if (!username) {
      setEmailErrors(['Email is required']);
      if (emailInputRef.current) emailInputRef.current.focus();
      return;
    }

    if (!password) {
      setPasswordErrors(['Password is required']);
      if (passwordInputRef.current) passwordInputRef.current.focus();
      return;
    }

    if (emailErrors.length === 0 && passwordErrors.length === 0) {
      onFormSubmit(username, password);
    }
  };

  async function registerNewAccount(): Promise<void> {
    const analytics: AnalyticsData = {
      click_text: 'register a new account',
      click_url: process.env.NEXT_PUBLIC_REGISTER_NEW_ACCOUNT,
      element_category: 'content interaction',
      action: 'click',
      event: 'internal_link_click',
      content_type: undefined,
    };
    googleAnalytics(analytics);
    router.replace(process.env.NEXT_PUBLIC_REGISTER_NEW_ACCOUNT ?? '');
  }
  const loginAnalytics = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const analytics: AnalyticsData = {
      click_text: 'log in',
      click_url: window.location.href,
      element_category: 'login',
      action: undefined,
      event: 'login',
      content_type: undefined,
    };
    googleAnalytics(analytics);
    login();
  };

  const forgotAuthAnalytics = () => {
    const analytics: AnalyticsData = {
      click_text: 'forgot username/password',
      click_url: process.env.NEXT_PUBLIC_PASSWORD_RESET,
      element_category: 'content interaction',
      action: 'click',
      event: 'internal_link_click',
      content_type: undefined,
    };
    googleAnalytics(analytics);
  };

  return (
    <form onSubmit={handleSubmit} role="form" aria-labelledby="login-heading">
      <h2 id="login-heading" className="sr-only">
        Login Form
      </h2>
      <div className="flex flex-col">
        <Spacer size={8} />
        <TextField
          inputRef={emailInputRef}
          label="Email"
          valueCallback={validateEmail}
          value={username}
          type="email"
          required={true}
          ariaLabel="Enter your email address"
          errors={emailErrors}
          inputMode="email"
        />
        <Spacer size={8} />
        <TextField
          inputRef={passwordInputRef}
          label="Password"
          valueCallback={validatePassword}
          value={password}
          type="password"
          required={true}
          ariaLabel="Enter your password"
          errors={passwordErrors}
        />
        <Spacer size={16} />
        {showError && (
          <div className="error-container" role="alert" aria-live="assertive">
            <TextBox text={errorMessage || 'An error occurred'} />
          </div>
        )}
        <Spacer size={8} />
        <Button
          label="Sign In"
          type="submit"
          className="w-full"
          aria-label="Sign in to your account"
          aria-disabled={!username || !password}
        />
      </div>
      <Spacer size={32} />
      <Divider />
      <Spacer size={32} />
      <Button
        type="secondary"
        label="Register a New Account"
        callback={() => registerNewAccount()}
      />
    </form>
  );
};
