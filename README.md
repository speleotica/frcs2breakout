# @speleotica/frcs2breakout

[![CircleCI](https://circleci.com/gh/speleotica/frcs2breakout.svg?style=svg)](https://circleci.com/gh/speleotica/frcs2breakout)
[![Coverage Status](https://codecov.io/gh/speleotica/frcs2breakout/branch/master/graph/badge.svg)](https://codecov.io/gh/speleotica/frcs2breakout)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/%40speleotica%2Ffrcs2breakout.svg)](https://badge.fury.io/js/%40speleotica%2Ffrcs2breakout)

Converts data from [FRCS format](https://github.com/speleotica/frcsdata) to [Breakout](https://github.com/jedwards1211/breakout).

# API

```ts
import {
  FrcsPlotFile,
  FrcsSurveyFile,
  FrcsTripSummaryFile,
} from '@speleotica/frcsdata'
import { Length, UnitizedNumber } from '@speleotica/unitized'

type CaveInput = {
  /**
   * Parsed survey file data
   */
  survey: FrcsSurveyFile
  /**
   * Parsed plot file data
   */
  plot?: FrcsPlotFile
  /**
   * Parsed trip summaries file data
   */
  summaries?: FrcsTripSummaryFile
  /**
   * If given, will add survey notes filenames to the output trips
   */
  surveyNotesFilePrefix?: string
  /**
   * The UTM zone of the plot.  If omitted, fixed stations won't be output
   */
  utmZone?: number
  /**
   * Offset to apply to fixed stations from the plot
   */
  zeroReference?: {
    northing: UnitizedNumber<Length>
    easting: UnitizedNumber<Length>
    elevation: UnitizedNumber<Length>
  }
}

export function convertToBreakout(data: Record<string, CaveInput>): MetacaveData
```
