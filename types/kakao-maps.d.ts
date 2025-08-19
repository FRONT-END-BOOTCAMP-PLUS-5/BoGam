declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => any;
        Map: new (container: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options: any) => any;
        event: {
          addListener: (target: any, type: string, handler: () => void) => void;
          removeListener: (
            target: any,
            type: string,
            handler: () => void
          ) => void;
        };
        load: (callback: () => void) => void;
      };
    };
  }
}

export {};
