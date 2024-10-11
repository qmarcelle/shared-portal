import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextField } from '@/components/foundation/TextField';
import { ToolTip } from '@/components/foundation/Tooltip';
import { googleAnalytics } from '@/utils/analytics';
import { AppProg } from '../models/app/app_prog';

import { AnalyticsData } from '@/models/app/analyticsData';
import { useRouter } from 'next/navigation';
import { MIN_CODE_LENGTH } from '../models/app/login_constants';
import { useLoginStore } from '../stores/loginStore';

export const LoginComponent = () => {
  const {
    username,
    password,
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
    username.length < MIN_CODE_LENGTH && password.length < MIN_CODE_LENGTH;
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
  const loginAnalytics = () => {
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
    <div id="mainSection" className="dark:text-black">
      <h1 className="self-start">Member Login</h1>
      <Spacer size={32} />
      <div>
        <TextField
          label="Username"
          valueCallback={(val) => updateUsername(val)}
        />
        <Spacer size={32} />
        <TextField
          type="password"
          label="Password"
          valueCallback={(val) => {
            updatePassword(val);
          }}
          onFocusCallback={() => {
            resetApiErrors();
          }}
          highlightError={false}
          errors={apiErrors}
          isSuffixNeeded={true}
        />

        <Spacer size={32} />
        <ToolTip
          showTooltip={showTooltip}
          className="flex flex-row justify-center items-center tooltip"
          label="Enter a username and password."
        >
          <Button
            callback={
              username.length > 0 && password.length > 0
                ? loginAnalytics
                : undefined
            }
            label={loginProg == AppProg.loading ? 'Logging In...' : 'Log In'}
          />
        </ToolTip>
      </div>
      <Spacer size={16} />
      <AppLink
        label="Forgot Username/Password?"
        className="m-auto"
        url={process.env.NEXT_PUBLIC_PASSWORD_RESET}
        callback={forgotAuthAnalytics}
      />
      <Spacer size={32} />
      <Divider />
      <Spacer size={32} />
      <Button
        type="secondary"
        label="Register a New Account"
        callback={() => registerNewAccount()}
      />
    </div>
  );
};
