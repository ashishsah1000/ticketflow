import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(options: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    companyIds?: number[];
    sort?: string;
  }) {
    const page = Math.max(1, options.page);
    const limit = Math.max(1, Math.min(2000, options.limit)); // limit max to 2000 for analytics
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (options.search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.category LIKE :search OR product.store LIKE :search OR product.description LIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    if (options.category) {
      queryBuilder.andWhere('product.category LIKE :category', {
        category: `%${options.category}%`,
      });
    }

    if (options.companyIds && options.companyIds.length > 0) {
      queryBuilder.andWhere('product.companyId IN (:...companyIds)', {
        companyIds: options.companyIds,
      });
    }

    // Order by name as a default sorting rule
    if (options.sort === 'complaints') {
      // Cast to integer to properly sort numerical values stored as text/varchar in sqlite
      queryBuilder.orderBy('CAST(product.complainCount AS INTEGER)', 'DESC');
    } else {
      queryBuilder.orderBy('product.name', 'ASC');
    }

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productRepository.findOneBy({ id });
  }
}
