import { Controller, Post, Get, Patch, Body, Req, Query, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { EmployeeGuard } from '../roles/guards/employee.guard';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  async create(@Req() req: any, @Body() createIssueDto: CreateIssueDto) {
    if (req.user.status === 'disabled') {
       throw new ForbiddenException('Your account is restricted from creating new issues.');
    }
    return this.issuesService.create(req.user.id, createIssueDto);
  }

  @Get('all')
  @UseGuards(EmployeeGuard)
  async findAllForEmployee(
    @Query('status') status?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.issuesService.findAllForEmployee(status, limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
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

  @Patch(':id/block-user')
  @UseGuards(EmployeeGuard)
  async blockUser(@Param('id') id: string) {
    return this.issuesService.blockUser(id);
  }

  @Patch(':id/unblock-user')
  @UseGuards(EmployeeGuard)
  async unblockUser(@Param('id') id: string) {
    return this.issuesService.unblockUser(id);
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.issuesService.findAllByUserId(req.user.id, limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
  }
}
