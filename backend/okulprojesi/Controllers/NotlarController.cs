using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;
using okulprojesi.Models; // NotEkleDto burada olsun

namespace okulprojesi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotlarController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly string _connString;

        public NotlarController(IConfiguration config)
        {
            _config = config;
            _connString = _config.GetConnectionString("OkulDb");
        }

        [HttpPost("ekle")]
        public IActionResult NotEkle([FromBody] NotEkleDto dto)
        {
            using var conn = new SqlConnection(_connString);
            using var cmd = new SqlCommand("sp_AddNotVeDurum", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@OgrenciId", dto.OgrenciId);
            cmd.Parameters.AddWithValue("@OgretmenId", dto.OgretmenId);
            cmd.Parameters.AddWithValue("@BransId", dto.BransId);
            cmd.Parameters.AddWithValue("@Sinav1", dto.Sinav1.HasValue ? (object)dto.Sinav1.Value : DBNull.Value);
            cmd.Parameters.AddWithValue("@Sinav2", dto.Sinav2.HasValue ? (object)dto.Sinav2.Value : DBNull.Value);
            cmd.Parameters.AddWithValue("@Sozlu1", dto.Sozlu1.HasValue ? (object)dto.Sozlu1.Value : DBNull.Value);
            cmd.Parameters.AddWithValue("@Sozlu2", dto.Sozlu2.HasValue ? (object)dto.Sozlu2.Value : DBNull.Value);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                var ortalama = reader.IsDBNull(reader.GetOrdinal("Ortalama"))
                    ? (decimal?)null
                    : reader.GetDecimal(reader.GetOrdinal("Ortalama"));
                var durum = reader.IsDBNull(reader.GetOrdinal("Durum"))
                    ? null
                    : reader.GetString(reader.GetOrdinal("Durum"));

                return Ok(new
                {
                    Ortalama = ortalama,
                    Durum = durum
                });
            }

            return BadRequest("Not eklenirken hata oluştu.");
        }
    }
}
