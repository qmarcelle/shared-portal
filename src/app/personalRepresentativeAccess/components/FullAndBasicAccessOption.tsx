import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextField } from '@/components/foundation/TextField';

const FullAccessOption = ({ selectedData }: { selectedData: boolean }) => {
  return (
    <main className="">
      {selectedData && (
        <Column className="items-center">
          <Row className="body-1 text-center">
            Grant Basic Access to Chris Hall
          </Row>
          <Spacer size={8} />
          <Divider></Divider>
          <Spacer size={16} />
          <Checkbox
            label=""
            body="I Agree. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed sodales, orci vitae ullamcorper dignissim, 
            ligula nulla condimentum lectus, feugiat interdum dui turpis eget nisl. 
            Duis at lectus vitae augue pulvinar dictum eu nec neque. Pellentesque maximus mattis justo id tincidunt.
             Mauris porttitor"
            selected={true}
          ></Checkbox>
          <Spacer size={32} />
          <TextField
            type="text"
            label="Type Your Full Name"
            value="[Mature Minor Name]"
          ></TextField>
          <Spacer size={32} />
        </Column>
      )}
      {!selectedData && (
        <Column className="items-center">
          <Row className="body-1 text-center">
            Grant Full Access to Chris Hall
          </Row>
          <Spacer size={16} />
          <Divider></Divider>
          <Spacer size={32} />
          <Row className="font-bold">
            HIPAA Authorization for Full Portal Access and Interoperability APIs
          </Row>
          <Spacer size={16} />
          <Row>
            You are asking BlueCross BlueShield of Tennessee to give your
            Personal Representative Full Access to all of your health
            information available in your member portal and through our
            interoperability application programming interfaces (APIs),
            including our Patient Access API and Payer-to-Payer API. This means
            that your Personal Representative will be able to access highly
            sensitive health information about you and to use our APIs to share
            your health information with other third parties through our APIs,
            such as any third-party application of your Personal
            Representative’s choosing or your other health plans.
          </Row>
          <Spacer size={16} />
          <Row>
            By clicking the “I Agree” button after reading this, you authorize
            BlueCross BlueShield of Tennessee to share the following health
            information about you with your Personal Representative and any
            people, companies or other third parties authorized by your Personal
            Representative, if we maintain it:
          </Row>
          <Spacer size={16} />
          <Row>
            <ul>
              <li>
                Demographic and contact information related to you and your
                family;
              </li>
              <li>
                Your claims and encounter data, including cost information; and
              </li>
              <li>
                Certain clinical data, such as allergies and intolerances,
                assessments and plans of treatment, care team members, clinical
                notes, clinical tests, diagnostic imaging, encounter
                information, goals, health insurance information, health status
                assessments, immunizations, laboratory tests and results,
                medications, problems, procedures, provenance, unique device
                identifiers for implantable devices, and vital signs.
              </li>
            </ul>
          </Row>
          <Row>
            The information they will have access to may reveal highly sensitive
            health information about you, including information about your
            treatment or care for reproductive health (e.g., family planning,
            contraception, miscarriage, abortion, maternity, infertility),
            substance use disorders (e.g., drugs and alcohol), mental or
            behavioral health disorders, HIV/AIDS, sexually transmitted diseases
            (STDs), communicable diseases, developmental or intellectual
            disabilities, genetic disorders, (including genetic testing for such
            disorders and genetic history), abuse (e.g., sexual, physical or
            mental), brain or other cognitive disorders, or other sensitive
            information. By clicking on the “I AGREE” button you are
            specifically authorizing the disclosure of this highly sensitive
            health information.
          </Row>
          <Row>
            We are making this disclosure at your request, with your approval
            and at your direction. The intended purposes of the use and
            disclosure of your health information, including your highly
            sensitive health information, are to:
          </Row>
          <Row>
            Give you control over the use and redisclosure of your health
            information, including highly sensitive health information;
          </Row>
          <Row>
            Give your Personal Representative the ability to use our
            interoperability APIs to disclose your highly sensitive health
            information to other people, companies and third parties authorized
            by your Personal Representative without needing further
            authorization from you to do so; and{' '}
          </Row>
          <Row>
            Support treatment, payment and certain health care operations
            activities, including care coordination and case management among
            your care team, including family members, friends and others
            involved in your care.{' '}
          </Row>
          <Row>
            You acknowledge that your Personal Representative and the people,
            companies and other third parties that they authorize to receive
            your health information may not be subject to state or federal
            health information privacy laws, such as the federal Health
            Information Portability and Accountability Act and its implementing
            regulations (collectively, called “HIPAA”), 42 U.S.C. § 290dd-2 and
            its implementing regulations at 42 CFR Part 2 (collectively, called
            “Part 2”) for certain substance use disorder records, or state
            health information confidentiality laws. If your Personal
            Representative or someone that they have authorized to have access
            to your Part 2 substance use disorder records is a HIPAA covered
            entity or business associate (collectively, called a
            “HIPAA-regulated entity”) that is receiving your records to support
            treatment, payment or health care operations activities, the
            HIPAA-regulated entity recipient may redisclose those substance use
            disorder records for any purpose permitted by HIPAA, except for uses
            and disclosures for civil, criminal, administrative, and legislative
            proceedings against you. This authorization for the release of your
            health information is voluntary. This authorization will remain in
            effect until one of the following events happen: It is revoked
            (taken back).{' '}
          </Row>
          <Row>
            XX calendar days after the last time you access your portal account.
            You understand that every time you access your portal account, you
            reaffirm this authorization and the xx-day clock starts again. If
            you do not access your portal account for more than xx-days, you
            will be asked to agree to a new authorization.
          </Row>{' '}
          <Row>
            We reasonably determine that allowing the user you have designated
            as your Personal Representative to link to your account through our
            portal and APIs would present an unacceptable security risk.{' '}
          </Row>
          <Row>
            As otherwise provided for in this authorization or our User
            Agreement, such as if we learn that account credentials have been
            misused.{' '}
          </Row>
          <Row>
            You understand that BlueCross BlueShield of Tennessee will not
            condition the provision of treatment, payment for treatment,
            enrollment in a health plan, or eligibility for benefits on your
            agreement to this authorization. You may take back this
            authorization in writing at any time, except to the extent the
            information has already been disclosed in reliance on this
            authorization. You may take back this authorization by sending a
            request to us the Contact Us page on bcbst.com or by sending us your
            written cancellation to BlueCross BlueShield of Tennessee, Privacy;
            1 Cameron Hill Circle; Building 1, 5th Floor; Chattanooga, Tennessee
            37402. If you decide to take back this authorization, it will not
            affect any disclosure BlueCross BlueShield made in reliance on this
            authorization before the cancellation.{' '}
          </Row>
          <Row>
            {' '}
            Please note that your Personal Representative will not have Full
            Access to your health information or the ability to use our APIs to
            disclose your information to other people, companies or third
            parties if you do not sign this authorization. If you do not sign
            this authorization, your Personal Representative will continue to
            have Basic Access to your health information in accordance with the
            laws that apply to BlueCross BlueShield of Tennessee.{' '}
          </Row>
          <Row>
            Notice To Recipient of Substance Use Disorder Records: 42 CFR Part 2
            prohibits unauthorized use or disclosure of these records.{' '}
          </Row>
          <Spacer size={16} />
          <Divider></Divider>
          <Spacer size={16} />
          <Checkbox
            label=""
            body="I Agree. Clicking “I Agree” means that you have read, understand, and
          agree to this authorization. You are giving your permission for
          BlueCross BlueShield of Tennessee to give your Personal
          Representative, and any person, company or other third party
          authorized by your Personal Representative, access to your health
          information, including your highly sensitive health information. You
          understand that you can contact BlueCross BlueShield of Tennessee for
          a copy of this authorization."
            selected={true}
          ></Checkbox>
          <Spacer size={32} />
          <TextField type="text" label="Type Your Full Name"></TextField>
          <Spacer size={32} />
        </Column>
      )}
    </main>
  );
};

export default FullAccessOption;
