import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Vegan Vita Shop API - Running successfully! 🌱';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'vegan-vita-shop-api',
      version: '1.0.0',
    };
  }
}
