
using Microsoft.AspNetCore.Mvc;
using BlackLight.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace BlackLight.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public UsersController(UserManager<ApplicationUser> userManager) => _userManager = userManager;

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll() 
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<object>();
            foreach(var u in users) {
                var roles = await _userManager.GetRolesAsync(u);
                result.Add(new {
                    id = u.Id,
                    name = u.FullName,
                    email = u.Email,
                    phoneNumber = u.PhoneNumber,
                    location = u.Location,
                    image = u.ProfileImage,
                    role = roles.FirstOrDefault() ?? "Customer",
                    createdAt = u.CreatedAt
                });
            }
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            user.FullName = dto.Name;
            user.PhoneNumber = dto.PhoneNumber;
            user.Location = dto.Location;
            user.ProfileImage = dto.Image ?? user.ProfileImage;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded) return Ok(new {
                id = user.Id,
                name = user.FullName,
                email = user.Email,
                phoneNumber = user.PhoneNumber,
                location = user.Location,
                image = user.ProfileImage
            });

            return BadRequest(result.Errors);
        }
    }

    public record UpdateUserDto(string Name, string PhoneNumber, string Location, string? Image);
}
