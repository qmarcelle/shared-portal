import OtherProfileSettingsPage from '@/app/otherProfileSettings/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'ms908977037',
        currUsr: {
          plan: {
            grpId: '125000',
            sbsbCk: '1000113300',
            memCk: '1000113301',
            grgrCk: '38053',
          },
        },
      },
    }),
  ),
}));

const renderUI = async () => {
  const page = await OtherProfileSettingsPage();
  return render(page);
};

describe('Other Profile Settngs - NCQA Survey', () => {
  it('NCQA when selected response is empty', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          ethnicityCodes: [
            {
              ncqaEthnicityCode: '01',
              ncqaEthnicityDesc: 'Hispanic or Latino',
            },
            {
              ncqaEthnicityCode: '02',
              ncqaEthnicityDesc: 'Not Hispanic or Latino',
            },
            {
              ncqaEthnicityCode: 'Z2',
              ncqaEthnicityDesc: 'Decline to answer',
            },
          ],
          raceCodes: [
            {
              ncqaRaceCode: '01',
              ncqaRaceDesc: 'American Indian/Alaska Native',
            },
            {
              ncqaRaceCode: '02',
              ncqaRaceDesc: 'Asian',
            },
            {
              ncqaRaceCode: '03',
              ncqaRaceDesc: 'Black or African American',
            },
            {
              ncqaRaceCode: '04',
              ncqaRaceDesc: 'Native Hawaiian/Other Pacific Islander',
            },
            {
              ncqaRaceCode: '05',
              ncqaRaceDesc: 'White',
            },
            {
              ncqaRaceCode: '06',
              ncqaRaceDesc: 'Some other race',
            },
            {
              ncqaRaceCode: 'Z2',
              ncqaRaceDesc: 'Decline to answer',
            },
          ],
          englishAbilityCodes: [
            {
              ncqaEnglishAbilityCode: '01 ',
              ncqaEnglishAbilityDesc: 'Very Well',
            },
            {
              ncqaEnglishAbilityCode: '02 ',
              ncqaEnglishAbilityDesc: 'Well',
            },
            {
              ncqaEnglishAbilityCode: '03 ',
              ncqaEnglishAbilityDesc: 'Not Well',
            },
            {
              ncqaEnglishAbilityCode: '04 ',
              ncqaEnglishAbilityDesc: 'Not at all',
            },
            {
              ncqaEnglishAbilityCode: 'Z2 ',
              ncqaEnglishAbilityDesc: 'Decline to answer',
            },
          ],
          languageCodes: [
            {
              ncqaLanguageCode: '10 ',
              ncqaLanguageDesc: 'Other language',
            },
            {
              ncqaLanguageCode: 'Z2 ',
              ncqaLanguageDesc: 'Decline to answer',
            },
            {
              ncqaLanguageCode: 'aaa',
              ncqaLanguageDesc: 'Ghotuo',
            },
            {
              ncqaLanguageCode: 'aab',
              ncqaLanguageDesc: 'Alumu-Tesu',
            },
            {
              ncqaLanguageCode: 'aac',
              ncqaLanguageDesc: 'Ari',
            },
            {
              ncqaLanguageCode: 'aad',
              ncqaLanguageDesc: 'Amal',
            },
            {
              ncqaLanguageCode: 'aae',
              ncqaLanguageDesc: 'Arbëreshë Albanian',
            },
            {
              ncqaLanguageCode: 'aaf',
              ncqaLanguageDesc: 'Aranadan',
            },
          ],
        },
      },
      details: {
        componentName: 'memberinfo',
        componentStatus: 'Success',
        returnCode: '0',
        subSystemName: 'FtchPrefCodes',
        message: '',
        problemTypes: '0',
        innerDetails: {
          statusDetails: [
            {
              componentName: 'FtchPrefCodes',
              componentStatus: 'Success',
              returnCode: '0',
              subSystemName: '',
              message: '',
              problemTypes: '0',
              innerDetails: {},
            },
          ],
        },
      },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: { data: {} },
      details: {
        componentName: 'memberinfo',
        componentStatus: 'Success',
        returnCode: '0',
        subSystemName: 'Multiple Services',
        message: '',
        problemTypes: '0',
      },
    });

    const component = await renderUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberInfo/healthEquityPossibleAnswers',
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberInfo/healthEquityPreference?memberKey=1000113301&subscriberKey=1000113300&getMemberPreferenceBy=memberKeySubscriberKey',
      );
    });
    expect(screen.getByText('Other Profile Settings')).toBeVisible();
    expect(
      screen.getByText(
        'Add or update details about yourself, including ethnicity, race and language preferences.',
      ),
    ).toBeVisible();
    expect(screen.getByText('About My Profile')).toBeVisible();
    expect(screen.getByText('Race and Ethnicity')).toBeVisible();
    expect(screen.getByText('What is your ethnicity?')).toBeVisible();
    expect(screen.getByText('Hispanic or Latino')).toBeVisible();
    expect(screen.getByText('Not Hispanic or Latino')).toBeVisible();
    expect(screen.getByText('What is your race?')).toBeVisible();
    expect(screen.getByText('American Indian/Alaska Native')).toBeVisible();
    expect(screen.getByText('Asian')).toBeVisible();
    expect(screen.getByText('Black or African American')).toBeVisible();
    expect(screen.getByText('How well do you speak English?')).toBeVisible();
    expect(screen.getByText('Very Well')).toBeVisible();
    expect(screen.getByText('Not at all')).toBeVisible();
    expect(
      screen.getByText(
        'What language are you most comfortable using when speaking with your doctor?',
      ),
    ).toBeVisible();
    expect(
      screen.getByText('What language do you prefer to read?'),
    ).toBeVisible();
    expect(screen.getAllByText('Save Answer').length).toBe(5);
    expect(component).toMatchSnapshot();
  });

  it('NCQA when selected response is having selected Data', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          ethnicityCodes: [
            {
              ncqaEthnicityCode: '01',
              ncqaEthnicityDesc: 'Hispanic or Latino',
            },
            {
              ncqaEthnicityCode: '02',
              ncqaEthnicityDesc: 'Not Hispanic or Latino',
            },
            {
              ncqaEthnicityCode: 'Z2',
              ncqaEthnicityDesc: 'Decline to answer',
            },
          ],
          raceCodes: [
            {
              ncqaRaceCode: '01',
              ncqaRaceDesc: 'American Indian/Alaska Native',
            },
            {
              ncqaRaceCode: '02',
              ncqaRaceDesc: 'Asian',
            },
            {
              ncqaRaceCode: '03',
              ncqaRaceDesc: 'Black or African American',
            },
            {
              ncqaRaceCode: '04',
              ncqaRaceDesc: 'Native Hawaiian/Other Pacific Islander',
            },
            {
              ncqaRaceCode: '05',
              ncqaRaceDesc: 'White',
            },
            {
              ncqaRaceCode: '06',
              ncqaRaceDesc: 'Some other race',
            },
            {
              ncqaRaceCode: 'Z2',
              ncqaRaceDesc: 'Decline to answer',
            },
          ],
          englishAbilityCodes: [
            {
              ncqaEnglishAbilityCode: '01 ',
              ncqaEnglishAbilityDesc: 'Very Well',
            },
            {
              ncqaEnglishAbilityCode: '02 ',
              ncqaEnglishAbilityDesc: 'Well',
            },
            {
              ncqaEnglishAbilityCode: '03 ',
              ncqaEnglishAbilityDesc: 'Not Well',
            },
            {
              ncqaEnglishAbilityCode: '04 ',
              ncqaEnglishAbilityDesc: 'Not at all',
            },
            {
              ncqaEnglishAbilityCode: 'Z2 ',
              ncqaEnglishAbilityDesc: 'Decline to answer',
            },
          ],
          languageCodes: [
            {
              ncqaLanguageCode: '10 ',
              ncqaLanguageDesc: 'Other language',
            },
            {
              ncqaLanguageCode: 'Z2 ',
              ncqaLanguageDesc: 'Decline to answer',
            },
            {
              ncqaLanguageCode: 'aaa',
              ncqaLanguageDesc: 'Ghotuo',
            },
            {
              ncqaLanguageCode: 'aab',
              ncqaLanguageDesc: 'Alumu-Tesu',
            },
            {
              ncqaLanguageCode: 'aac',
              ncqaLanguageDesc: 'Ari',
            },
            {
              ncqaLanguageCode: 'aad',
              ncqaLanguageDesc: 'Amal',
            },
            {
              ncqaLanguageCode: 'aae',
              ncqaLanguageDesc: 'Arbëreshë Albanian',
            },
            {
              ncqaLanguageCode: 'aaf',
              ncqaLanguageDesc: 'Aranadan',
            },
          ],
        },
      },
      details: {
        componentName: 'memberinfo',
        componentStatus: 'Success',
        returnCode: '0',
        subSystemName: 'FtchPrefCodes',
        message: '',
        problemTypes: '0',
        innerDetails: {
          statusDetails: [
            {
              componentName: 'FtchPrefCodes',
              componentStatus: 'Success',
              returnCode: '0',
              subSystemName: '',
              message: '',
              problemTypes: '0',
              innerDetails: {},
            },
          ],
        },
      },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          ethnicities: [
            {
              memberContrivedKey: 1000113301,
              groupContrivedKey: 38053,
              ncqaEthnicityTransaction: 7203276,
              ncqaEthnicityCode: '02',
              ncqaEthnicityDesc: 'Not Hispanic or Latino',
              ncqaEthnicityUpdateDt: '2025-03-26 05:09:56.377',
              ncqaEthnicityDataSource: '11  ',
              ncqaUserId: 'ms908977037',
              ncqaEthnicitySourceMethod: 'Self',
              ncqaEthnicitySourceDescription:
                'Digital Surveys completed through the BlueAccess member portal ',
              ncqaEthnicitySourceRank: 1,
              LCAS: 'N',
            },
          ],
          races: [
            {
              memberContrivedKey: 1000113301,
              groupContrivedKey: 38053,
              ncqaRaceTransaction: 7203276,
              ncqaRaceCode1: '01',
              ncqaRaceDesc1: 'American Indian/Alaska Native',
              ncqaRaceCode2: '02',
              ncqaRaceDesc2: 'Asian',
              ncqaRaceCode3: '03',
              ncqaRaceDesc3: 'Black or African American',
              ncqaRaceCode4: null,
              ncqaRaceDesc4: null,
              ncqaRaceCode5: null,
              ncqaRaceDesc5: null,
              ncqaRaceCode6: null,
              ncqaRaceDesc6: null,
              ncqaRaceUpdateDt: '2025-03-26 05:09:56.377',
              ncqaRaceDateSource: '11  ',
              ncqaUserId: 'ms908977037',
              ncqaRaceSourceMethod: 'Self',
              ncqaRaceSourceDescription:
                'Digital Surveys completed through the BlueAccess member portal ',
              ncqaRaceSourceRank: 1,
              LCAS: 'N',
            },
          ],
          englishAbilities: [
            {
              memberContrivedKey: 1000113301,
              groupContrivedKey: 38053,
              ncqaEnglishAbilityTransaction: 7203275,
              ncqaEnglishAbilityCode: '04',
              ncqaEnglishAbilityDesc: 'Not at all',
              ncqaEnglishAbilityUpdateDt: '2025-03-26 04:11:51.480',
              ncqaEnglishAbilityDataSource: '11  ',
              ncqaUserId: 'ms908977037',
              GRGR: null,
              ncqaEnglishAbilitySourceMethod: 'Self',
              ncqaEnglishAbilitySourceDescription:
                'Digital Surveys completed through the BlueAccess member portal ',
              ncqaEnglishAbilitySourceRank: 1,
            },
          ],
          spokenLanguages: [
            {
              memberContrivedKey: 1000113301,
              groupContrivedKey: 38053,
              ncqaSpokenLanguageTransaction: 7203276,
              ncqaLanguageCode: 'Z2 ',
              ncqaLanguageDesc: 'Decline to answer',
              ncqaSpokenLanguageUpdateDt: '2025-03-26 05:09:56.377',
              ncqaSpokenLanguageDataSource: '11  ',
              ncqaUserId: 'ms908977037',
              ncqaSpokenLanguageSourceMethod: 'Self',
              ncqaSpokenLanguageSourceDescription:
                'Digital Surveys completed through the BlueAccess member portal ',
              ncqaSpokenLanguageSourceRank: 1,
              LCAS: 'N',
            },
          ],
          writtenLanguages: [
            {
              memberContrivedKey: 1000113301,
              groupContrivedKey: 38053,
              ncqaWrittenLanguageTransaction: 7203276,
              ncqaLanguageCode: 'eng',
              ncqaLanguageDesc: 'English',
              ncqaWrittenLanguageUpdateDt: '2025-03-26 05:09:56.377',
              ncqaWrittenLanguageDataSource: '11  ',
              ncqaUserId: 'ms908977037',
              ncqaWrittenLanguageSourceMethod: 'Self',
              ncqaWrittenLanguageSourceDescription:
                'Digital Surveys completed through the BlueAccess member portal ',
              ncqaWrittenLanguageSourceRank: 1,
              LCAS: 'N',
            },
          ],
        },
      },
      details: {
        componentName: 'memberinfo',
        componentStatus: 'Success',
        returnCode: '0',
        subSystemName: 'Multiple Services',
        message: '',
        problemTypes: '0',
      },
    });

    const component = await renderUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberInfo/healthEquityPossibleAnswers',
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberInfo/healthEquityPreference?memberKey=1000113301&subscriberKey=1000113300&getMemberPreferenceBy=memberKeySubscriberKey',
      );
    });

    expect(screen.getByText('Other Profile Settings')).toBeVisible();
    expect(
      screen.getByText(
        'Add or update details about yourself, including ethnicity, race and language preferences.',
      ),
    ).toBeVisible();
    expect(screen.getByText('About My Profile')).toBeVisible();
    expect(screen.getByText('Race and Ethnicity')).toBeVisible();
    expect(screen.getByText('What is your ethnicity?')).toBeVisible();
    expect(
      screen.getByText('Current Selection: Not Hispanic or Latino'),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Current Selection: American Indian/Alaska Native,Asian,Black or African American',
      ),
    ).toBeVisible();
    expect(screen.getByText('Current Selection: Not at all')).toBeVisible();
    expect(
      screen.getByText('Current Selection: Decline to answer'),
    ).toBeVisible();
    expect(screen.getByText('Current Selection: English')).toBeVisible();
    expect(screen.getAllByText('Update').length).toBe(5);
    const ethinicityUpdateButton = screen.getAllByText('Update')[0];
    fireEvent.click(ethinicityUpdateButton);
    expect(screen.getByText('Hispanic or Latino')).toBeVisible();
    expect(screen.getByText('Not Hispanic or Latino')).toBeVisible();
    const selectedEthinicity = screen.getByLabelText(/Not Hispanic or Latino/i);
    expect(selectedEthinicity).toBeChecked();
    expect(screen.getByText('Save Answer')).toBeVisible();
    expect(screen.getByText('Cancel')).toBeVisible();
    fireEvent.click(screen.getByText('Cancel'));
    expect(
      screen.getByText('Current Selection: Not Hispanic or Latino'),
    ).toBeVisible();
    const raceUpdateButton = screen.getAllByText('Update')[1];
    fireEvent.click(raceUpdateButton);
    expect(screen.getByText('American Indian/Alaska Native')).toBeVisible();
    expect(screen.getByText('Asian')).toBeVisible();
    expect(screen.getByText('Black or African American')).toBeVisible();
    expect(
      screen.getByText('Native Hawaiian/Other Pacific Islander'),
    ).toBeVisible();
    expect(screen.getByText('White')).toBeVisible();
    expect(screen.getByText('Some other race')).toBeVisible();
    const selectedRace2 = screen.getByLabelText(/Asian/i);
    expect(selectedRace2).toBeChecked();
    const selectedRace3 = screen.getByLabelText(/Black or African American/i);
    expect(selectedRace3).toBeChecked();
    expect(screen.getByText('Save Answer')).toBeVisible();
    expect(screen.getByText('Cancel')).toBeVisible();
    fireEvent.click(screen.getByText('Cancel'));
    expect(
      screen.getByText(
        'Current Selection: American Indian/Alaska Native,Asian,Black or African American',
      ),
    ).toBeVisible();
    const englishAbilityUpdateButton = screen.getAllByText('Update')[2];
    fireEvent.click(englishAbilityUpdateButton);

    expect(screen.getByText('Very Well')).toBeVisible();
    expect(screen.getByText('Well')).toBeVisible();
    expect(screen.getByText('Not at all')).toBeVisible();
    expect(screen.getByText('Not Well')).toBeVisible();
    expect(screen.getByText('Save Answer')).toBeVisible();
    expect(screen.getByText('Cancel')).toBeVisible();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText('Current Selection: Not at all')).toBeVisible();
    const spokenLanguageUpdateButton = screen.getAllByText('Update')[3];
    fireEvent.click(spokenLanguageUpdateButton);
    expect(screen.getByText('Enter Language')).toBeVisible();
    expect(screen.getByText('Decline to answer')).toBeVisible();
    const selectedSpokenLanguage = screen.getByLabelText(/Decline to answer/i);
    expect(selectedSpokenLanguage).toBeChecked();
    expect(screen.getByText('Save Answer')).toBeVisible();
    expect(screen.getByText('Cancel')).toBeVisible();
    fireEvent.click(screen.getByText('Cancel'));
    expect(
      screen.getByText('Current Selection: Decline to answer'),
    ).toBeVisible();
    const readLanguageUpdateButton = screen.getAllByText('Update')[4];
    fireEvent.click(readLanguageUpdateButton);
    expect(screen.getByText('Enter Language')).toBeVisible();
    expect(screen.getByText('Decline to answer')).toBeVisible();
    const selectedReadLanguage = screen.getByLabelText(/Enter Language/i);
    expect(selectedReadLanguage).toBeChecked();
    expect(screen.getByText('Save Answer')).toBeVisible();
    expect(screen.getByText('Cancel')).toBeVisible();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText('Current Selection: English')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
