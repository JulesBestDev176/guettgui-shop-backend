import { Injectable } from "@nestjs/common";

@Injectable()
export class DeliveryService {
  available() {
    return [
      { id: "del-1", pickup: "Ferme Diallo", dropoff: "Dakar Plateau", fee: 6000, status: "AVAILABLE" },
      { id: "del-2", pickup: "Thies Nord", dropoff: "Almadies", fee: 4500, status: "AVAILABLE" },
    ];
  }
}
