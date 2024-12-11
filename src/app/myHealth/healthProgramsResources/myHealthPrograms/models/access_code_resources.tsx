import { AccessCodeType } from './access_code_details';

export const AccessCodeResourcesDetails: Map<
  AccessCodeType,
  Map<string, Array<string>>
> = new Map([
  [
    AccessCodeType.BtnBlueWell,
    new Map([
      [
        'conditions',
        [
          'Asthma',
          'Coronary Artery Disease',
          'COPD',
          'Diabetes',
          'Congestive Heart Failure',
        ],
      ],
    ]),
  ],
  [
    AccessCodeType.BtnBlueChat,
    new Map([
      [
        'withoutConditions',
        [
          'Asthma',
          'Coronary Artery Disease',
          'COPD',
          'Diabetes',
          'Congestive Heart Failure',
        ],
      ],
      ['conditions', ['Depression']],
    ]),
  ],
  [AccessCodeType.BtnBlueHere, new Map([['conditions', ['None']]])],
  [
    AccessCodeType.AmpBlueWell,
    new Map([
      [
        'conditions',
        [
          'Asthma',
          'Coronary Artery Disease',
          'COPD',
          'Diabetes',
          'Congestive Heart Failure',
        ],
      ],
    ]),
  ],
  [
    AccessCodeType.AmpBlueChat,
    new Map([
      [
        'withoutConditions',
        [
          'Asthma',
          'Coronary Artery Disease',
          'COPD',
          'Diabetes',
          'Congestive Heart Failure',
        ],
      ],
      ['conditions', ['Depression']],
    ]),
  ],
  [AccessCodeType.AmpBlueHere, new Map([['conditions', ['None']]])],
]);
