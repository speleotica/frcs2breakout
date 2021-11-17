import {
  FrcsPlotFile,
  FrcsSurveyFile,
  FrcsTrip,
  FrcsTripHeader,
  FrcsTripSummary,
  FrcsTripSummaryFile,
} from '@speleotica/frcsdata'
import {
  Angle,
  Length,
  Unit,
  Unitize,
  UnitizedNumber,
} from '@speleotica/unitized'

export type DistanceUnit = 'in' | 'ft' | 'yd' | 'm' | 'km' | 'mi'
export type AngleUnit = 'deg' | 'min' | 'sec' | 'grad' | 'mil'
export type InclinationUnit = AngleUnit | '%'

export type Measurement<Unit> =
  | string
  | [number, Unit]
  | [number, Unit, number, Unit]
  | [number, Unit, number, Unit, number, Unit]

export type Distance = Measurement<DistanceUnit>
export type Azimuth = Measurement<AngleUnit>
export type Inclination = Measurement<InclinationUnit>
export type Latitude = Measurement<AngleUnit>
export type Longitude = Measurement<AngleUnit>

export type Surveyor = {
  roles?: string | string[]
}

export type Surveyors = Record<string, Surveyor>

export type Direction = 'fs' | 'bs'

export type SplayShot = {
  dir?: Direction
  dist?: Distance
  azm?: Azimuth
  inc?: Inclination
  splayDepth?: Distance
}

export type Station = {
  station: string
  cave?: string
  isEntrance?: boolean
  isAboveGround?: boolean
  depth?: Distance
  lrud?: Array<Distance | null | undefined>
  lrudAzm?: Azimuth
  nsew?: Array<Distance | null | undefined>
  splays?: Array<SplayShot>
}

export type ShotMeasurement = {
  dir?: Direction
  dist?: Distance
  azm?: Azimuth
  inc?: Inclination
}

export type Shot = {
  excludeDist?: boolean
  dist?: 'auto'
  measurements?: ShotMeasurement[]
}

export type Survey = Array<Station | Shot>

export type Trip = {
  name?: string
  date?: string
  surveyors?: Surveyors
  distUnit: DistanceUnit
  angleUnit: AngleUnit
  azmBacksightsCorrected: boolean
  incBacksightsCorrected: boolean
  declination?: Azimuth
  azmFsUnit?: AngleUnit
  azmBsUnit?: AngleUnit
  incFsUnit?: InclinationUnit
  incBsUnit?: InclinationUnit
  distCorrection?: Distance
  azmFsCorrection?: Azimuth
  azmBsCorrection?: Azimuth
  incFsCorrection?: Inclination
  incBsCorrection?: Inclination
  survey?: Survey
  surveyNotesFile?: string
}

export type FixedStation = {
  lat?: Latitude
  long?: Longitude
  elev?: Distance
  north?: Distance
  east?: Distance
}

export type FixedStations = {
  distUnit: DistanceUnit
  ellipsoid: 'WGS84'
  datum: 'WGS84'
  utmZone?: number
  stations?: Record<string, FixedStation>
}

export type Cave = {
  fixedStations?: FixedStations[]
  trips?: Trip[]
}

export type Caves = Record<string, Cave>

export type MetacaveData = {
  caves: Caves
}

const distUnits: Map<Unit<Length>, DistanceUnit> = new Map([
  [Length.feet, 'ft'],
  [Length.meters, 'm'],
])

const angleUnits: Map<Unit<Angle>, AngleUnit> = new Map([
  [Angle.degrees, 'deg'],
  [Angle.gradians, 'grad'],
  [Angle.milsNATO, 'mil'],
])
type CaveInput = {
  survey: FrcsSurveyFile
  plot?: FrcsPlotFile
  summaries?: FrcsTripSummaryFile
  surveyNotesFilePrefix?: string
  utmZone?: number
  zeroReference?: {
    northing: UnitizedNumber<Length>
    easting: UnitizedNumber<Length>
    elevation: UnitizedNumber<Length>
  }
}

