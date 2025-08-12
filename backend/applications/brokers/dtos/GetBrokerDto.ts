export interface GetBrokerDto {
    bsnmCmpnm: string;
    brkrNm: string;
    key: string;
    domain: string;
    idCode?: number;
    jurirno?: string;
    format?: string;
    numOfRows?: number;
    pageNo?: number;
}