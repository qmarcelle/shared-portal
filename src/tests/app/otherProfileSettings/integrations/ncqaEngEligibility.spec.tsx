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

jest
  .useFakeTimers({
    doNotFake: ['nextTick', 'setImmediate'],
  })
  .setSystemTime(new Date('2024-02-01T00:00:00'));

describe('Other Profile Settngs - NCQA Survey', () => {
  it('NCQA Survey - Update English Eligibility Response', async () => {
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
              ncqaEnglishAbilityCode: '01',
              ncqaEnglishAbilityDesc: 'Very Well',
            },
            {
              ncqaEnglishAbilityCode: '02',
              ncqaEnglishAbilityDesc: 'Well',
            },
            {
              ncqaEnglishAbilityCode: '03',
              ncqaEnglishAbilityDesc: 'Not Well',
            },
            {
              ncqaEnglishAbilityCode: '04',
              ncqaEnglishAbilityDesc: 'Not at all',
            },
            {
              ncqaEnglishAbilityCode: 'Z2',
              ncqaEnglishAbilityDesc: 'Decline to answer',
            },
          ],
          languageCodes: [
            {
              ncqaLanguageCode: '10',
              ncqaLanguageDesc: 'Other language',
            },
            {
              ncqaLanguageCode: 'Z2',
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

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        status: 'Success',
        message: 'preferences has been successfully updated',
      },
      details: {
        componentName: 'memberinfo',
        componentStatus: 'Success',
        returnCode: '0',
        subSystemName: 'memberinfo',
        message: '',
        problemTypes: '0',
        innerDetails: {
          statusDetails: [
            {
              componentName: 'memberinfo',
              componentStatus: 'Success',
              returnCode: '0',
              subSystemName: 'InsrtMemPref',
              message: '',
              problemTypes: '0',
              innerDetails: {
                statusDetails: [
                  {
                    componentName: 'InsrtMemPref',
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
          ],
        },
      },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
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
    expect(screen.getByText('How well do you speak English?')).toBeVisible();
    expect(screen.getByText('Very Well')).toBeVisible();
    expect(screen.getByText('Well')).toBeVisible();
    expect(screen.getByText('Not at all')).toBeVisible();
    expect(screen.getByText('Not Well')).toBeVisible();
    const newSelectedEngEligibility = screen.getByLabelText(/Not at all/i);
    fireEvent.click(newSelectedEngEligibility);
    expect(newSelectedEngEligibility).toBeChecked();
    fireEvent.click(screen.getAllByText('Save Answer')[2]);
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'memberInfo/healthEquityPreference',
        {
          engAbilityCode: '04',
          memberContrivedKey: '1000113301',
          subscriberContrivedKey: '1000113300',
          groupContrivedKey: '38053',
          userId: 'ms908977037',
          memberPreferenceBy: 'memberKeySubscriberKey',
          dataSource: '11',
          lastUpdateDate: '2024-02-01 00:00:00',
          srcLoadDate: '2024-02-01 00:00:00',
        },
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberInfo/healthEquityPreference?memberKey=1000113301&subscriberKey=1000113300&getMemberPreferenceBy=memberKeySubscriberKey',
      );
    });
    expect(screen.getByText('Current Selection: Not at all')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