export function convertToBreakout(
  data: Record<string, CaveInput>
): MetacaveData {
  const caves: Caves = {}

  for (const cave in data) {
    caves[cave] = convertCave(data[cave])
  }

  return { caves }
}

function convertCave({
  survey,
  plot,
  summaries,
  surveyNotesFilePrefix,
  utmZone,
  zeroReference = {
    northing: Unitize.meters(0),
    easting: Unitize.meters(0),
    elevation: Unitize.meters(0),
  },
}: CaveInput): Cave {
  const trips: Trip[] = []

  for (let tripIndex = 0; tripIndex <= survey.trips.length; tripIndex++) {
    if (!survey.trips[tripIndex]) continue
    trips[tripIndex] = convertTrip({
      tripNumber: tripIndex + 1,
      trip: survey.trips[tripIndex],
      summary: summaries?.tripSummaries?.[tripIndex],
      surveyNotesFilePrefix,
    })
  }

  const cave: Cave = { trips }

  if (plot && utmZone != null) {
    cave.fixedStations = convertPlot({ plot, utmZone, zeroReference })
  }

  return cave
}

function convertTrip({
  tripNumber,
  trip,
  summary,
  surveyNotesFilePrefix,
}: {
  tripNumber: number
  trip: FrcsTrip
  summary?: FrcsTripSummary
  surveyNotesFilePrefix?: string
}): Trip {
  const result = convertTripHeader({
    tripNumber,
    header: trip.header,
    summary,
  })

  result.survey = convertSurvey(trip)

  const date = summary?.date || trip.header.date
  if (tripNumber != null && date && surveyNotesFilePrefix) {
    result.surveyNotesFile = `${surveyNotesFilePrefix}_${tripNumber}_${
      date.getMonth() + 1
    }-${date.getDate()}-${date.getFullYear()}.pdf`
  }

  return result
}

function convertTripHeader({
  tripNumber,
  header,
  summary,
}: {
  tripNumber: number
  header: FrcsTripHeader
  summary?: FrcsTripSummary
}): Trip {
  const surveyors: Surveyors = {}
  const tripNum = summary?.tripNumber ?? tripNumber
  for (const surveyor of summary?.team || header.team || [])
    surveyors[surveyor] = {}
  const result: Trip = {
    name: `${tripNum} ${header.name}`,
    surveyors,
    distUnit: distUnits.get(header.distanceUnit) || 'ft',
    angleUnit: 'deg',
    azmFsUnit: angleUnits.get(header.azimuthUnit),
    azmBsUnit: angleUnits.get(header.azimuthUnit),
    incFsUnit: angleUnits.get(header.inclinationUnit),
    incBsUnit: angleUnits.get(header.inclinationUnit),
    azmBacksightsCorrected: Boolean(header.backsightAzimuthCorrected),
    incBacksightsCorrected: Boolean(header.backsightInclinationCorrected),
    survey: [],
  }
  const date = summary?.date || header.date
  if (date) result.date = date.toISOString().substring(0, 10)

  return result
}

function formatLrud(number: number | undefined): string {
  if (number == null || !Number.isFinite(number)) return '0'
  return number.toFixed(2)
}

