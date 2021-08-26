import { environment } from 'src/environments/environment';
import { ProductsDataService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  id: number;
  private sub: any;

  private newProduct: boolean = false;

  public product: Product;

  public isLoading = false;
  public isDataAvailable = false;

  isUpdated: boolean = false;

  fileToUpload: any;

  public imgPreview: any;

  private api = environment.imageApi;

  constructor(private route: ActivatedRoute, private router: Router, private productsDataService: ProductsDataService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log(this.router.url)
    if (this.router.url === '/products/new') {
      this.newProduct = true;
    } else {
      this.sub = this.route.params.subscribe(params => {
          this.isLoading = true;
          this.isDataAvailable = false;
          this.id = +params['id'];
          this.newProduct = false;
          this.getProductById(this.id).then(() => {
            if (this.product != null) {
              this.isDataAvailable = true;
              this.isLoading = false;
            }
          }).catch(error => {
            this.isDataAvailable = false;
            this.isLoading = false;
            console.log("Error: ", error);
          });
    });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getImage(image) {
    let imageUrl = this.api + image;
    return imageUrl;
  }
  
  async getProductById(id: number) {
    await new Promise((resolve, _) => {
      this.productsDataService.getProductById(id).subscribe(product => {
        this.product = product;
        if (this.product.imagePath == null || this.product.imagePath == '') {
          this.product.imagePath = 'no-image.png';
        }
        resolve(product);
      })
    })
  }

  onSave(Image: any) {
    this.isUpdated = false;
    this.productsDataService.updateProduct(this.id, this.product).subscribe(response => {
      if (this.fileToUpload != null) {
        this.uploadImage(response + "", Image);
      }
      this.isUpdated = true;
    }, error => {
      this.isUpdated = false;
      console.log("Error: ", error);
    })
  }

  uploadImage(productPath: string, Image: any) {
    this.productsDataService.uploadImage(productPath, this.fileToUpload).subscribe(
      imagePath => {
        Image.value = null;
        this.imgPreview = null;
        this.product.imagePath = "" + imagePath;
      }
    );
  }

  handleFileInput(obj: any) {
    console.log(obj);
    console.log(obj.target.files[0]);
    this.fileToUpload = obj.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.fileToUpload); 
    reader.onload = (_event) => { 
      this.imgPreview = reader.result; 
    }
  }

  onRemoveImage() {
    this.productsDataService.removeImage(this.product.productID);
    this.product.imagePath = "no-image.png";
  }
}
