using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using okulprojesi.Entities;
using System.Data;

[Route("api/[controller]")]
[ApiController]
public class SinifController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public SinifController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private SqlConnection GetConnection()
    {
        return new SqlConnection(_configuration.GetConnectionString("OkulDb"));
    }

    [HttpGet]
    public IActionResult SinifListele()
    {
        var siniflar = new List<Sinif>();
        using (var conn = GetConnection())
        {
            using var cmd = new SqlCommand("sp_SinifListele", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                siniflar.Add(new Sinif
                {
                    Id = (int)reader["Id"],
                    Name = reader["Name"].ToString(),
                    OgrenciSayisi = (int)reader["OgrenciSayisi"]
                });
            }
        }
        return Ok(siniflar);
    }

    [HttpGet("{id}")]
    public IActionResult SinifGetir(int id)
    {
        Sinif sinif = null;
        using (var conn = GetConnection())
        {
            using var cmd = new SqlCommand("sp_SinifGetir", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Id", id);
            conn.Open();
            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                sinif = new Sinif
                {
                    Id = (int)reader["Id"],
                    Name = reader["Name"].ToString(),
                    OgrenciSayisi = (int)reader["OgrenciSayisi"]
                };
            }
        }
        return sinif != null ? Ok(sinif) : NotFound();
    }

    [HttpPost]
    public IActionResult SinifEkle([FromBody] Sinif sinif)
    {
        using var conn = GetConnection();
        using var cmd = new SqlCommand("sp_SinifEkle", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@Name", sinif.Name);
        conn.Open();
        cmd.ExecuteNonQuery();

        // Burada mutlaka bir JSON yanıt dön
        return Ok(new { message = "Sınıf başarıyla eklendi" });
    }


    [HttpPut("{id}")]
    public IActionResult SinifGuncelle(int id, [FromBody] Sinif sinif)
    {
        using var conn = GetConnection();
        using var cmd = new SqlCommand("sp_SinifGuncelle", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@Name", sinif.Name);
        conn.Open();
        cmd.ExecuteNonQuery();
        return Ok();
    }

    [HttpDelete("{id}")]
    public IActionResult SinifSil(int id)
    {
        using var conn = GetConnection();
        using var cmd = new SqlCommand("sp_SinifSil", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@Id", id);
        conn.Open();
        cmd.ExecuteNonQuery();
        return Ok();
    }
}