function convertSurvey(trip: FrcsTrip): Survey {
  const survey: Survey = []

  const { distanceUnit, azimuthUnit, inclinationUnit } = trip.header

  let lastFromStation: Station | undefined
  let lastShot: Shot | undefined
  let lastToStation: Station | undefined

  let measurements: ShotMeasurement[] | undefined

  for (const shot of trip.shots) {
    if (
      lastFromStation &&
      lastShot &&
      lastToStation &&
      shot.from === lastFromStation.station &&
      shot.to === lastToStation.station
    ) {
      // same from and to station; prepare to add measurements to the last shot
      measurements = lastShot.measurements || (lastShot.measurements = [])
    } else {
      // if the last station doesn't match the from station of this shot,
      // insert an empty (non) shot and a new from station
      let fromStation: Station | undefined
      if (lastToStation && lastToStation.station === shot.from) {
        fromStation = lastToStation
      } else if (survey.length) {
        // insert empty shot
        survey.push({})
      }
      if (!fromStation) {
        fromStation = { station: shot.from }
        survey.push(fromStation)
      }

      if (!fromStation.lrud && shot.fromLruds) {
        const { left, right, up, down } = shot.fromLruds
        fromStation.lrud = [
          formatLrud(left?.get(distanceUnit)),
          formatLrud(right?.get(distanceUnit)),
          formatLrud(up?.get(distanceUnit)),
          formatLrud(down?.get(distanceUnit)),
        ]
      }

      if (shot.to) {
        // insert shot
        measurements = []
        const metashot: Shot = { measurements }
        if (shot.excludeDistance) metashot.excludeDist = true
        survey.push(metashot)
        // insert to station
        const toStation: Station = { station: shot.to }
        survey.push(toStation)

        // add lruds to to station
        if (!toStation.lrud && shot.toLruds) {
          const { left, right, up, down } = shot.toLruds
          toStation.lrud = [
            formatLrud(left?.get(distanceUnit)),
            formatLrud(right?.get(distanceUnit)),
            formatLrud(up?.get(distanceUnit)),
            formatLrud(down?.get(distanceUnit)),
          ]
        }
      } else {
        measurements = fromStation.splays || (fromStation.splays = [])
      }
    }

    const dist = shot?.distance?.get(distanceUnit)
    const azmFs = shot?.frontsightAzimuth?.get(azimuthUnit)
    const azmBs = shot?.backsightAzimuth?.get(azimuthUnit)
    let incFs = shot?.frontsightInclination?.get(inclinationUnit)
    let incBs = shot?.backsightInclination?.get(inclinationUnit)

    if (!Number.isFinite(incFs) && !Number.isFinite(incBs)) {
      if (Number.isFinite(azmFs)) incFs = 0
      else if (Number.isFinite(azmBs)) incBs = 0
    }

    if (measurements) {
      // add frontsights
      const frontsight: ShotMeasurement = { dir: 'fs' }
      if (Number.isFinite(dist)) frontsight.dist = dist.toFixed(2)
      if (azmFs != null && Number.isFinite(azmFs))
        frontsight.azm = azmFs.toFixed(2)
      if (incFs != null && Number.isFinite(incFs))
        frontsight.inc = incFs.toFixed(2)
      measurements.push(frontsight)

      // add backsights
      if (Number.isFinite(azmBs) || Number.isFinite(incBs)) {
        const backsight: ShotMeasurement = { dir: 'bs' }
        if (azmBs != null && Number.isFinite(azmBs))
          backsight.azm = azmBs.toFixed(2)
        if (incBs != null && Number.isFinite(incBs))
          backsight.inc = incBs.toFixed(2)
        measurements.push(backsight)
      }
    }
  }

  return survey
}

function convertPlot({
  plot,
  utmZone,
  zeroReference,
}: {
  plot: FrcsPlotFile
  utmZone: number
  zeroReference: {
    northing: UnitizedNumber<Length>
    easting: UnitizedNumber<Length>
    elevation: UnitizedNumber<Length>
  }
}): FixedStations[] {
  const stations: Record<string, FixedStation> = {}
  const fixedStations: FixedStations = {
    distUnit: 'm',
    ellipsoid: 'WGS84',
    datum: 'WGS84',
    utmZone,
    stations,
  }

  for (const shot of plot.shots) {
    stations[shot.toName] = {
      north: shot.northing
        .add(zeroReference.northing)
        .get(Length.meters)
        .toFixed(3),
      east: shot.easting
        .add(zeroReference.easting)
        .get(Length.meters)
        .toFixed(3),
      elev: shot.elevation
        .add(zeroReference.elevation)
        .get(Length.meters)
        .toFixed(3),
    }
  }

  return [fixedStations]
}
