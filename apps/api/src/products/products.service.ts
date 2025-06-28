import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(query?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
  }) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (query?.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { tags: { has: query.search } },
      ];
    }

    const [products, total] = await Promise.all([
      this.databaseService.client.product.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      this.databaseService.client.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.databaseService.client.product.findUnique({
      where: { id, isActive: true },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async findFeatured() {
    return this.databaseService.client.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: true,
      },
      take: 8,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}