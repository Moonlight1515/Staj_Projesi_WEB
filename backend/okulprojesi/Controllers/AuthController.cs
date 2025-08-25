using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using okulprojesi.Models;
using System.Data;
using System.Security.Cryptography;
using System.Text;

namespace okulprojesi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly string _connString;

        public AuthController(IConfiguration config)
        {
            _config = config;
            _connString = _config.GetConnectionString("OkulDb");
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var hashedPassword = HashPassword(dto.PasswordHash);

            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("sp_ValidateUser", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@UserName", dto.UserName);
            cmd.Parameters.AddWithValue("@PasswordHash", hashedPassword);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            if (!reader.Read())
                return Unauthorized(new { message = "Geçersiz kullanıcı adı veya şifre." });

            var userId = reader.GetInt32(0);
            var userName = reader.GetString(1);
            var email = reader.GetString(2);
            var roleName = reader.GetString(3);
            var roleId = reader.GetInt32(4);

            return Ok(new
            {
                userId,
                userName,
                email,
                role = roleName,
                roleId
            });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterDto dto)
        {
            var hashedPassword = HashPassword(dto.PasswordHash);

            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("sp_RegisterUser", conn) { CommandType = CommandType.StoredProcedure };

            cmd.Parameters.AddWithValue("@UserName", dto.UserName);
            cmd.Parameters.AddWithValue("@Email", dto.Email);
            cmd.Parameters.AddWithValue("@PasswordHash", hashedPassword);
            cmd.Parameters.AddWithValue("@RoleId", dto.RoleId);

            conn.Open();
            var newId = cmd.ExecuteScalar();
            return Ok(new { UserId = newId });
        }
    }
}
