import { OrdersDataService } from './../../services/orders.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  public cart: { productId: number, name: string, quantity: number, price: number, promotion: number }[] = [];

  constructor(private ordersDataService: OrdersDataService) { }

  ngOnInit(): void {
    this.cart = this.ordersDataService.getCart();
    console.log(this.cart);
  }

  getCart() {
    this.cart = this.ordersDataService.getCart();
  }

  getUserData() {
    
  }

}
