using AngularAuthAPI.Helpers;
using AngularAuthAPI.Migrations;
using AngularAuthAPI.Models;
using AngularAuthAPI.Models.Dto;
using AngularAuthAPI.UtilityService;
using formAuth.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using static AngularAuthAPI.Models.User;

namespace AngularAuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext; 
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
       public UserController(AppDbContext appDbContext, IConfiguration configuration, IEmailService emailService)
        {
            _authContext = appDbContext;
            _configuration = configuration;
            _emailService = emailService;
        }



        [HttpPost("authenticate")]

        public async Task<IActionResult> Authenticate([FromBody] User UserObj)
        {


            if (UserObj == null)
            {
                return BadRequest();
            }

            var User = await _authContext.Users
                .FirstOrDefaultAsync(x => x.email == UserObj.email);

            if (User == null)
                return NotFound(new { Message = "user not found" });

            if (!PasswordHasher.VerifyPassword(UserObj.password, User.password))
            {
                return BadRequest(new { Message = "Password is Incorrect" });
            }

            User.Token = CreateJWT(User);
            
            return Ok(new
            {
                Token = User.Token,
                Message = "Login Success!"
            });
        }

        [HttpPost("register")]

        public async Task<IActionResult> RegisterUser([FromBody] User Userobj)
        {


            if (Userobj == null)
                return BadRequest();


            //check email

            if (await CheckEmailExistAsync(Userobj.email))
                return BadRequest(new { Message = "Email Already Exists" });

            Userobj.password = PasswordHasher.HashPassword(Userobj.password);
            Userobj.Role = "User";
            Userobj.Token = "";
           await _authContext.Users.AddAsync(Userobj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "User registred!"
            });
        }

        private Task<bool> CheckEmailExistAsync(string email)=> _authContext.Users.AnyAsync(x => x.email == email);

        private string CreateJWT(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysecret.......");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name,$"{user.fname} {user.lname}"),
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(10),
                SigningCredentials = credentials
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);

        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<User>> GetAllUsers()
        {
            return Ok(await _authContext.Users.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            var user = await _authContext.Users.FindAsync(id);
            if (user == null)
                return BadRequest("User not found");
            return Ok(user);
        }

        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {

            // Retrieve the requested user's data from the database
            var user = await _authContext.Users.FirstOrDefaultAsync(u => u.email == email);

            // Check if the user exists
            if (user == null || user.email != email)
            {
                return NotFound();
            }

            return Ok(user);

        }


        [HttpGet("registrations")]
        public ActionResult<IEnumerable<UserRegistrationData>> GetRegistrations()
        {
            var startDate = DateTime.UtcNow.Date.AddDays(-6); // Start date is 6 days ago
            var endDate = DateTime.UtcNow.Date; // End date is today

            var registrations = Enumerable.Range(0, 7)
                .Select(offset => new
                {
                    Date = startDate.AddDays(offset),
                    RegisteredUsers = _authContext.Users
                        .Count(u => u.Role == "User" && u.RegistrationDate.Date == startDate.AddDays(offset).Date)
                })
                .Select(data => new UserRegistrationData
                {
                    Date = data.Date,
                    RegisteredUsers = data.RegisteredUsers
                })
                .ToList();

            return Ok(registrations);
        }





        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var user = await _authContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            _authContext.Users.Remove(user);
            await _authContext.SaveChangesAsync();

            return NoContent();
        }

      

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] User updatedItem)
        {
            var user = await _authContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.fname = updatedItem.fname;
            user.lname = updatedItem.lname;
            user.phonenum = updatedItem.phonenum;
            user.gender = updatedItem.gender;
            user.dob = updatedItem.dob;
            user.password= updatedItem.password;
            user.City = updatedItem.City;
            user.Country = updatedItem.Country;
            user.State= updatedItem.State;
            user.email = updatedItem.email;
            user.pfp = updatedItem.pfp;
            user.address = updatedItem.address;
          
          

            _authContext.Users.Update(user);
            await _authContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("users/upload")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file selected for upload.");

                if (!IsSupportedFileType(file))
                    return BadRequest("Invalid file type.");

                var folderPath = Path.Combine("Resources", "Images");
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), folderPath);
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var dbFileName = Path.GetFileName(fileName);
                var filePath = Path.Combine(fullPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(new { message = "File uploaded successfully.", fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }


        private bool IsSupportedFileType(IFormFile file)
        {
            string[] allowedTypes = { "image/jpeg", "image/png", "image/gif" };
            return allowedTypes.Contains(file.ContentType);
        }




        [HttpPost("send-reset-email/{email}")]
        public async Task<ActionResult> SendEmail(string email)
        {
            var user = await _authContext.Users.FirstOrDefaultAsync(x => x.email == email);
            if (user is null)
            {

                return NotFound(new
                {
                    Statuscode = 404,
                    Message = "email doesn't exist"
                });

            }
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);
            user.ResetPasswordToken = emailToken;
            user.ResetPasswordExpiry = DateTime.Now.AddMinutes(15);
            string from = _configuration["EmailSettings:From"];
            var emailModel = new EmailModel(email, "Reset Password!!", EmailBody.EmailStringBody(email, emailToken));
            _emailService.SendEmail(emailModel);
            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Statuscode = 200,
                Message = "email sent!"
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            var user = await _authContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.email == resetPasswordDto.Email);

            if (User is null)
            {
                return NotFound(new
                {
                    StatusCode = 400,
                    Message = "user Doesn't Exist"
                });
            }
            var tokenCode = user.ResetPasswordToken;
            DateTime emailTokenExpiry = user.ResetPasswordExpiry;
            if(tokenCode != newToken || emailTokenExpiry < DateTime.UtcNow) 
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Invalid link"
                });
            }
            user.password = PasswordHasher.HashPassword(resetPasswordDto.password);
            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Password Request SuccesFully"
            });
        }
    }
}
