﻿using Cakery_Backend.Models;
using CakeryDataAccess;
using Microsoft.AspNet.Identity;
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
    [Authorize]
    public class UsersController : ApiController
    {
        // Getting information about current user that is logged in.
        [HttpGet]
        [ResponseType(typeof(UserDTO))]
        [Route("api/users/current")]
        public async Task<IHttpActionResult> GetCurrentUser()
        {
            string userId = User.Identity.GetUserId();

            using (Cakery_DbContext db = new Cakery_DbContext())
            {
                var user = await db.Users.SingleOrDefaultAsync(u => u.Id.Equals(userId));

                // This should never happen.
                if (user == null)
                {
                    return BadRequest("User was not found!");
                }

                UserDTO userDto = new UserDTO()
                {
                    UserID = user.Id,
                    Username = user.UserName,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Address = user.Address
                };

                return Ok(userDto);
            }
        }

        // Helper method do determine is the current user actually an admin.
        // This method is used through all controlers.
        public static async Task<bool> IsAdmin(string userId)
        {
            using (Cakery_DbContext db = new Cakery_DbContext())
            {
                Role role = await db.Roles.SingleOrDefaultAsync(r => r.Id.Equals(userId));
                if (role.Name.Equals("admin"))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }
}