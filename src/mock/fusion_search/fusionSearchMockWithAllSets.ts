export const fusionSearchMockWithAllSet = {
  fusion: {
    qtime: ['8'],
    params: [
      '{hl=true, added_to_rs=({!term f=id v=$rules_item_ExF1XwfrAx_0})^=1000000.0 OR ({!term f=id v=$rules_item_ExF1XwfrAx_1})^=999999.0, uf=_query_ *, origDefType=edismax, orig_q=hea*, rules_item_aLACMgrXib_9=https://www.bcbst.com/about/our-company/corporate-governance/legal/3rd-party-payments-of-member-premiums, rules_item_aLACMgrXib_8=https://www.bcbst-medicare.com/notices-and-disclaimers, terms=true, qf=[value_t^4.0, value_s^5.0, value_phonetic_en, value_edge^3.0, value_en^2.0], rules_item_aLACMgrXib_7=https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/privacy-policy, terms.fl=value_t, rules_item_aLACMgrXib_6=https://www.bcbst.com/about/our-company/corporate-governance/privacy-security, rules_item_aLACMgrXib_5=https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/browser-security, context=app:MAIN, hl.fl=value_t, shards.preference=replica.type:PULL, group.field=cleantitle_lc_s, group=true, sapphire=true, _stateVer_=MAIN_TYPEAHEAD:798, group.limit=1, f.type.facet.mincount=1, f.ta_type.facet.limit=100, sort=score desc, qpParams=member, version=2.2, block_list_eXlRd3a4Jr=https://www.sharedhealthms.com/health-incentive.pdf, fusionQueryId=QDEDSWugbO, entityOnly=true, sapphire.limit=4, block_list_StrJC5ghZS=https://www.sharedhealthms.com/sync-your-app/,https://www.sharedhealthms.com/developer-resources/,https://www.sharedhealthms.com/health-app-privacy-rights/, fl=[title, type, ta_type, document_url, image_url, popularity_d, signal_count, indexed_date, id, score], rules_ordered_q=({!term f=id v=$rules_item_aLACMgrXib_0})^=0.019 OR ({!term f=id v=$rules_item_aLACMgrXib_1})^=0.018000000000000002 OR ({!term f=id v=$rules_item_aLACMgrXib_2})^=0.017 OR ({!term f=id v=$rules_item_aLACMgrXib_3})^=0.016 OR ({!term f=id v=$rules_item_aLACMgrXib_4})^=0.015 OR ({!term f=id v=$rules_item_aLACMgrXib_5})^=0.014 OR ({!term f=id v=$rules_item_aLACMgrXib_6})^=0.013000000000000001 OR ({!term f=id v=$rules_item_aLACMgrXib_7})^=0.012 OR ({!term f=id v=$rules_item_aLACMgrXib_8})^=0.011 OR ({!term f=id v=$rules_item_aLACMgrXib_9})^=0.01 OR ({!term f=id v=$rules_item_aLACMgrXib_10})^=0.009000000000000001 OR ({!term f=id v=$rules_item_aLACMgrXib_11})^=0.008 OR ({!term f=id v=$rules_item_aLACMgrXib_12})^=0.007 OR ({!term f=id v=$rules_item_aLACMgrXib_13})^=0.006 OR ({!term f=id v=$rules_item_aLACMgrXib_14})^=0.005 OR ({!term f=id v=$rules_item_aLACMgrXib_15})^=0.004 OR ({!term f=id v=$rules_item_aLACMgrXib_16})^=0.003 OR ({!term f=id v=$rules_item_aLACMgrXib_17})^=0.002 OR ({!term f=id v=$rules_item_aLACMgrXib_18})^=0.001 OR ({!term f=id v=$rules_item_ExF1XwfrAx_0})^=1000000.0 OR ({!term f=id v=$rules_item_ExF1XwfrAx_1})^=999999.0, fq=[ta_type:entity, B_APP_ID_s:(MEMBER), *:* -({!terms v=$block_list_eXlRd3a4Jr f=id}), *:* -({!terms v=$block_list_StrJC5ghZS f=id}), ({!edismax v=$orig_q}) OR ({!lucene v=$added_to_rs})], bq=[timestamp_tdt:[NOW/DAY-1MONTH TO NOW/DAY]^16.0, timestamp_tdt:[NOW/DAY-3MONTH TO NOW/DAY]^8.0, timestamp_tdt:[NOW/DAY-12MONTH TO NOW/DAY]^4.0, timestamp_tdt:[NOW/DAY-24MONTH TO NOW/DAY]^2.0, timestamp_tdt:[NOW/DAY-36MONTH TO NOW/DAY]^1.4], rules_item_aLACMgrXib_10=https://www.bcbst.com/about/our-company/corporate-governance/legal/nondiscrimination-notice, rules_item_aLACMgrXib_11=https://www.bcbst.com/about/our-company/corporate-governance/legal/linking-to-bcbst, defType=lucene, rules_item_aLACMgrXib_12=https://www.bcbst.com/about/our-company/corporate-governance/legal/copyright-information, rules_item_aLACMgrXib_13=https://www.bcbst.com/about/our-company/corporate-governance/legal, sapphire.radius=25, f.type.facet.limit=100, rules_item_aLACMgrXib_18=https://www.bcbst.com/blueaccess-error/, f.type.facet.missing=false, rules_item_aLACMgrXib_14=https://www.bcbst.com/about/our-company/corporate-governance/code-of-conduct, rules_item_ExF1XwfrAx_1=https://www.bcbst.com/our-plans/, wt=json, rules_item_aLACMgrXib_15=https://www.bcbst.com/about/our-company/corporate-governance/, bcbsReqID=e3cf6b33-f368-4600-8962-009c3fbc974c, rules_item_aLACMgrXib_16=https://www.bcbst.com/shcontact/, ORIGPARAM=member, terms.lower=hea*, rules_item_aLACMgrXib_17=https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/, rules_item_ExF1XwfrAx_0=https://test1.bcbst.com/get-care/personalized-care/pregnancy-support, facet.field=[ta_type, type], lw.pipelineId=MAIN_TYPEAHEAD_QPL, terms.lower.incl=false, start=0, rules_item_aLACMgrXib_4=https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/email-policy, isFusionQuery=true, f.ta_type.facet.missing=false, rules_item_aLACMgrXib_3=https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/sms-terms-conditions, rules_item_aLACMgrXib_2=https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/personal-data, sapphire.network_id=39, rules_item_aLACMgrXib_1=https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/site-usage, rows=10, rules_item_aLACMgrXib_0=https://www.bcbst.com/video/, queryProfileID=MAIN_TYPEAHEAD_entity_QPF, q=({!lucene v=$rules_ordered_q}) OR (-({!lucene v=$rules_ordered_q}) {!edismax v=$orig_q}), terms.prefix=hea*, group.format=simple, f.ta_type.facet.mincount=1, facet=true}',
    ],
    sapphire: {
      providers: {
        '0': {
          id: 1000037167,
          provider_id: 'f1000037167',
          name: 'Accurate Healthcare Inc',
          type: 'F',
          specialty: 'Durable Medical Equipment & Medical Supplies',
          primary_field_specialty:
            'Durable Medical Equipment & Medical Supplies',
          url: '/profile/f1000037167/27002595527/%7B%22name%22:%22Accurate%20Healthcare%20Inc%22,%22client_canonical_id%22:null%7D?network_id=39&geo_location=36.1816,-86.7306&locale=en_us&ci=DFT',
        },
        '1': {
          id: 1000048623,
          provider_id: 'f1000048623',
          name: 'Mental Health Cooperative Inc',
          type: 'F',
          specialty: 'Adult Mental Health Clinic/Center',
          primary_field_specialty: 'Adult Mental Health Clinic/Center',
          url: '/profile/f1000048623/27000337527/%7B%22name%22:%22Mental%20Health%20Cooperative%20Inc%22,%22client_canonical_id%22:null%7D?network_id=39&geo_location=36.1816,-86.7306&locale=en_us&ci=DFT',
        },
        '2': {
          id: 1000048863,
          provider_id: 'f1000048863',
          name: 'Mental Health Cooperative Inc',
          type: 'F',
          specialty: 'Psychiatric Hospital',
          primary_field_specialty: 'Psychiatric Hospital',
          url: '/profile/f1000048863/27000304027/%7B%22name%22:%22Mental%20Health%20Cooperative%20Inc%22,%22client_canonical_id%22:null%7D?network_id=39&geo_location=36.1816,-86.7306&locale=en_us&ci=DFT',
        },
        '3': {
          id: 1000060250,
          provider_id: 'f1000060250',
          name: 'Tennessee Mental Health Consumers Association',
          type: 'F',
          specialty:
            'Mental Health Clinic/Center (Including Community Mental Health Center)',
          primary_field_specialty:
            'Mental Health Clinic/Center (Including Community Mental Health Center)',
          url: '/profile/f1000060250/27000365427/%7B%22name%22:%22Tennessee%20Mental%20Health%20Consumers%20Association%22,%22client_canonical_id%22:null%7D?network_id=39&geo_location=36.1816,-86.7306&locale=en_us&ci=DFT',
        },
      },
      specialties: {
        '0': {
          id: 270005100,
          name: 'Hearing Aid Dispensers',
          url: '/search/search_specialties/270005100/1/%7B"limit":10,"radius":"25","sort":"has_sntx%20desc,%20distance%20asc","sort_translation":"app_global_sort_distance"%7D?network_id=39&geo_location=36.1816,-86.7306&locale=en_us&ci=DFT',
        },
        '1': {
          id: 270005099,
          name: 'Health Department',
          url: '/search/search_specialties/270005099/1/%7B"limit":10,"radius":"25","sort":"has_sntx%20desc,%20distance%20asc","sort_translation":"app_global_sort_distance"%7D?network_id=39&geo_location=36.1816,-86.7306&locale=en_us&ci=DFT',
        },
        '2': {
          id: 270005023,
          name: 'Behavioral Health Facility',
          url: '/search/search_specialties/270005023/1/%7B"limit":10,"radius":"25","sort":"has_sntx%20desc,%20distance%20asc","sort_translation":"app_global_sort_distance"%7D?network_id=39&geo_location=36.1816,-86.7306&locale=en_us&ci=DFT',
        },
        '3': {
          id: 270005105,
          name: 'Home Health Agency',
          url: '/search/search_specialties/270005105/1/%7B"limit":10,"radius":"25","sort":"has_sntx%20desc,%20distance%20asc","sort_translation":"app_global_sort_distance"%7D?network_id=39&geo_location=36.1816,-86.7306&locale=en_us&ci=DFT',
        },
      },
      searchUrl:
        '/search/name/hea*/1/%7B"limit":10,"radius":"50","sort":"has_sntx%20desc,%20relevancy%20desc,%20random"%7D?network_id=39&geo_location=36.1816,-86.7306&locale=en_us&ci=DFT',
    },
  },
  grouped: {
    cleantitle_lc_s: {
      doclist: {
        numFound: 6,
        start: 0,
        maxScore: 4,
        numFoundExact: true,
        docs: [
          {
            ta_type: 'entity',
            type: 'MEMBER',
            id: 'https://members.bcbst.com/wps/myportal/member/home/managingyourhealth/healthmanagementtoolkit/',
            title: 'BlueCross BlueShield of Tennessee - Health Library',
            score: 4,
          },
          {
            ta_type: 'entity',
            type: 'MEMBER',
            id: 'https://members.bcbst.com/wps/myportal/member/home/managingyourhealth/healthymaternity/',
            title: 'BlueCross BlueShield of Tennessee - Healthy Maternity',
            score: 4,
          },
          {
            ta_type: 'entity',
            type: 'MEMBER',
            id: 'https://members.bcbst.com/wps/myportal/member/home/managingyourhealth/',
            title: 'BlueCross BlueShield of Tennessee - Managing Your Health',
            score: 4,
          },
          {
            ta_type: 'entity',
            type: 'MEMBER',
            id: 'https://members.bcbst.com/wps/myportal/member/home/benefitscoverage/enrollhealthplan/',
            title:
              'BlueCross BlueShield of Tennessee - Enroll in a Health Plan',
            score: 4,
          },
          {
            ta_type: 'entity',
            type: 'MEMBER',
            id: 'https://members.bcbst.com/wps/myportal/member/home/findcare/comparehealthplans/',
            title: 'BlueCross BlueShield of Tennessee - Compare Health Plans',
            score: 4,
          },
          {
            ta_type: 'entity',
            type: 'MEMBER',
            id: 'https://members.bcbst.com/wps/myportal/member/home/findcare/healthcarecostestimator/',
            title:
              'BlueCross BlueShield of Tennessee - HealthCare Cost Estimator',
            score: 4,
          },
        ],
      },
      matches: 6,
    },
  },
  terms: {
    value_t: [],
  },
  responseHeader: {
    zkConnected: true,
    QTime: 8,
    totalTime: 940,
    params: {
      hl: 'true',
      added_to_rs:
        '({!term f=id v=$rules_item_ExF1XwfrAx_0})^=1000000.0 OR ({!term f=id v=$rules_item_ExF1XwfrAx_1})^=999999.0',
      uf: '_query_ *',
      origDefType: 'edismax',
      orig_q: 'hea*',
      rules_item_aLACMgrXib_9:
        'https://www.bcbst.com/about/our-company/corporate-governance/legal/3rd-party-payments-of-member-premiums',
      rules_item_aLACMgrXib_8:
        'https://www.bcbst-medicare.com/notices-and-disclaimers',
      terms: 'true',
      qf: [
        'value_t^4.0',
        'value_s^5.0',
        'value_phonetic_en',
        'value_edge^3.0',
        'value_en^2.0',
      ],
      rules_item_aLACMgrXib_7:
        'https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/privacy-policy',
      'terms.fl': 'value_t',
      rules_item_aLACMgrXib_6:
        'https://www.bcbst.com/about/our-company/corporate-governance/privacy-security',
      rules_item_aLACMgrXib_5:
        'https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/browser-security',
      context: 'app:MAIN',
      'hl.fl': 'value_t',
      'shards.preference': 'replica.type:PULL',
      'group.field': 'cleantitle_lc_s',
      group: 'true',
      sapphire: 'true',
      _stateVer_: 'MAIN_TYPEAHEAD:798',
      'group.limit': '1',
      'f.type.facet.mincount': '1',
      'f.ta_type.facet.limit': '100',
      sort: 'score desc',
      qpParams: 'member',
      version: '2.2',
      block_list_eXlRd3a4Jr:
        'https://www.sharedhealthms.com/health-incentive.pdf',
      fusionQueryId: 'QDEDSWugbO',
      entityOnly: 'true',
      'sapphire.limit': '4',
      block_list_StrJC5ghZS:
        'https://www.sharedhealthms.com/sync-your-app/,https://www.sharedhealthms.com/developer-resources/,https://www.sharedhealthms.com/health-app-privacy-rights/',
      fl: [
        'title',
        'type',
        'ta_type',
        'document_url',
        'image_url',
        'popularity_d',
        'signal_count',
        'indexed_date',
        'id',
        'score',
      ],
      rules_ordered_q:
        '({!term f=id v=$rules_item_aLACMgrXib_0})^=0.019 OR ({!term f=id v=$rules_item_aLACMgrXib_1})^=0.018000000000000002 OR ({!term f=id v=$rules_item_aLACMgrXib_2})^=0.017 OR ({!term f=id v=$rules_item_aLACMgrXib_3})^=0.016 OR ({!term f=id v=$rules_item_aLACMgrXib_4})^=0.015 OR ({!term f=id v=$rules_item_aLACMgrXib_5})^=0.014 OR ({!term f=id v=$rules_item_aLACMgrXib_6})^=0.013000000000000001 OR ({!term f=id v=$rules_item_aLACMgrXib_7})^=0.012 OR ({!term f=id v=$rules_item_aLACMgrXib_8})^=0.011 OR ({!term f=id v=$rules_item_aLACMgrXib_9})^=0.01 OR ({!term f=id v=$rules_item_aLACMgrXib_10})^=0.009000000000000001 OR ({!term f=id v=$rules_item_aLACMgrXib_11})^=0.008 OR ({!term f=id v=$rules_item_aLACMgrXib_12})^=0.007 OR ({!term f=id v=$rules_item_aLACMgrXib_13})^=0.006 OR ({!term f=id v=$rules_item_aLACMgrXib_14})^=0.005 OR ({!term f=id v=$rules_item_aLACMgrXib_15})^=0.004 OR ({!term f=id v=$rules_item_aLACMgrXib_16})^=0.003 OR ({!term f=id v=$rules_item_aLACMgrXib_17})^=0.002 OR ({!term f=id v=$rules_item_aLACMgrXib_18})^=0.001 OR ({!term f=id v=$rules_item_ExF1XwfrAx_0})^=1000000.0 OR ({!term f=id v=$rules_item_ExF1XwfrAx_1})^=999999.0',
      fq: [
        'ta_type:entity',
        'B_APP_ID_s:(MEMBER)',
        '*:* -({!terms v=$block_list_eXlRd3a4Jr f=id})',
        '*:* -({!terms v=$block_list_StrJC5ghZS f=id})',
        '({!edismax v=$orig_q}) OR ({!lucene v=$added_to_rs})',
      ],
      bq: [
        'timestamp_tdt:[NOW/DAY-1MONTH TO NOW/DAY]^16.0',
        'timestamp_tdt:[NOW/DAY-3MONTH TO NOW/DAY]^8.0',
        'timestamp_tdt:[NOW/DAY-12MONTH TO NOW/DAY]^4.0',
        'timestamp_tdt:[NOW/DAY-24MONTH TO NOW/DAY]^2.0',
        'timestamp_tdt:[NOW/DAY-36MONTH TO NOW/DAY]^1.4',
      ],
      rules_item_aLACMgrXib_10:
        'https://www.bcbst.com/about/our-company/corporate-governance/legal/nondiscrimination-notice',
      rules_item_aLACMgrXib_11:
        'https://www.bcbst.com/about/our-company/corporate-governance/legal/linking-to-bcbst',
      defType: 'lucene',
      rules_item_aLACMgrXib_12:
        'https://www.bcbst.com/about/our-company/corporate-governance/legal/copyright-information',
      rules_item_aLACMgrXib_13:
        'https://www.bcbst.com/about/our-company/corporate-governance/legal',
      'sapphire.radius': '25',
      'f.type.facet.limit': '100',
      rules_item_aLACMgrXib_18: 'https://www.bcbst.com/blueaccess-error/',
      'f.type.facet.missing': 'false',
      rules_item_aLACMgrXib_14:
        'https://www.bcbst.com/about/our-company/corporate-governance/code-of-conduct',
      rules_item_ExF1XwfrAx_1: 'https://www.bcbst.com/our-plans/',
      wt: 'json',
      rules_item_aLACMgrXib_15:
        'https://www.bcbst.com/about/our-company/corporate-governance/',
      bcbsReqID: 'e3cf6b33-f368-4600-8962-009c3fbc974c',
      rules_item_aLACMgrXib_16: 'https://www.bcbst.com/shcontact/',
      ORIGPARAM: 'member',
      'terms.lower': 'hea*',
      rules_item_aLACMgrXib_17:
        'https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/',
      rules_item_ExF1XwfrAx_0:
        'https://test1.bcbst.com/get-care/personalized-care/pregnancy-support',
      'facet.field': ['ta_type', 'type'],
      'lw.pipelineId': 'MAIN_TYPEAHEAD_QPL',
      'terms.lower.incl': 'false',
      start: '0',
      rules_item_aLACMgrXib_4:
        'https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/email-policy',
      isFusionQuery: 'true',
      'f.ta_type.facet.missing': 'false',
      rules_item_aLACMgrXib_3:
        'https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/sms-terms-conditions',
      rules_item_aLACMgrXib_2:
        'https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/personal-data',
      'sapphire.network_id': '39',
      rules_item_aLACMgrXib_1:
        'https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/site-usage',
      rows: '10',
      rules_item_aLACMgrXib_0: 'https://www.bcbst.com/video/',
      queryProfileID: 'MAIN_TYPEAHEAD_entity_QPF',
      q: '({!lucene v=$rules_ordered_q}) OR (-({!lucene v=$rules_ordered_q}) {!edismax v=$orig_q})',
      'terms.prefix': 'hea*',
      'group.format': 'simple',
      'f.ta_type.facet.mincount': '1',
      facet: 'true',
    },
    status: 0,
  },
  highlighting: {
    'https://members.bcbst.com/wps/myportal/member/home/managingyourhealth/healthmanagementtoolkit/':
      {
        value_t: [
          'BlueCross BlueShield of Tennessee - <em>Health</em> Library',
        ],
      },
    'https://members.bcbst.com/wps/myportal/member/home/managingyourhealth/healthymaternity/':
      {
        value_t: [
          'BlueCross BlueShield of Tennessee - <em>Healthy</em> Maternity',
        ],
      },
    'https://members.bcbst.com/wps/myportal/member/home/managingyourhealth/': {
      value_t: [
        'BlueCross BlueShield of Tennessee - Managing Your <em>Health</em>',
      ],
    },
    'https://members.bcbst.com/wps/myportal/member/home/benefitscoverage/enrollhealthplan/':
      {
        value_t: [
          'BlueCross BlueShield of Tennessee - Enroll in a <em>Health</em> Plan',
        ],
      },
    'https://members.bcbst.com/wps/myportal/member/home/findcare/comparehealthplans/':
      {
        value_t: [
          'BlueCross BlueShield of Tennessee - Compare <em>Health</em> Plans',
        ],
      },
    'https://members.bcbst.com/wps/myportal/member/home/findcare/healthcarecostestimator/':
      {
        value_t: [
          'BlueCross BlueShield of Tennessee - <em>HealthCare</em> Cost Estimator',
        ],
      },
  },
  facet_counts: {
    facet_queries: {},
    facet_fields: {
      ta_type: ['entity', 6],
      type: ['MEMBER', 6],
    },
    facet_ranges: {},
    facet_intervals: {},
    facet_heatmaps: {},
  },
};
