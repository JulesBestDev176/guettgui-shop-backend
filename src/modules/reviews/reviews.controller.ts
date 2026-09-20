import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ReviewsService } from './reviews.service';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

class CreateReviewBody {
  @IsString() productId: string;
  @IsInt() @Min(1) @Max(5) rating: number;
  @IsString() @IsOptional() comment?: string;
}

@ApiTags('Avis')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Laisser un avis' })
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateReviewBody) {
    return this.reviews.create(user.id, dto);
  }

  @Public()
  @Get('product/:productId')
  @ApiOperation({ summary: 'Avis d\'un produit' })
  findForProduct(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviews.findForProduct(productId, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
  }
}
