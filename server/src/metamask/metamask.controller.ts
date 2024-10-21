import { Controller, Get, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { MetamaskService } from './metamask.service';

@Controller('metamask')
export class MetamaskController {
  constructor(private readonly metamaskService: MetamaskService) {}

  @Post('message')
  generateMessage(
    @Body('address') address: string,
    @Body('domain') domain: string,
    @Body('uri') uri: string,
  ) {    
    if (!address || !domain || !uri) {
      throw new BadRequestException('Missing parameters.');
    }
    return this.metamaskService.generateMessage(address, domain, uri);
  }

  @Post('verify')
  async verifyMessage(
    @Body('message') message: string,
    @Body('signature') signature: string,
  ) {
    try {
      await this.metamaskService.verifyMessage(message, signature);
      return { success: true };
    } catch (error) {
      throw new BadRequestException('Verification failed.');
    }
  }
}
