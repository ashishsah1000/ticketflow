import { Controller, Post, Get, Patch, Body, Req, Query, Param, UseGuards } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { EmployeeGuard } from '../roles/guards/employee.guard';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  async create(@Req() req: any, @Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(req.user.id, createIssueDto);
  }

  @Get('all')
  @UseGuards(EmployeeGuard)
  async findAllForEmployee(@Query('status') status?: string) {
    return this.issuesService.findAllForEmployee(status);
  }

  @Get(':id')
  @UseGuards(EmployeeGuard)
  async findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id);
  }

  @Get(':id/activities')
  @UseGuards(EmployeeGuard)
  async getActivities(@Param('id') id: string) {
    return this.issuesService.getActivities(id);
  }

  @Post(':id/activities')
  @UseGuards(EmployeeGuard)
  async addActivity(
    @Param('id') id: string,
    @Body() body: { type: string; details: string }
  ) {
    return this.issuesService.addActivity(id, body.type, body.details);
  }

  @Patch(':id')
  @UseGuards(EmployeeGuard)
  async updateIssue(
    @Param('id') id: string,
    @Body() updates: { status?: string; action?: string; escalation?: number }
  ) {
    return this.issuesService.updateIssue(id, updates);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.issuesService.findAllByUserId(req.user.id);
  }
}
