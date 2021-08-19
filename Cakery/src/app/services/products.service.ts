import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Product } from '../models/product.model';

const api = environment.serviceApi;

@Injectable({providedIn: 'root'})
export class ProductsDataService {
    constructor(private http: HttpClient) {}

    getProducts() {
        return this.http.get<Product[]>(api + "products");
    }

    getProductById(productId: number) {
        return this.http.get<Product>(api + "products/" + productId);
    }

    addProduct(product: Product) {
        // TO DO
    }

    deleteProduct(productId: number) {
        // TO DO
    }
}