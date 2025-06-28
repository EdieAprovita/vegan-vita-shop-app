import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Request() req, @Query('all') includeAll?: string) {
    // If user is admin and requests all orders
    const userId = req.user.role === 'ADMIN' && includeAll ? undefined : req.user.id;
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;
    return this.ordersService.findOne(id, userId);
  }
}