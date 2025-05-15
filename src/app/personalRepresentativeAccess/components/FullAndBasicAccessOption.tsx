import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { useState } from 'react';

const FullAndBasicAccessOption = ({
  isMaturedMinor,
  accessType,
  memberName,
  isAUAccess,
  selectionCallBack,
  isCheckBoxChecked,
}: {
  isMaturedMinor?: boolean;
  accessType: string;
  memberName?: string;
  loggedInMemberName?: string;
  isAUAccess?: boolean;
  selectionCallBack?: (isChecked?: boolean) => void;
  isCheckBoxChecked?: boolean;
}) => {
  const members = isMaturedMinor ? 'yours' : "the Member's";
  const access = accessType?.charAt(0).toUpperCase() + accessType?.slice(1);
  const notBasic = accessType !== 'basic';
  const [agreementChecked, setAgreementChecked] = useState(true);

  return (
    <main>
      <Column className="items-center teritary-color-1">
        {isMaturedMinor && accessType == 'basic' ? (
          <>
            <Row className="body-1 text-center">
              You're changing access for:
            </Row>
            <Spacer size={16} />
            <TextBox className="body-1 font-bold" text="Mddison Hall " />
            <Spacer size={32} />
            <Divider />
            <Checkbox
              label=""
              body="I Agree. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed sodales, orci vitae ullamcorper dignissim, 
            ligula nulla condimentum lectus, feugiat interdum dui turpis eget nisl. 
            Duis at lectus vitae augue pulvinar dictum eu nec neque. Pellentesque maximus mattis justo id tincidunt.
             Mauris porttitor"
              checked={agreementChecked}
              onChange={(newValue) => setAgreementChecked(newValue)}
            ></Checkbox>
            {/* TO Do:Removed this filed from UI as part of US-46981 */}
            {/* <Spacer size={32} />
            <TextField
              type="text"
              label="Type Your Full Name"
              value="[Mature Minor Name]"
            ></TextField> */}
            <Spacer size={32} />
          </>
        ) : (
          <>
            <Row className="body-1 text-center">
              {isMaturedMinor || isAUAccess ? (
                <RichText
                  spans={[
                    <span key={0} className="body-1  text-center">
                      Granting{' '}
                    </span>,
                    <span key={1} className="font-bold">
                      Full Access{' '}
                    </span>,
                    <span key={2}>to</span>,
                  ]}
                />
              ) : (
                "You're changing access for:"
              )}
            </Row>
            <Spacer size={16} />
            <TextBox className="body-1 font-bold" text={memberName ?? ''} />
            <Spacer size={32} />
            <Divider />
            <Spacer size={32} />
            <span>
              <b>Member Name :</b>{' '}
              {isMaturedMinor ? '[Mature Minor Name]' : 'Chris Hall'}
            </span>
            <Spacer size={32} />
            <Row className="font-bold text-center">
              Authorization Form:{' '}
              {isMaturedMinor ? 'Full Access +' : <>{access} Access</>}
            </Row>

            <Spacer size={16} />
            {isMaturedMinor ? (
              <RichText
                type="body-1"
                spans={[
                  <span key={0}>
                    You are asking BlueCross BlueShield of Tennessee (BlueCross
                    or BCBSTN), and the people and other companies who work with
                    BlueCross, to give your Personal Representative and anyone
                    they choose Full Access to all your health information,
                    including your highly sensitive health information. Full
                    Access means that we can share any information we have about
                    you anywhere in our company with your Personal
                    Representative and anyone they choose. Any part of our
                    company can share your information, including our Member
                    Portal, the BCBSTN mobile application, Member Services and
                    our care coordinators, and we can share it in any way,
                    including through phone, fax, email, and application
                    programming interfaces (APIs). Your Personal Representative
                    may use our interoperability services to share your
                    information with anyone they choose, including third-party
                    applications, health care providers, other health plans, and
                    the people and companies who work with them. By clicking the
                  </span>,
                  <>
                    <span key={1} className="font-bold">
                      {' "I Agree" '}
                    </span>
                    <span key={3}>
                      {
                        'button after reading this, you are electronically signing this authorization form.'
                      }
                    </span>
                  </>,
                ]}
              />
            ) : (
              <RichText
                type="body-1"
                spans={[
                  accessType === 'full' ? (
                    <>
                      <span key={0}>
                        {`You are asking BlueCross BlueShield of Tennessee (BlueCross or BCBSTN), and the people and other companies who work with BlueCross, to give the person you have selected through your Member Portal account or BCBSTN mobile application ${access} Access to the selected Member's health information, including highly sensitive health information. Full Access means that we can share any information we have about the Member anywhere in our company with this person. Any part of our company can share the information (including Member Portal, the BCBSTN mobile application, and Member Services) and we can share it in any way, including through phone, fax, and email. By clicking the`}
                      </span>
                      <span key={1} className="font-bold">
                        {' "I Agree" '}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        {`You are asking BlueCross BlueShield of Tennessee (BlueCross or BCBSTN), and the people and other companies who work with BlueCross, to give the person you have selected through your Member Portal account or BCBSTN mobile application, ${access} Access to the selected Member's health information. Basic Access means that we can share basic health information we have about the Member anywhere in our company with this person. Any part of our company can share the information (including Member Portal, the BCBSTN mobile application, and Member Services) and we can share it in any way, including through phone, fax, and email. By clicking the "I Agree" button after reading this, you are electronically signing this authorization form.`}
                      </span>
                      <span key={1} className="font-bold">
                        {' "I Agree" '}
                      </span>
                    </>
                  ),
                  <span key={3}>
                    {
                      'button after reading this, you are electronically signing this authorization form.'
                    }
                  </span>,
                ]}
              />
            )}
            <Spacer size={16} />
            <TextBox
              className="body-1 font-bold text-center"
              text="What Information is Being Used or Shared"
            />
            <Spacer size={16} />
            <RichText
              type="body-1"
              spans={[
                <span key={0}>
                  {' '}
                  This person will be able to have {access} Access to all the
                  Member's health information. They will have access to private
                  health details about the Member, including personal and
                  contact information, health and medical details, insurance
                  information, and social services the Member uses.
                  {notBasic &&
                    `The information they will have access to may
                  reveal very sensitive health information about the Member,
                  including information about the Member's treatment or care for
                  reproductive health (including family planning, contraception,
                  miscarriage, abortion, maternity and infertility), substance
                  use disorders (including drugs and alcohol), mental or
                  behavioral health disorders, communicable diseases (including
                  HIV/AIDS and sexually transmitted diseases/infections
                  (STDs/STIs)), developmental or intellectual disabilities,
                  genetic disorders (including genetic testing for such
                  disorders and genetic history), abuse (including sexual,
                  physical or mental), brain or other cognitive disorders, or
                  other sensitive information. By clicking`}
                </span>,
                <span key={1} className="font-bold">
                  {notBasic && ' "I Agree" '}
                </span>,
                <span key={2}>
                  {notBasic &&
                    ` you are specifically giving us permission to share this very
                  sensitive health information with the person you have chosen
                  through the Member Portal account or BCBSTN mobile
                  application.`}
                </span>,
              ]}
            />
            <Spacer size={16} />
            <TextBox
              className="body-1 font-bold text-center"
              text="Reasons the Information is Being Used or Shared"
            />
            <Spacer size={16} />
            {isMaturedMinor ? (
              <>
                <TextBox text="We are sharing all of this information at your request, with your approval, and at your direction. The primary purpose of this authorization is to:" />
                <Spacer size={16} />{' '}
                <RichText
                  type="body-1"
                  spans={[
                    <span key={0}>
                      <ul className="list-outside list-disc pl-5">
                        <li className="pb-2 marker:text-blue-500">
                          Give you control over the use and redisclosure of your
                          health information, including highly sensitive health
                          information; and
                        </li>
                        <li className="pb-2 marker:text-blue-500">
                          Give your Personal Representative the ability to use
                          our interoperability services to share your highly
                          sensitive health information with anyone they choose,
                          without needing further authorization from you to do
                          so.
                        </li>
                      </ul>
                    </span>,
                  ]}
                />
                <Spacer size={16} />
                <TextBox text="Other reasons include support for treatment, payment, and health care operations activities, including care coordination among your care team and with family members, friends, and others involved in your care." />
              </>
            ) : (
              <TextBox text="We are sharing all of this information at your request, with your approval, and at your direction. The primary purpose of this authorization is to support the Member's or their Personal Representative's right to access and direct the sharing of the Member's health information. Other reasons include support for treatment, payment, and health care operations activities, including care coordination among the Member's care team and with family members, friends, and others involved in care." />
            )}

            <Spacer size={16} />

            {notBasic && (
              <>
                <TextBox
                  className="body-1 font-bold"
                  text="Special Information about SUD Records"
                />
                <Spacer size={16} />
                {isMaturedMinor ? (
                  <TextBox text="If your health information includes substance use disorder (SUD) records that might be protected by a federal law found at 42 U.S.C. § 290dd-2 and 42 C.F.R. Part 2 (called Part 2), special rules apply. Specifically:" />
                ) : (
                  <TextBox text="If the Member's health information includes substance use disorder (SUD) records that might be protected by a federal law found at 42 U.S.C. § 290dd-2 and 42 C.F.R. Part 2 (called Part 2), special rules apply. Specifically:" />
                )}
                <Spacer size={16} />
                <RichText
                  type="body-1"
                  spans={[
                    <span key={0}>
                      <ul className="list-outside list-disc pl-5">
                        <li className="pb-2 marker:text-blue-500">
                          SUD records disclosed for treatment, payment, and
                          health care operations purposes with anyone regulated
                          by the Health Information Portability and
                          Accountability Act and its implementing regulations
                          (called HIPAA), may be redisclosed by them for any
                          purpose permitted by HIPAA, except that SUD records
                          cannot be used in civil, criminal, administrative, or
                          legislative proceedings against the Member.
                        </li>
                        <li className="pb-2 marker:text-blue-500">
                          Due to current technical and data segmentation
                          infeasibility issues, we cannot separate specially
                          protected SUD records from other information. That
                          means we follow the more stringent Part 2 rules when
                          it comes to our Member Portal and BCBSTN mobile
                          application.
                        </li>
                        <li className="pb-2 marker:text-blue-500">
                          42 CFR Part 2 prohibits unauthorized use or disclosure
                          of these records.
                        </li>
                      </ul>
                    </span>,
                  ]}
                />
                <Spacer size={16} />
              </>
            )}
            <TextBox
              className="body-1 font-bold text-center"
              text="Expiration"
            />

            <Spacer size={16} />
            <TextBox text="This authorization will remain in effect until one of the following events happen:" />
            <RichText
              type="body-1"
              spans={[
                <span key={0}>
                  <ul className="list-outside list-disc pl-5">
                    <li className="pb-2 marker:text-blue-500">
                      <span>
                        You tell us in writing that you want to cancel it.
                      </span>
                    </li>
                    {isMaturedMinor ? (
                      <li className="pb-2 marker:text-blue-500">
                        <TextBox text="When you turn 18 years old." />
                      </li>
                    ) : (
                      <li className="pb-2 marker:text-blue-500">
                        <TextBox text="Either:" />
                        <span>(a) Three years from the date you click</span>
                        <span key={2} className="font-bold">
                          {' "I Agree" '}
                        </span>
                        ,{' '}
                        <span>
                          if the Member is at least 18 years old when you
                          electronically sign this form, or
                        </span>
                        <TextBox text="(b) When the Member turns 18 years old, if the Member is between the age of 13 and 17 years old when you electronically sign this form." />
                      </li>
                    )}
                    {isMaturedMinor}
                    <li className="pb-2 marker:text-blue-500">
                      <span>
                        We may cancel this authorization either in its entirety
                        or with respect to certain persons as explained in the
                        User Agreement for our Member Portal or BCBSTN mobile
                        application, such as if we learn that account
                        credentials have been misused {!isMaturedMinor && '.'}
                        {isMaturedMinor &&
                          'or if a third-party application poses an unacceptable security risk to our systems.'}
                      </span>
                    </li>
                  </ul>
                </span>,
              ]}
            />
            <Spacer size={16} />
            <TextBox
              className="body-1 font-bold text-center"
              text="Acknowledgments & Signature"
            />
            <Spacer size={16} />
            <RichText
              spans={[
                <span key={0} className="body-1 font-bold text-center">
                  Signing this form is voluntary.{' '}
                </span>,
                <span key={1}>
                  BlueCross will not condition treatment, payment, enrollment,
                  or eligibility for benefits on whether you sign this form. By
                  clicking
                </span>,
                <span key={2} className="font-bold">
                  {' "I Agree" '}
                </span>,
                <span key={3}>you are electronically signing this form.</span>,
              ]}
            />
            <Spacer size={16} />
            {isMaturedMinor ? (
              <RichText
                spans={[
                  <span key={0} className="body-1 font-bold text-center">
                    If you don't click "I Agree,"{' '}
                  </span>,
                  <span key={1}>
                    we may not be able to give your Personal Representative Full
                    Access to your Member Portal or the BCBSTN mobile
                    application, and your Personal Representative may not be
                    able to use our related interoperability services. If you
                    don't sign, your Personal Representative will continue to
                    have Basic Access to your health information in accordance
                    with the laws that apply to BlueCross.
                  </span>,
                ]}
              />
            ) : (
              <RichText
                spans={[
                  <span key={0} className="body-1 font-bold text-center">
                    If you don't click "I Agree,"{' '}
                  </span>,
                  <span key={1}>
                    we may not be able to give the person you have selected
                    access to the Member Portal or BCBSTN mobile application for
                    this Member or to the information.
                  </span>,
                ]}
              />
            )}

            <Spacer size={16} />
            <RichText
              spans={[
                <span key={0} className="body-1  text-center">
                  If you click
                </span>,
                <span key={2} className="font-bold">
                  {' "I Agree" '}
                </span>,
                <span key={3} className="body-1  text-center">
                  you are confirming all of the following:
                </span>,
              ]}
            />
            <Spacer size={16} />
            <RichText
              type="body-1"
              spans={[
                <span key={0}>
                  <ul className="list-outside list-disc pl-5">
                    <li className="pb-2 marker:text-blue-500">
                      <span className="font-bold">
                        You understand this form.
                      </span>
                      <span>
                        You have read this form, and you are giving us your
                        permission to use and share the Member's health
                        information as described in this form.
                      </span>
                    </li>
                    <li className="pb-2 marker:text-blue-500">
                      <span className="font-bold">
                        You may cancel at any time.{' '}
                      </span>
                      <span>
                        You may cancel the permission to use and share the
                        Member's information by telling us in writing. Send your
                        written cancellation to BlueCross BlueShield of
                        Tennessee, Inc., 1 Cameron Hill Circle, Chattanooga,
                        Tennessee 37402. We will honor your cancellation, except
                        to the extent we have already acted in reliance on it.
                      </span>
                    </li>
                    <li className="pb-2 marker:text-blue-500">
                      <span className="font-bold">
                        The Member's information may be shared again.{' '}
                      </span>
                      <span>
                        If we share the Member's information (including SUD
                        Records) with a person that is not subject to federal
                        health privacy laws (like HIPAA or Part 2), they may
                        reshare the Member's health information, and it may not
                        be protected by federal privacy laws anymore.
                      </span>
                    </li>
                    <li className="pb-2 marker:text-blue-500">
                      <span className="font-bold">
                        You may have a copy of this form.{' '}
                      </span>
                      <span>
                        You have the right to receive a copy of this form after
                        you sign it. Send us a request in writing at the address
                        above if you did not keep a copy.
                      </span>
                    </li>
                  </ul>
                </span>,
              ]}
            />
            <Spacer size={16} />
            <Divider />
            <Spacer size={16} />
            <Checkbox
              label=""
              body={
                <RichText
                  spans={[
                    <span key={0} className="font-bold">
                      I Agree.
                    </span>,
                    <span key={1}>
                      Clicking "I Agree" means that you have read, understand,
                      and agree to this authorization. You are giving your
                      permission for BlueCross to give{' '}
                      {isMaturedMinor ? (
                        <>
                          your Personal Representative, and anyone they choose{' '}
                          <span className="font-bold">{access} Access</span>
                        </>
                      ) : (
                        <>
                          this person{' '}
                          <span className="font-bold">{access} Access</span>
                        </>
                      )}{' '}
                      to {members} health information{!notBasic ? '.' : ','}{' '}
                      {notBasic
                        ? " including the Member's highly sensitive health information."
                        : ''}
                    </span>,
                  ]}
                />
              }
              checked={isCheckBoxChecked}
              onChange={(isChecked) => selectionCallBack?.(isChecked)}
            ></Checkbox>
            <Spacer size={16} />
            {/* TO Do:Removed this filed from UI as part of US-46981 */}
            {/* <TextField type="text" label="Type Your Full Name"></TextField>
            <Spacer size={32} /> */}
          </>
        )}
      </Column>
    </main>
  );
};

export default FullAndBasicAccessOption;
