export class Track {
  // tslint:disable-next-line:variable-name
  _track_id!: number
  type!: string
  time!: number
  event!: string
  project?: string
  // tslint:disable-next-line:variable-name
  distinct_id!: string
  originalId?:string
  lib!: object
  properties!: object
}

export class Lib {
  $lib!: string
  // tslint:disable-next-line:variable-name
  $lib_version!: string
  // tslint:disable-next-line:variable-name
  $lib_method!: string
  // tslint:disable-next-line:variable-name
  $lib_detail: any
}
