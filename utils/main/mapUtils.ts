import { Location } from '@/(anon)/main/_components/types/map.types';

/**
 * 주소 좌표를 Location 형식으로 변환합니다.
 * @param x - 경도
 * @param y - 위도
 * @returns Location 객체
 */
export const createLocationFromCoordinates = (
  x: number,
  y: number
): Location => {
  return {
    lat: y,
    lng: x,
  };
};

/**
 * 주소 객체에서 Location을 추출합니다.
 * @param address - 주소 객체
 * @returns Location 객체 또는 null
 */
export const extractLocationFromAddress = (address: {
  x?: number;
  y?: number;
}): Location | null => {
  if (address.x && address.y) {
    return createLocationFromCoordinates(address.x, address.y);
  }
  return null;
};

/**
 * 두 Location이 같은지 비교합니다.
 * @param location1 - 첫 번째 Location
 * @param location2 - 두 번째 Location
 * @returns boolean
 */
export const isSameLocation = (
  location1: Location,
  location2: Location
): boolean => {
  return location1.lat === location2.lat && location1.lng === location2.lng;
};

/**
 * Location이 유효한지 검증합니다.
 * @param location - Location 객체
 * @returns boolean
 */
export const isValidLocation = (location: Location): boolean => {
  return (
    typeof location.lat === 'number' &&
    typeof location.lng === 'number' &&
    !isNaN(location.lat) &&
    !isNaN(location.lng) &&
    location.lat >= -90 &&
    location.lat <= 90 &&
    location.lng >= -180 &&
    location.lng <= 180
  );
};

/**
 * GPS 좌표가 유효한지 검증합니다.
 * @param x - 경도
 * @param y - 위도
 * @returns boolean
 */
export const isValidGPSCoordinates = (x: number, y: number): boolean => {
  return isValidLocation(createLocationFromCoordinates(x, y));
};
