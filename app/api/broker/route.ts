import { NextRequest, NextResponse } from 'next/server';
import { GetBrokerUsecase } from '../../../backend/brokers/applications/Usecases/GetBrokerUsecase';
import { ApiBrokerRepository } from '@be/brokers/infrastructures/Repositories/ApiBrokerRepository';

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const brkrNm = searchParams.get('brkrNm');
    const bsnmCmpnm = searchParams.get('bsnmCmpnm');
    if(!brkrNm || !bsnmCmpnm) {
        return NextResponse.json({status:400});
    }
    const key = process.env.VWORLD_BROKER_KEY;
    if(!key) {
        return NextResponse.json({status:500});
    }
    const usecase = new GetBrokerUsecase(new ApiBrokerRepository());
    const result = await usecase.execute(`http://api.vworld.kr/ned/data/getEBBrokerInfo?key=${key}&brkrNm=${encodeURIComponent(brkrNm)}&domain=localhost&bsnmCmpnm=${encodeURIComponent(bsnmCmpnm)}`);
    return NextResponse.json(result);
}