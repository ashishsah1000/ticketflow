import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll(search?: string) {
    if (search) {
      return this.companyRepository.find({
        where: { name: Like(`%${search}%`) },
        order: { name: 'ASC' },
      });
    }
    return this.companyRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.companyRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }
}
