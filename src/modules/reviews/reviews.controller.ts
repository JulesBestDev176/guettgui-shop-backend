import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ReviewsService } from "./reviews.service";

@ApiTags("reviews")
@Controller("products/:productId/reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  list(@Param("productId") productId: string) {
    return this.reviewsService.productReviews(productId);
  }
}
