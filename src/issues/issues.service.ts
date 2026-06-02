import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './entities/issue.entity';
import { IssueActivity } from './entities/issue-activity.entity';
import { CreateIssueDto } from './dto/create-issue.dto';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    @InjectRepository(IssueActivity)
    private readonly activityRepository: Repository<IssueActivity>,
  ) {}

  async create(userId: string, createIssueDto: CreateIssueDto) {
    const generateToken = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const issue = this.issueRepository.create({
      ...createIssueDto,
      user_id: userId,
      tokenId: generateToken(),
    });
    const savedIssue = await this.issueRepository.save(issue);
    
    // Log creation activity
    await this.activityRepository.save({
      issue_id: savedIssue.id,
      activity_type: 'created',
      details: 'Issue was raised'
    });
    
    return savedIssue;
  }

  async findAllByUserId(userId: string, limit: number = 100, offset: number = 0) {
    return this.issueRepository.find({
      where: { user_id: userId },
      order: { escalation: 'DESC', created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findAllForEmployee(statusFilter?: string, limit: number = 100, offset: number = 0) {
    const whereCondition = statusFilter ? { status: statusFilter } : {};
    
    return this.issueRepository.find({
      where: whereCondition,
      relations: ['user'],
      order: {
        escalation: 'DESC',
        created_at: 'DESC'
      },
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const issue = await this.issueRepository.findOne({
      where: { id },
      relations: ['user']
    });
    if (!issue) throw new NotFoundException('Issue not found');
    return issue;
  }

  async findByTokenId(tokenId: string) {
    const issue = await this.issueRepository.findOne({
      where: { tokenId },
      relations: ['user']
    });
    if (!issue) throw new NotFoundException('Issue not found');
    return issue;
  }

  async getActivities(id: string) {
    return this.activityRepository.find({
      where: { issue_id: id },
      order: { created_at: 'ASC' }
    });
  }

  async addActivity(id: string, activityType: string, details: string) {
    const issue = await this.findOne(id);
    
    const activity = this.activityRepository.create({
      issue_id: issue.id,
      activity_type: activityType,
      details
    });
    await this.activityRepository.save(activity);

    if (activityType === 'call' || activityType === 'mail') {
      if (issue.status !== 'processing' && issue.status !== 'closed') {
        issue.status = 'processing';
        await this.issueRepository.save(issue);
      }
    }
    
    return activity;
  }

  async updateIssue(id: string, updates: { status?: string; action?: string; escalation?: number }) {
    const issue = await this.findOne(id);
    const oldStatus = issue.status;
    const oldAction = issue.action;
    const oldEscalation = issue.escalation;

    Object.assign(issue, updates);
    const saved = await this.issueRepository.save(issue);

    if (updates.status && updates.status !== oldStatus) {
      await this.addActivity(id, 'status_change', `Status changed from ${oldStatus} to ${updates.status}`);
    }
    if (updates.action && updates.action !== oldAction) {
      await this.addActivity(id, 'action_change', `Action changed from ${oldAction || 'none'} to ${updates.action}`);
    }
    if (updates.escalation && updates.escalation !== oldEscalation) {
      await this.addActivity(id, 'escalation_change', `Escalation changed from ${oldEscalation} to ${updates.escalation}`);
    }

    return saved;
  }
}
