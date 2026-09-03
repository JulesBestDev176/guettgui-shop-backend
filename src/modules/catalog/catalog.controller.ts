import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CatalogService } from "./catalog.service";
import { ListProductsQuery } from "./dto/list-products.query";

@ApiTags("catalog")
@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get("categories")
  categories() {
    return this.catalogService.listCategories();
  }

  @Get("products")
  products(@Query() query: ListProductsQuery) {
    return this.catalogService.listProducts(query);
  }

  @Get("products/:slug")
  product(@Param("slug") slug: string) {
    return this.catalogService.getProduct(slug);
  }

  @Get("products/:slug/related")
  related(@Param("slug") slug: string) {
    return this.catalogService.getRelated(slug);
  }
}
