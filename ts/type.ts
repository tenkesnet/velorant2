interface Callout {
  regionName: string;
  superRegionName: string;
}
interface MapData {
  uuid: string;
  displayName: string;
  displayIcon: string;
  splash: string;
  coordinates?: string;
  tacticalDescription?: string;
  callouts?: Callout[];
}