import { OrdersDataService } from './../../services/orders.service';
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  public isLoading = false;

  orders: Order[];

  constructor(private ordersDataService: OrdersDataService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getOrders().then(() => {
      this.isLoading = false;
    })
  }

  async getOrders() {
    await new Promise((resolve, _) => {
      this.ordersDataService.getOrders().subscribe(orders => {
        this.orders = orders;
        resolve(orders);
      });
    });
  }

}
