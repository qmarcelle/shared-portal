import {
  shouldHideHeaderFooter,
  isGroupRoute,
  getGroupFromPath,
  commonRoutes,
  groupRoutes,
} from '../routes';

describe('Route Utilities', () => {
  describe('shouldHideHeaderFooter', () => {
    it('should hide header/footer for specified routes', () => {
      expect(shouldHideHeaderFooter('/login')).toBe(true);
      expect(shouldHideHeaderFooter('/error')).toBe(true);
      expect(shouldHideHeaderFooter('/maintenance')).toBe(true);
      expect(shouldHideHeaderFooter('/embed/something')).toBe(true);
    });

    it('should show header/footer for other routes', () => {
      expect(shouldHideHeaderFooter('/myplan')).toBe(false);
      expect(shouldHideHeaderFooter('/benefits')).toBe(false);
      expect(shouldHideHeaderFooter('/dashboard')).toBe(false);
    });
  });

  describe('isGroupRoute', () => {
    it('should identify group-specific routes', () => {
      expect(isGroupRoute('/dashboard')).toBe(true);
      expect(isGroupRoute('/findcare')).toBe(true);
      expect(isGroupRoute('/myhealth')).toBe(true);
      expect(isGroupRoute('/support')).toBe(true);
    });

    it('should identify non-group routes', () => {
      expect(isGroupRoute('/myplan')).toBe(false);
      expect(isGroupRoute('/benefits')).toBe(false);
      expect(isGroupRoute('/profile')).toBe(false);
    });
  });

  describe('getGroupFromPath', () => {
    it('should extract group from path', () => {
      expect(getGroupFromPath('/bluecare/dashboard')).toBe('bluecare');
      expect(getGroupFromPath('/amplify/support')).toBe('amplify');
    });

    it('should return "member" as default group', () => {
      expect(getGroupFromPath('/')).toBe('member');
      expect(getGroupFromPath('')).toBe('member');
    });
  });

  describe('route configurations', () => {
    it('should define common routes', () => {
      expect(commonRoutes).toEqual({
        myPlan: '/myplan',
        benefits: '/benefits',
        profile: '/profile',
        sharing: '/sharing',
      });
    });

    it('should define group routes', () => {
      expect(groupRoutes).toEqual({
        dashboard: '/dashboard',
        findCare: '/findcare',
        myHealth: '/myhealth',
        support: '/support',
      });
    });
  });
});