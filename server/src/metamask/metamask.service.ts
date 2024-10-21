import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SiweMessage, VerifyParams, SiweResponse } from 'siwe';
import { hexlify, randomBytes } from 'ethers';

@Injectable()
export class MetamaskService {
  private nonces: Map<string, string> = new Map();

  generateMessage(address: string, domain: string, uri: string): string {
    const nonce = hexlify(randomBytes(16));
    
    this.nonces.set(address, nonce);
    
    const message = new SiweMessage({
      domain,
      address,
      statement: 'Sign-in to access the application.',
      uri,
      version: '1',
      chainId: 1,
      nonce,
    });
    
    return message.prepareMessage();
  }

  async verifyMessage(message: string, signature: string): Promise<void> {
    const siweMessage = new SiweMessage(message);

    const verifyParams: VerifyParams = {
      signature,
      nonce: this.nonces.get(siweMessage.address),
    };

    const result: SiweResponse = await siweMessage.verify(verifyParams);

    if (!result.success) {
      throw new UnauthorizedException('SIWE message verification failed.');
    }

    this.nonces.delete(siweMessage.address);
  }
}
