/* eslint-env node */

import { describe, it } from 'mocha'
import { expect } from 'chai'
import {
  parseFrcsPlotFile,
  parseFrcsSurveyFile,
  parseFrcsTripSummaryFile,
} from '@speleotica/frcsdata/node'
import { convertToBreakout } from '.'
import { Unitize } from '@speleotica/unitized'

describe('convertToBreakout', function () {
  it('basic test', async function () {
    const survey = await parseFrcsSurveyFile(require.resolve('./cdata.fr'))
    const plot = await parseFrcsPlotFile(require.resolve('./FOR008.fr'))
    const summaries = await parseFrcsTripSummaryFile(
      require.resolve('./STAT_sum.txt')
    )
    const breakout = convertToBreakout({
      'Fisher Ridge Cave System': {
        survey,
        plot,
        summaries,
        surveyNotesFilePrefix: 'FRCS',
        utmZone: 14,
        zeroReference: {
          northing: Unitize.meters(10),
          easting: Unitize.meters(20),
          elevation: Unitize.meters(30),
        },
      },
    })
    expect(breakout).to.deep.equal({
      caves: {
        'Fisher Ridge Cave System': {
          fixedStations: [
            {
              datum: 'WGS84',
              distUnit: 'm',
              ellipsoid: 'WGS84',
              stations: {
                AE18: {
                  east: '21.993',
                  elev: '20.819',
                  north: '11.222',
                },
                AE19: {
                  east: '21.981',
                  elev: '28.324',
                  north: '11.177',
                },
                AE20: {
                  east: '20.000',
                  elev: '30.000',
                  north: '10.000',
                },
              },
              utmZone: 14,
            },
          ],
          trips: [
            {
              name: `1 ENTRANCE DROPS, JOE'S "I LOVE MY WIFE TRAVERSE", TRICKY TRAVERSE`,
              surveyors: { 'Peter Quick': {}, 'Keith Ortiz': {} },
              distUnit: 'ft',
              angleUnit: 'deg',
              azmFsUnit: 'deg',
              azmBsUnit: 'deg',
              incFsUnit: 'deg',
              incBsUnit: 'deg',
              azmBacksightsCorrected: true,
              incBacksightsCorrected: false,
              survey: [
                {
                  station: 'AE20',
                  lrud: ['1.00', '3.00', '0.00', '2.00'],
                  splays: [{ dir: 'fs', dist: '0.00' }],
                },
                {},
                { station: 'AE20' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '9.30',
                      azm: '60.00',
                      inc: '-36.00',
                    },
                    { dir: 'bs', azm: '60.00' },
                  ],
                },
                {
                  station: 'AE19',
                  lrud: ['2.00', '12.00', '0.00', '20.00'],
                },
                {},
                { station: 'AE19' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '24.50',
                      azm: '0.00',
                      inc: '-90.00',
                    },
                    { dir: 'bs', azm: '0.00' },
                  ],
                },
                {
                  station: 'AE18',
                  lrud: ['6.00', '10.00', '25.00', '0.00'],
                },
                {},
                { station: 'AE18' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '8.00',
                      azm: '350.50',
                      inc: '17.00',
                    },
                    { dir: 'bs', azm: '350.50' },
                  ],
                },
                {
                  station: 'AE17',
                  lrud: ['3.00', '5.00', '0.00', '0.00'],
                },
                {},
                { station: 'AE17' },
                {
                  measurements: [
                    { dir: 'fs', dist: '6.70', azm: '0.00', inc: '-90.00' },
                    { dir: 'bs', azm: '0.00' },
                  ],
                },
                {
                  station: 'AE16',
                  lrud: ['3.00', '5.00', '6.00', '1.00'],
                },
                {},
                { station: 'AE16' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '12.60',
                      azm: '70.50',
                      inc: '-18.00',
                    },
                    { dir: 'bs', azm: '71.00' },
                  ],
                },
                {
                  station: 'AE15',
                  lrud: ['4.00', '0.00', '2.00', '1.00'],
                },
                {},
                { station: 'AE15' },
                {
                  measurements: [
                    { dir: 'fs', dist: '10.00', azm: '21.50', inc: '6.00' },
                    { dir: 'bs', azm: '20.00' },
                  ],
                },
                {
                  station: 'AE14',
                  lrud: ['5.00', '5.00', '0.00', '3.00'],
                },
                {},
                { station: 'AE14' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '26.80',
                      azm: '288.00',
                      inc: '-50.00',
                    },
                    { dir: 'bs', azm: '286.00' },
                  ],
                },
                {
                  station: 'AE13',
                  lrud: ['0.00', '7.00', '20.00', '5.00'],
                },
                {},
                { station: 'AE13' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '20.70',
                      azm: '236.00',
                      inc: '34.00',
                    },
                    { dir: 'bs', azm: '236.00' },
                  ],
                },
                {
                  station: 'AE12',
                  lrud: ['3.00', '5.00', '4.00', '4.00'],
                },
                {},
                { station: 'AE12' },
                {
                  measurements: [{ dir: 'fs', dist: '26.80', inc: '-90.00' }],
                },
                { station: 'AE11', lrud: ['0', '7.00', '20.00', '5.00'] },
              ],
              date: '1981-02-15T06:00:00.000Z',
              surveyNotesFile: 'FRCS_1_2-15-1981.pdf',
            },
            {
              name: '2 TRICKY TRAVERSE AND THEN FIRST SURVEY IN UPPER CROWLWAY',
              surveyors: {
                'Dan Crowl': {},
                'Keith Ortiz': {},
                'Chip Hopper': {},
                'Peter Quick': {},
                'Larry Bean': {},
              },
              distUnit: 'ft',
              angleUnit: 'deg',
              azmFsUnit: 'deg',
              azmBsUnit: 'deg',
              incFsUnit: 'deg',
              incBsUnit: 'deg',
              azmBacksightsCorrected: false,
              incBacksightsCorrected: false,
              survey: [
                {
                  station: 'A1',
                  lrud: ['24.00', '84.00', '36.00', '54.00'],
                },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '586.00',
                      azm: '292.00',
                      inc: '-42.00',
                    },
                    { dir: 'bs', azm: '110.00' },
                  ],
                },
                {
                  station: 'A2',
                  lrud: ['60.00', '120.00', '420.00', '60.00'],
                },
                {},
                { station: 'A2' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '149.00',
                      azm: '333.50',
                      inc: '35.00',
                    },
                    { dir: 'bs', azm: '153.50' },
                  ],
                },
                {
                  station: 'A3',
                  lrud: ['36.00', '12.00', '180.00', '60.00'],
                },
                {},
                { station: 'A3' },
                {
                  measurements: [
                    { dir: 'fs', dist: '50.00', azm: '0.00', inc: '90.00' },
                    { dir: 'bs', azm: '0.00' },
                  ],
                },
                {
                  station: 'A4',
                  lrud: ['36.00', '12.00', '120.00', '120.00'],
                },
              ],
              date: '1981-02-14T06:00:00.000Z',
              surveyNotesFile: 'FRCS_2_2-14-1981.pdf',
            },
            {
              name: '3 CONNECT UPPER HILTON TO FISHER AVE AND SURVEY IN PRESSURE PASSAGE.',
              surveyors: {
                'Joe W. Saunders': {},
                'Nancy Colter': {},
                'Tom Johengen': {},
                'Charles Santerre': {},
                'Linda Jagger': {},
              },
              distUnit: 'ft',
              angleUnit: 'deg',
              azmFsUnit: 'deg',
              azmBsUnit: 'deg',
              incFsUnit: 'deg',
              incBsUnit: 'deg',
              azmBacksightsCorrected: false,
              incBacksightsCorrected: false,
              survey: [
                { station: 'J6' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '50.00',
                      azm: '124.00',
                      inc: '11.00',
                    },
                    { dir: 'bs', azm: '303.50', inc: '-11.00' },
                  ],
                },
                {
                  station: 'ML$1',
                  lrud: ['12.00', '12.00', '35.00', '15.00'],
                },
                {},
                { station: 'ML$1' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '32.00',
                      azm: '157.00',
                      inc: '53.00',
                    },
                    { dir: 'bs', azm: '337.00', inc: '-53.00' },
                  ],
                },
                {
                  station: 'ML$2',
                  lrud: ['30.00', '2.00', '16.00', '5.00'],
                },
                {},
                { station: 'ML$2' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '25.10',
                      azm: '142.50',
                      inc: '-5.00',
                    },
                    { dir: 'bs', azm: '324.00', inc: '5.00' },
                  ],
                },
                {
                  station: 'ML$3',
                  lrud: ['0.00', '4.00', '5.00', '7.00'],
                },
                {},
                { station: 'ML$3' },
                {
                  measurements: [
                    { dir: 'fs', dist: '6.00', inc: '-90.00' },
                    { dir: 'bs', inc: '90.00' },
                  ],
                },
                {
                  station: 'ML$4',
                  lrud: ['0.00', '4.00', '11.00', '1.00'],
                },
              ],
              date: '1982-05-16T05:00:00.000Z',
              surveyNotesFile: 'FRCS_3_5-16-1982.pdf',
            },
            {
              name: '4 Hunky-Dory Mopup:  Q19-PD7 loop (Quap Passage), Q1 Side Lead, Others.',
              surveyors: { 'Peter Quick': {}, 'Chip Hopper': {} },
              distUnit: 'ft',
              angleUnit: 'deg',
              azmFsUnit: 'deg',
              azmBsUnit: 'deg',
              incFsUnit: 'deg',
              incBsUnit: 'deg',
              azmBacksightsCorrected: true,
              incBacksightsCorrected: true,
              survey: [
                { station: 'Q19' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '25.00',
                      azm: '49.50',
                      inc: '-12.00',
                    },
                    { dir: 'bs', azm: '49.50', inc: '-11.00' },
                  ],
                },
                {
                  station: 'QAP1',
                  lrud: ['3.00', '3.00', '1.00', '7.00'],
                },
                {},
                { station: 'QAP1' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '27.20',
                      azm: '100.50',
                      inc: '2.50',
                    },
                    { dir: 'bs', azm: '100.00', inc: '2.50' },
                  ],
                },
                {
                  station: 'QAP2',
                  lrud: ['2.00', '3.00', '0.00', '10.00'],
                },
                {},
                { station: 'QAP2' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '14.80',
                      azm: '39.50',
                      inc: '-11.00',
                    },
                    { dir: 'bs', azm: '39.50', inc: '-10.50' },
                  ],
                },
                {
                  station: 'QAP3',
                  lrud: ['1.00', '4.00', '1.00', '12.00'],
                },
                {},
                { station: 'QAP3' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '21.10',
                      azm: '355.00',
                      inc: '2.00',
                    },
                    { dir: 'bs', azm: '354.00', inc: '2.50' },
                  ],
                },
                {
                  station: 'QAP4',
                  lrud: ['4.00', '4.00', '2.00', '12.00'],
                },
                {},
                { station: 'QAP4' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '43.60',
                      azm: '343.00',
                      inc: '-5.00',
                    },
                    { dir: 'bs', azm: '341.50', inc: '-4.50' },
                  ],
                },
                {
                  station: 'QAP5',
                  lrud: ['2.00', '7.00', '5.00', '12.00'],
                },
                {},
                { station: 'QAP5' },
                {
                  measurements: [
                    { dir: 'fs', dist: '23.00', azm: '39.50', inc: '9.00' },
                    { dir: 'bs', azm: '39.00', inc: '9.50' },
                  ],
                },
                {
                  station: 'QAP6',
                  lrud: ['3.00', '4.00', '0.00', '15.00'],
                },
                {},
                { station: 'QAP6' },
                {
                  measurements: [
                    { dir: 'fs', dist: '35.10', azm: '11.50', inc: '0.50' },
                    { dir: 'bs', azm: '11.00', inc: '1.00' },
                  ],
                },
                {
                  station: 'QAP7',
                  lrud: ['3.00', '6.00', '1.00', '25.00'],
                },
                {},
                { station: 'QAP7' },
                {
                  measurements: [
                    { dir: 'fs', dist: '5.80', inc: '-90.00' },
                    { dir: 'bs', inc: '-90.00' },
                  ],
                },
                {
                  station: 'QAP8',
                  lrud: ['2.00', '4.00', '6.00', '20.00'],
                },
              ],
              date: '1983-03-05T06:00:00.000Z',
              surveyNotesFile: 'FRCS_4_3-5-1983.pdf',
            },
            {
              name: "5 DOUG'S DEMISE (50 FT DROP), CHRIS CROSS, CRAWL ABOVE DROP",
              surveyors: {
                'Peter Quick': {},
                'Chris Gerace': {},
                'Phil Oden': {},
                'Chip Hopper': {},
              },
              distUnit: 'ft',
              angleUnit: 'deg',
              azmFsUnit: 'deg',
              azmBsUnit: 'deg',
              incFsUnit: 'deg',
              incBsUnit: 'deg',
              azmBacksightsCorrected: true,
              incBacksightsCorrected: false,
              survey: [
                { station: 'B29' },
                {
                  measurements: [
                    {
                      dir: 'fs',
                      dist: '29.50',
                      azm: '320.00',
                      inc: '0.97',
                    },
                    { dir: 'bs', azm: '321.00' },
                  ],
                },
                {
                  station: 'B30',
                  lrud: ['2.00', '3.00', '4.00', '2.00'],
                },
                {},
                { station: 'B30' },
                {
                  measurements: [
                    { dir: 'fs', dist: '13.70', azm: '0.00', inc: '40.00' },
                    { dir: 'bs', azm: '0.00' },
                  ],
                },
                {
                  station: 'B31',
                  lrud: ['2.00', '4.00', '6.00', '9.00'],
                },
                {},
                { station: 'B30' },
                {
                  measurements: [
                    { dir: 'fs', dist: '13.70', azm: '0.00', inc: '40.00' },
                    { dir: 'bs', azm: '0.00' },
                  ],
                  excludeDist: true,
                },
                { station: 'B30sp', lrud: ['2.00', '4.00', '6.00', '0'] },
              ],
              date: '1981-03-06T06:00:00.000Z',
              surveyNotesFile: 'FRCS_5_3-6-1981.pdf',
            },
          ],
        },
      },
    })
  })
})
