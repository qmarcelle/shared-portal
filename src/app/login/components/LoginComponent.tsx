import { getConfig } from '@/actions/config';
import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextField } from '@/components/foundation/TextField';
import { ToolTip } from '@/components/foundation/Tooltip';
import { AppProg } from '../models/app/app_prog';
import { useLoginStore } from '../stores/loginStore';

export const LoginComponent = () => {
  const username = useLoginStore((state) => state.username);
  const password = useLoginStore((state) => state.password);
  const loginProg = useLoginStore((state) => state.loginProg);
  const apiErrors = useLoginStore((state) => state.apiErrors);
  const actions = useLoginStore((state) => ({
    updateUsername: state.updateUsername,
    updatePassword: state.updatePassword,
    login: state.login,
    resetApiErrors: state.resetApiErrors,
  }));
  const showTooltip = username.length < 1 && password.length < 1;
  async function registerNewAcccount(): Promise<void> {
    window.open(await getConfig('REGISTER_NEW_ACCOUNT'), '_self');
  }
  const loginAnalytics = () => {
    window.dataLayer.push({
      click_text: 'log in',
      click_url: window.location.href,
      element_category: 'login',
      event: 'login',
    });
    actions.login();
  };
  return (
    <div id="mainSection" className="dark:text-black">
      <h1 className="self-start">Member Login</h1>
      <Spacer size={32} />
      <div>
        <TextField
          label="Username"
          valueCallback={(val) => actions.updateUsername(val)}
        />
        <Spacer size={32} />
        <TextField
          type="password"
          label="Password"
          valueCallback={(val) => {
            actions.updatePassword(val);
          }}
          onFocusCallback={() => {
            actions.resetApiErrors();
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
      />
      <Spacer size={32} />
      <Divider />
      <Spacer size={32} />
      <Button
        type="secondary"
        label="Register a New Account"
        callback={() => registerNewAcccount()}
      />
    </div>
  );
};
