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
using Microsoft.AspNet.Identity;

namespace Cakery_Backend.Controllers
{
    [Authorize]
    public class ProductsController : ApiController
    {
        [HttpGet]
        [ResponseType(typeof(ProductDTO))]
        [Route("api/products")]
        [AllowAnonymous]
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
                    Promotion = Math.Round(p.Promotion ?? 0, 2)
                }).ToListAsync();

                return Ok(products);
            }
        }

        [HttpGet]
        [ResponseType(typeof(ProductDTO))]
        [Route("api/products/{id}")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> GetProductById(int id)
        {
            using (Cakery_DbContext db = new Cakery_DbContext())
            {
                var product = await db.Products.SingleOrDefaultAsync(p => p.ProductID == id);
                if (product == null)
                {
                    return BadRequest($"Product with ID={ id } was not found!");
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

        [HttpPost]
        [Route("api/products")]
        public async Task<IHttpActionResult> AddProduct([FromBody]Product product)
        {
            string userId = User.Identity.GetUserId();
            bool IsUserAdmin = await UsersController.IsAdmin(userId);

            if (!IsUserAdmin)
            {
                return BadRequest("You are not authorized!");
            }

            if (product == null)
            {
                return BadRequest("Product object is null.");
            }

            using (Cakery_DbContext db = new Cakery_DbContext())
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid Model state.");
                }

                db.Products.Add(product);

                await db.SaveChangesAsync();

                return Created("", $"Product { product.Name } is added.");
            }
        }

        [HttpDelete]
        [Route("api/products/{id}")]
        public async Task<IHttpActionResult> DeleteProduct(int id)
        {
            string userId = User.Identity.GetUserId();
            bool IsUserAdmin = await UsersController.IsAdmin(userId);

            if (!IsUserAdmin)
            {
                return BadRequest("You are not authorized!");
            }

            using (Cakery_DbContext db = new Cakery_DbContext())
            {
                Product product = await db.Products.SingleOrDefaultAsync(p => p.ProductID == id);

                if (product == null)
                {
                    return BadRequest($"Product with ID={ id } was not found!");
                }

                db.Products.Remove(product);

                await db.SaveChangesAsync();

                return Ok($"Product { product.Name } is deleted.");
            }
        }
    }
}
