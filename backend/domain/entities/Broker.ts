export class BrokerEntity {
    constructor(
        public idCode: number,
        public idCodeNm: string,
        public jurirno: string,
        public bsnmCmpnm: string,
        public brkrNm: string,
        public brkrAsortCode: number,
        public brkrAsortCodeNm: string,
        public crqfcNo: string,
        public crqfcAcqdt: Date,
        public ofcpsSeCode: string,
        public ofcpsSeCodeNm: string,
        public lastUpdtDt: Date
    ) {}
}