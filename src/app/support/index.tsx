'use client';

import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import {
  callIcon,
  chatIcon,
  emailIcon,
  findFormIcon,
  glossaryIcon,
  questionsIcon,
} from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ContactUsItemTile } from './components/ContactUsItemTile';
import { ResourceMiniCard } from './components/ResourceMiniCard';
import { SupportData } from './model/app/support_data';

export type SupportProps = {
  data: SupportData;
  quantumHealthEnabled: boolean;
  phone: string;
  visibilityRules?: VisibilityRules;
};

let ContactHeader = '';
let CONTACT_ITEMS: any[] = [];

function getQuantumHealthContent(contact: string) {
  ContactHeader = 'Contact Quantum Health';
  CONTACT_ITEMS = [
    {
      icon: <Image src={callIcon} alt="" />,
      label: '',
      body: (
        <>
          <RichText
            spans={[
              <TextBox
                key="first"
                className="body-bold"
                text="Call "
                display={'inline'}
              />,
              <TextBox
                className="body-bold"
                key="second"
                text={contact}
                display={'inline'}
              />,
            ]}
          />
        </>
      ),
      footer: (
        <RichText spans={[<TextBox key="first" text="Anytime, 24/7 " />]} />
      ),
    },
  ];
}

function getGeneralContent(contact: string) {
  ContactHeader = 'Contact Us';
  CONTACT_ITEMS = [
    {
      icon: <Image src={callIcon} alt="" />,
      label: 'Call',
      body: (
        <>
          <TextBox text="8 a.m. - 6 p.m. ET," />
          <TextBox text="Mon - Fri" />
        </>
      ),
      footer: (
        <RichText
          spans={[
            <TextBox key="first" text="Call " display={'inline'} />,
            <TextBox
              className="body-bold"
              key="second"
              text={contact}
              display={'inline'}
            />,
            <TextBox
              className="body-bold"
              key="third"
              text=", TTY 711"
              display={'inline'}
            />,
          ]}
        />
      ),
    },
    {
      icon: <Image src={chatIcon} alt="" />,
      label: 'Chat',
      body: (
        <>
          <TextBox text="8 a.m. - 5:15 p.m. ET," />
          <TextBox text="Mon - Fri" />
        </>
      ),
      footer: <Button callback={() => {}} label="Start a Chat" />,
    },
    {
      icon: <Image src={emailIcon} alt="" />,
      label: 'Email',
      body: (
        <TextBox text="If it's after hours or you'd rather send us an email, we're right here." />
      ),
      footer: (
        <AppLink
          className="!px-0"
          label="Send an Email"
          url="/member/support/email"
        />
      ),
    },
  ];
}
const RESOURCES = [
  {
    icon: <Image src={questionsIcon} alt="" />,
    label: 'Frequently Asked Questions',
    link: '/member/support/FAQ',
    external: false,
  },
  {
    icon: <Image src={glossaryIcon} alt="" />,
    label: 'Health Insurance Glossary',
    link: 'https://www.healthcare.gov/glossary',
    external: true,
  },
  {
    icon: <Image src={findFormIcon} alt="" />,
    label: 'Find a Form',
    link: 'https://www.bcbst.com/use-insurance/documents-forms',
    external: true,
  },
];

const ModalOverlay = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) return null;

  return <div className="fixed modal-overlay inset-0 bg-opacity-50 z-50"></div>;
};

const Support = ({
  data,
  quantumHealthEnabled,
  phone,
  visibilityRules,
}: SupportProps) => {
  const [isNewWindowOpen, setIsNewWindowOpen] = useState(false);
  let qualtricsWindow: WindowProxy | null;
  useEffect(() => {
    const handleWindowClose = () => {
      setIsNewWindowOpen(false);
      qualtricsWindow?.close();
    };

    window.addEventListener('focus', handleWindowClose);

    return () => {
      window.removeEventListener('focus', handleWindowClose);
    };
  }, []);
  const openSurvey = () => {
    const qualtricsUrl = `${process.env.NEXT_PUBLIC_PORTAL_QUALTRICS_URL}/SV_6rHlwsGRs79CO33?Q_CHL=si&grpnbr=${data.memberDetails?.groupId}&qs_digid=${data.memberDetails?.digitalId}`;
    qualtricsWindow = window.open(
      qualtricsUrl,
      '_blank',
      'toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=' +
        window.innerWidth * 0.25 +
        ',width=' +
        window.innerWidth * 0.5 +
        ',height=' +
        window.innerHeight,
    );
    if (qualtricsWindow) {
      qualtricsWindow.focus();
      setIsNewWindowOpen(true);
    }
  };
  {
    quantumHealthEnabled
      ? getQuantumHealthContent(phone)
      : getGeneralContent(phone);
  }
  return (
    <>
      <title>Support</title>
      <div className="flex flex-col justify-center items-center page">
        {/* Page Header */}
        <header className="flex flex-col h-[175px] w-full text-white justify-center items-center brand-gradient">
          <div className="flex flex-col items-start w-full app-content px-4">
            <h1 className="title-1">Support</h1>
            <Spacer size={16} />
            <TextBox text="We're here to help answer your questions" />
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-col w-full justify-center items-center">
          <Column className="app-content app-base-font-color px-4 mt-8 gap-8">
            {/* Contact Us UI */}
            <section className="self-stretch px-8">
              <TextBox type="title-2" text={ContactHeader} />
              <Spacer size={32} />
              <Row className="justify-stretch gap-8 flex-wrap">
                {CONTACT_ITEMS.map((item) => (
                  <ContactUsItemTile
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    body={item.body}
                    footer={item.footer}
                  />
                ))}
              </Row>
            </section>
          </Column>
        </main>
        {/* Resources */}
        <section className="flex flex-col w-full">
          {!quantumHealthEnabled && (
            <div className="self-center relative top-8">
              <Card className="p-4 mx-4 sm:p-8">
                <Column>
                  <TextBox type="title-2" text="Resources" />
                  <Spacer size={16} />
                  <TextBox text="Find answers to your health insurance questions or find a form." />
                  <Spacer size={32} />
                  <Row className="gap-4 flex-wrap">
                    {RESOURCES.map((item) => (
                      <ResourceMiniCard
                        key={item.label}
                        className="basis-auto sm:basis-0 shrink sm:shrink-0 grow"
                        icon={item.icon}
                        label={item.label}
                        link={item.link}
                        external={item.external}
                        vRules={visibilityRules}
                        openInNewWindow={true}
                      />
                    ))}
                  </Row>
                </Column>
              </Card>
            </div>
          )}

          <div className="w-full surface-gradient-flipped">
            <Column className="mt-16 text-white items-center px-4 gap-4">
              <TextBox
                type="title-2"
                className="text-center"
                text="Have feedback about our website?"
              />
              <TextBox
                className="text-center"
                text="We want to hear from you. Share your feedback about your experience using our website."
              />
              <Button
                type="primary"
                className="!bg-transparent outline outline-primary-content my-8 max-w-[256px]"
                label="Share Your Feedback"
                callback={openSurvey}
              />
            </Column>
          </div>
        </section>
      </div>
      <ModalOverlay isOpen={isNewWindowOpen} />
    </>
  );
};

export default Support;
