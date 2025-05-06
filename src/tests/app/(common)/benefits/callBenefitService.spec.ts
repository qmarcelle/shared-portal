import callBenefitService from '../../../(common)/myplan/benefits/actions/callBenefitService';
import { memberService } from '../../../utils/api/memberService';
import { logger } from '../../../utils/logger';

jest.mock('../../../utils/api/memberService', () => ({
  memberService: {
    get: jest.fn(),
  },
}));
jest.mock('../../../utils/logger');

describe('callBenefitService', () => {
  const mockMemberCk = 12345;
  const mockPlans = [{ productCategory: 'M', planID: 'plan1' }];

  it('should return benefits data when API call is successful', async () => {
    const mockData = { status: 200, data: { benefit: 'data' } };
    (memberService.get as jest.Mock).mockResolvedValue(mockData);

    const result = await callBenefitService(mockMemberCk, mockPlans);

    expect(result).toEqual({
      memberCk: mockMemberCk,
      medicalBenefits: mockData.data,
    });
    expect(logger.info).toHaveBeenCalledWith(
      'Calling benefits at: /api/member/v1/members/byMemberCk/12345/benefits/planDetails/M/plan1?displayMode=6&indicator=W',
    );
  });

  it('should continue on error for a specific plan', async () => {
    (memberService.get as jest.Mock).mockResolvedValueOnce({ status: 400 });

    const result = await callBenefitService(mockMemberCk, mockPlans);

    expect(result).toEqual({ memberCk: mockMemberCk });
    expect(logger.info).toHaveBeenCalledWith(
      'Error fetching benefits data for planType: plan1',
    );
  });

  it('should throw error when API call fails', async () => {
    (memberService.get as jest.Mock).mockRejectedValue(new Error('API error'));

    await expect(callBenefitService(mockMemberCk, mockPlans)).rejects.toThrow(
      'API error',
    );
    expect(logger.error).toHaveBeenCalled();
  });
});
