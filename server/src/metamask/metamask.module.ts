import { Module } from '@nestjs/common';
import { MetamaskController } from './metamask.controller';
import { MetamaskService } from './metamask.service';

@Module({
  controllers: [MetamaskController],
  providers: [MetamaskService]
})
export class MetamaskModule {}
