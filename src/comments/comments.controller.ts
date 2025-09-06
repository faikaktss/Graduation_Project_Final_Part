import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Permission } from 'src/auth/permissions.decorator';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Permission('comments:create')
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    const userId = req.user.id;
    return this.commentsService.create(createCommentDto, userId);
  }

  @Permission('comments:read:own')
  @Get()
  async findAll(
    @Query('productId') productId?: string,
    @Query('rating') rating?: string,
  ) {
    return this.commentsService.findAll(
      Number(productId) || undefined,
      rating ? Number(rating) : undefined,
    );
  }

  @Permission('comments:read:any')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.commentsService.findOne(Number(id));
  }

  @Permission('comments:update:own')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req, 
  ) {
    const userId = req.user.id;
    return this.commentsService.update(Number(id), updateCommentDto, userId);
  }

  @Permission('comments:delete:own')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) { 
    const userId = req.user.id;
    return this.commentsService.remove(Number(id), userId);
  }
}