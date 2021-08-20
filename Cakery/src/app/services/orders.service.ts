import { OrderItem } from './../models/order-item.model';
import { Order } from './../models/order.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

const api = environment.serviceApi;

@Injectable({providedIn: 'root'})
export class OrdersDataService {

    public cart: { productId: number, name: string, quantity: number, price: number, promotion: number }[] = [];

    constructor(private http: HttpClient) {}

    getOrders() {
        return this.http.get<Order[]>(api + "orders");
    }

    getOrderById(orderId: number) {
        return this.http.get<Order>(api + "orders/" + orderId);
    }

    getOrderItemsByOrderId(orderId: number){
        return this.http.get<OrderItem[]>(api + "orders/items/" + orderId);
    }

    addOrderItem(orderId: number, item: OrderItem) {
        this.http.post(api + "orders/items/" + orderId, item);
    }

    addOrder(order: Order) {
        this.http.post(api + "orders", order);
    }

    // Maybe will not be used
    deleteOrder(orderId: number) {
        this.http.delete(api + "orders/" + orderId);
    }

    addToChart(productID: number, name: string, price: number, promotion: number) {
        let item = this.cart.find(item => item.productId === productID);
        let index = this.cart.indexOf(item);
    
        if (index !== -1) {
            this.cart[index].quantity = item.quantity+=1;
        } else {
            this.cart.push({ productId: productID, name: name, quantity: 1, price: price, promotion: promotion });
        }
      }
    
      removeFromChart(productID: number) {
        let item = this.cart.find(item => item.productId === productID);
        let index = this.cart.indexOf(item);
    
        if (index !== -1) {
          this.cart[index].quantity-=1;
          if (this.cart[index].quantity<=0) {
            this.cart.splice(index, 1);
          }
        }
      }
    
      getTotalSum(): number {
        let sum = 0;
        this.cart.forEach(item => {
          sum += item.quantity * (item.price - (item.price * (item.promotion/100)));
        });
    
        return sum;
      }

      getCart() {
          console.log("from service: ", this.cart);
          return this.cart;
      }
}