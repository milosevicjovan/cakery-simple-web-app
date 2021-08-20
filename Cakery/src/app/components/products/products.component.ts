import { ProductsDataService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { OrderItem } from 'src/app/models/order-item.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public isLoading = false;
  public isDataAvailable = false;

  public products: Product[];

  public cart: { productId: number, name: string, quantity: number, price: number }[] = [];

  constructor(private productsDataService: ProductsDataService) { }

  ngOnInit(): void {
    this.getProducts().then(() => {
      if (this.products.length > 0) {
        this.isLoading = false;
        this.isDataAvailable = true;
      } else {
        this.isLoading = false;
        this.isDataAvailable = false;
      }
    });
  }

  async getProducts() {
    this.isLoading = true;
    await new Promise((resolve, _) => {
      this.productsDataService.getProducts().subscribe((products: Product[]) => {
        this.products = products;
        resolve(products);
      })
    })
  }

  onClick(productID: number, name: string, price: number) {
    let item = this.cart.find(item => item.productId === productID);
    let index = this.cart.indexOf(item);

    if (index !== -1) {
      this.cart[index] = { productId: productID, name: name, quantity: item.quantity+=1, price: price }
    } else {
      this.cart.push({ productId: productID, name: name, quantity: 1, price: price });
    }
  }

}
