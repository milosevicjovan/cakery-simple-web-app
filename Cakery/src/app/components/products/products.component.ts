import { ProductsDataService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(private productsDataService: ProductsDataService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  async getProducts() {
    await new Promise((resolve, _) => {
      this.productsDataService.getProducts().subscribe((products: Product[]) => {
        console.log(products);
        resolve(products);
      })
    })
  }

}
