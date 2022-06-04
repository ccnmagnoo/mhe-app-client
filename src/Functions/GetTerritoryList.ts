import { cities } from '../Assets/cities';

/**
 * @function getCityList function return all the cities in the territory requersted
 * @param territory 's name  of Region, Province o Town,
 * @param landType enum with city/province/region literals
 */
export function getCityList(territory: string, landType: LandType): string[] {
  const filterCities = cities
    .filter((land) => land[landType] === territory)
    .map((land) => land.city);

  return filterCities;
}

/**
 * @returns objecte @type City with territorial identifiers
 * @param territory name
 * @param landType literal of: region, province, city
 */
export function getTerritoryId(
  territory: string,
  landType: LandType
): number | undefined {
  const list = cities.find((land) => land[landType] === territory);
  const id = list?.regionId;
  return id ? +id : undefined;
}

/**
 * @function getTerritoryNames, @return string list of names land
 * @param landType , literal region,city,province
 */
export function getTerritoryNames(landType: LandType): string[] {
  /**
   * this function return all the names of specifict land type
   */
  const territories: string[] = cities.map((land) => {
    const cityObject: { [key: string]: string } = { ...land };
    return cityObject[landType];
  });
  //getting unique values of region/province/city
  const unique = territories.filter(function (elem, index, self) {
    return index === self.indexOf(elem);
  });

  return unique;
}

export enum LandType {
  city = 'city',
  province = 'province',
  region = 'region',
}
