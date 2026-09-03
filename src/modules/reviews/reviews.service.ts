import { Injectable } from "@nestjs/common";

@Injectable()
export class ReviewsService {
  productReviews(productId: string) {
    return [
      { id: "rev-1", productId, rating: 5, comment: "Produit frais et livraison rapide" },
    ];
  }
}
