import { Order } from './../models/order.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

const api = environment.serviceApi;

@Injectable({providedIn: 'root'})
export class OrdersDataService {
    constructor(private http: HttpClient) {}

    getOrders() {
        return this.http.get<Order[]>(api + "orders");
    }

    getOrderById(orderId: number) {
        return this.http.get<Order>(api + "orders/" + orderId);
        // TO DO:
        // return order items in this method also
    }

    addOrder(order: Order) {
        // TO DO
    }

    deleteOrder(orderId: number) {
        // TO DO
    }
}