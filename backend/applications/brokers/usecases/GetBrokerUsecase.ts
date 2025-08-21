import { BrokerRepository } from '@be/domain/repository/BrokerRepository';
import { Broker } from '@be/domain/entities/Broker';
import { GetBrokerQueryDto } from '@be/applications/brokers/dtos/GetBrokerQueryDto';

export class GetBrokerUsecase {
    constructor(
        private brokerRepository: BrokerRepository
    ) {}

    async execute(query: GetBrokerQueryDto): Promise<Broker | Broker[]> {
        try {
            const broker = await this.brokerRepository.find(query);
            if (!broker) {
                throw new Error('중개사 정보를 찾을 수 없습니다.');
            }
            return broker;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('중개사 정보 조회 중 오류가 발생했습니다.');
        }
    }
}