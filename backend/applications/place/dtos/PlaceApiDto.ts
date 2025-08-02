export interface PlaceApiDto {
  place_name?: string;
  address_name: string;
  x: string;
  y: string;
}

export interface PlaceApiResponse {
  documents: PlaceApiDto[];
}
