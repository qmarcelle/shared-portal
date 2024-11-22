import { AppLink } from '../foundation/AppLink';
export interface ContactUsProps {
  label: string;
}
export const ContactUs = ({ label }: ContactUsProps) => {
  return (
    <AppLink
      className="p-0"
      url={process.env.NEXT_PUBLIC_PORTAL_CONTACT_US_URL}
      label={label}
      displayStyle="inline"
    />
  );
};
