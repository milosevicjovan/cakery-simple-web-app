using Cakery_Backend.Models;
using CakeryDataAccess;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Cakery_Backend.Controllers
{
    public class ProductsController : ApiController
    {
        [HttpGet]
        [ResponseType(typeof(ProductDTO))]
        [Route("api/products")]
        public async Task<IHttpActionResult> GetAllProducts()
        {
            using (Cakery_DbContext db = new Cakery_DbContext())
            {
                var products = await db.Products.Select(p => new ProductDTO()
                {
                    ProductID = p.ProductID,
                    Name = p.Name,
                    Description = p.Description,
                    Price = Math.Round(p.Price, 2),
                    Promotion = Math.Round(p.Price, 2)
                }).ToListAsync();

                return Ok(products);
            }
        }

        [HttpGet]
        [ResponseType(typeof(ProductDTO))]
        [Route("api/products/{id}")]
        public async Task<IHttpActionResult> GetProductById(int id)
        {
            using (Cakery_DbContext db = new Cakery_DbContext())
            {
                var product = await db.Products.SingleOrDefaultAsync(p => p.ProductID == id);
                if (product == null)
                {
                    return BadRequest("Product not found!");
                }

                ProductDTO productDto = new ProductDTO()
                {
                    ProductID = product.ProductID,
                    Name = product.Name,
                    Description = product.Description,
                    Price = Math.Round(product.Price, 2),
                    Promotion = Math.Round(product.Promotion ?? 0, 2)
                };

                return Ok(productDto);
            }
        }
    }
}
