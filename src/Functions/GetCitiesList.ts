import { cities, City } from '../Assets/cities';

export function getCitiesList(territory: string, landType: TerritoryType): string[] {
  const filterCities: City[] = cities.filter((land) => {
    const cityObject: { [key: string]: string } = { ...land };
    return cityObject[landType] === territory;
  });

  const result = filterCities.map((land) => {
    return land.city;
  });

  return result;
}

export enum TerritoryType {
  comuna = 'city',
  province = 'province',
  region = 'region',
}
