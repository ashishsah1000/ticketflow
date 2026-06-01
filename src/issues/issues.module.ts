import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { Issue } from './entities/issue.entity';
import { IssueActivity } from './entities/issue-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, IssueActivity])],
  controllers: [IssuesController],
  providers: [IssuesService]
})
export class IssuesModule {}
