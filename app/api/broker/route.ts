import { NextRequest, NextResponse } from 'next/server';
import { GetBrokerUsecase } from '@be/applications/brokers/usecases/GetBrokerUsecase';
import { ApiBrokerRepository } from '@be/infrastructure/repository/ApiBrokerRepository';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brkrNm = searchParams.get('brkrNm');
  const bsnmCmpnm = searchParams.get('bsnmCmpnm');
  if (!brkrNm || !bsnmCmpnm) {
    return NextResponse.json({ status: 400 });
  }
  const key = process.env.VWORLD_BROKER_KEY;
  if (!key) {
    return NextResponse.json({ status: 500 });
  }
  const usecase = new GetBrokerUsecase(new ApiBrokerRepository());
  const result = await usecase.execute(brkrNm, bsnmCmpnm);
  return NextResponse.json(result);
}
