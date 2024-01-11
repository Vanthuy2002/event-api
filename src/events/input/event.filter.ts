export enum WhenEventFilter {
  ALL = 'all',
  TOMORROW = 'tomorrow',
  TODAY = 'today',
  THISWEEK = 'thisweek',
  NEXTWEEK = 'nextweek'
}

export class ListEvents {
  when?: WhenEventFilter = WhenEventFilter.ALL
}
