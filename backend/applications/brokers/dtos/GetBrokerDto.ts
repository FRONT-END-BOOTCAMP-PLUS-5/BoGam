export class GetBrokerDto {
    constructor(
        public bsnmCmpnm: string,
        public brkrNm: string,
        public key: string,
        public domain: string,
        public idCode?: number,
        public jurirno?: string,
        public format?: string,
        public numOfRows?: number,
        public pageNo?: number,
    ) {}
}