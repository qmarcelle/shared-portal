import { logger } from '@/utils/logger';
import callBenefitService from '../../../(common)/myplan/benefits/actions/callBenefitService';
import loadBenefits from '../../../(common)/myplan/benefits/actions/loadBenefits';
import { chrisHallLIUI } from '../_mocks_/chrisHallLIUI';

jest.mock('./callBenefitService');
jest.mock('@/utils/logger');

describe('loadBenefits', () => {
  it('should return benefits data when API call is successful', async () => {
    const mockData = { memberCk: 12345 };
    (callBenefitService as jest.Mock).mockResolvedValue(mockData);

    const result = await loadBenefits(chrisHallLIUI.data.members[0]);

    expect(result).toEqual({ status: 200, data: mockData });
    expect(logger.info).toHaveBeenCalledWith(
      'Loading benefits data for member: 12345',
    );
  });

  it('should return error when API call fails', async () => {
    (callBenefitService as jest.Mock).mockRejectedValue(new Error('API error'));

    const result = await loadBenefits(chrisHallLIUI.data.members[0]);

    expect(result).toEqual({ status: 400, data: { memberCk: 0 } });
    expect(logger.error).toHaveBeenCalled();
  });
});
