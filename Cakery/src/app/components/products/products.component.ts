import { OrdersDataService } from './../../services/orders.service';
import { UsersDataService } from './../../services/users.service';
import { ProductsDataService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { OrderItem } from 'src/app/models/order-item.model';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public isLoading = false;
  public isDataAvailable = false;

  public products: Product[];

  public cart: { productId: number, name: string, quantity: number, price: number, promotion: number }[] = [];

  public totalSum: number = 0;

  public user: User;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  
  constructor(private productsDataService: ProductsDataService, 
              private usersDataService: UsersDataService, 
              private ordersDataService: OrdersDataService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.usersDataService.getIsAuth();
    this.authListenerSubs = this.usersDataService.getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        });
    this.getProducts().then(() => {
      this.getCurrentUser().then(() => {
        if (this.products.length > 0) {
          this.isLoading = false;
          this.isDataAvailable = true;
        } else {
          this.isLoading = false;
          this.isDataAvailable = false;
        }
      }); 
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

  async getCurrentUser() {
    await new Promise((resolve, _) => {
      this.usersDataService.getCurrentUser().subscribe(user => {
        this.user = user;
        resolve(user);
      });
    });
  }

  addToChart(productID: number, name: string, price: number, promotion: number) {
    this.ordersDataService.addToChart(productID, name, price, promotion);
    this.cart = this.ordersDataService.getCart();
    this.totalSum = this.ordersDataService.getTotalSum();
  }

  removeFromChart(productID: number) {
    this.ordersDataService.removeFromChart(productID);
    this.cart = this.ordersDataService.getCart();
    this.totalSum = this.ordersDataService.getTotalSum();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
