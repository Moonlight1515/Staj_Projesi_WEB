using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using okulprojesi.Data;
using okulprojesi.Entities;
using okulprojesi.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace okulprojesi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OgrenciController : ControllerBase
    {
        private readonly OkulDB _context;

        public OgrenciController(OkulDB context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<BaseResponseModel>> Get()
        {
            var response = new BaseResponseModel();
            try
            {
                var connStr = _context.Database.GetConnectionString();
                var list = new List<Ogrenci>();

                using var conn = new SqlConnection(connStr);
                using var cmd = new SqlCommand("sp_OgrenciListele", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    list.Add(new Ogrenci
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
                        FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                        Surname = reader.GetString(reader.GetOrdinal("Surname")),
                        TC = reader.GetString(reader.GetOrdinal("TC")),
                        Phone = reader.GetString(reader.GetOrdinal("Phone")),
                        Gender = reader.GetString(reader.GetOrdinal("Gender")),
                        DateOfBirth = reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                        SinifId = reader.GetInt32(reader.GetOrdinal("SinifId"))
                    });
                }

                response.Status = true;
                response.Message = "Öğrenciler listelendi";
                response.Data = list;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = ex.Message;
                return StatusCode(500, response);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponseModel>> Get(int id)
        {
            var response = new BaseResponseModel();
            try
            {
                var connStr = _context.Database.GetConnectionString();
                using var conn = new SqlConnection(connStr);
                using var cmd = new SqlCommand("sp_OgrenciGetir", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@Id", id);

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    response.Status = false;
                    response.Message = "Öğrenci bulunamadı";
                    return NotFound(response);
                }

                var ogrenci = new Ogrenci
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                    Surname = reader.GetString(reader.GetOrdinal("Surname")),
                    TC = reader.GetString(reader.GetOrdinal("TC")),
                    Phone = reader.GetString(reader.GetOrdinal("Phone")),
                    Gender = reader.GetString(reader.GetOrdinal("Gender")),
                    DateOfBirth = reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                    SinifId = reader.GetInt32(reader.GetOrdinal("SinifId"))
                };

                response.Status = true;
                response.Message = "Öğrenci bulundu";
                response.Data = ogrenci;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = ex.Message;
                return StatusCode(500, response);
            }
        }

        [HttpPost]
        public async Task<ActionResult<BaseResponseModel>> Post([FromBody] CreativeOgrenciViewModel model)
        {
            var response = new BaseResponseModel();

            if (!ModelState.IsValid)
            {
                response.Status = false;
                response.Message = "Geçersiz veri";
                return BadRequest(response);
            }

            try
            {
                var connStr = _context.Database.GetConnectionString();
                using var conn = new SqlConnection(connStr);
                using var cmd = new SqlCommand("sp_OgrenciEkle", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@FirstName", model.FirstName);
                cmd.Parameters.AddWithValue("@Surname", model.Surname);
                cmd.Parameters.AddWithValue("@TC", model.TC);
                cmd.Parameters.AddWithValue("@Phone", model.Phone);
                cmd.Parameters.AddWithValue("@Gender", model.Gender);
                cmd.Parameters.AddWithValue("@DateOfBirth", model.DateOfBirth);
                cmd.Parameters.AddWithValue("@SinifId", model.SinifId);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                response.Status = true;
                response.Message = "Öğrenci eklendi";
                return Ok(response);
            }
            catch (SqlException ex) 
            {
                response.Status = false;
                response.Message = ex.Message; 
                return BadRequest(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = "Bilinmeyen hata: " + ex.Message;
                return StatusCode(500, response);
            }
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponseModel>> Put(int id, [FromBody] CreativeOgrenciViewModel model)
        {
            var response = new BaseResponseModel();

            if (!ModelState.IsValid)
            {
                response.Status = false;
                response.Message = "Geçersiz veri";
                response.Data = ModelState;
                return BadRequest(response);
            }

            try
            {
                var connStr = _context.Database.GetConnectionString();
                using var conn = new SqlConnection(connStr);
                using var cmd = new SqlCommand("sp_OgrenciGuncelle", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@FirstName", model.FirstName);
                cmd.Parameters.AddWithValue("@Surname", model.Surname);
                cmd.Parameters.AddWithValue("@TC", model.TC);
                cmd.Parameters.AddWithValue("@Phone", model.Phone);
                cmd.Parameters.AddWithValue("@Gender", model.Gender);
                cmd.Parameters.AddWithValue("@DateOfBirth", model.DateOfBirth);
                cmd.Parameters.AddWithValue("@SinifId", model.SinifId);

                await conn.OpenAsync();
                var affected = await cmd.ExecuteNonQueryAsync();

                if (affected == 0)
                {
                    response.Status = false;
                    response.Message = "Güncellenecek öğrenci bulunamadı";
                    return NotFound(response);
                }

                response.Status = true;
                response.Message = "Öğrenci güncellendi";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = ex.Message;
                return StatusCode(500, response);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponseModel>> Delete(int id)
        {
            var response = new BaseResponseModel();

            try
            {
                var connStr = _context.Database.GetConnectionString();
                using var conn = new SqlConnection(connStr);
                using var cmd = new SqlCommand("sp_OgrenciSil", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Id", id);

                await conn.OpenAsync();
                var affected = await cmd.ExecuteNonQueryAsync();

                if (affected == 0)
                {
                    response.Status = false;
                    response.Message = "Silinecek öğrenci bulunamadı";
                    return NotFound(response);
                }

                response.Status = true;
                response.Message = "Öğrenci silindi";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = ex.Message;
                return StatusCode(500, response);
            }
        }

        [HttpGet("AraTc/{tc}")]
        public async Task<ActionResult<BaseResponseModel>> AraTc(string tc)
        {
            var response = new BaseResponseModel();

            if (string.IsNullOrWhiteSpace(tc) || tc.Length < 3)
            {
                response.Status = false;
                response.Message = "En az 3 karakter girilmelidir.";
                return BadRequest(response);
            }

            try
            {
                var connStr = _context.Database.GetConnectionString();
                using var conn = new SqlConnection(connStr);
                using var cmd = new SqlCommand("sp_OgrenciGetirByTC", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@TC", tc);

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                var students = new List<Ogrenci>();
                while (await reader.ReadAsync())
                {
                    students.Add(new Ogrenci
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
                        FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                        Surname = reader.GetString(reader.GetOrdinal("Surname")),
                        TC = reader.GetString(reader.GetOrdinal("TC")),
                        Phone = reader.GetString(reader.GetOrdinal("Phone")),
                        Gender = reader.GetString(reader.GetOrdinal("Gender")),
                        DateOfBirth = reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                        SinifId = reader.GetInt32(reader.GetOrdinal("SinifId"))
                    });
                }

                if (!students.Any())
                {
                    response.Status = false;
                    response.Message = "TC ile eşleşen öğrenci bulunamadı";
                    return NotFound(response);
                }

                response.Status = true;
                response.Message = "Öğrenciler bulundu";
                response.Data = students.OrderBy(s => s.TC).ToList(); // Sıralı
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = ex.Message;
                return StatusCode(500, response);
            }
        }


        [HttpGet("{ogrenciId}/notlar")]
        public async Task<IActionResult> GetOgrenciNotlari(int ogrenciId)
        {
            var connStr = _context.Database.GetConnectionString();
            var notlar = new List<object>();

            try
            {
                using var conn = new SqlConnection(connStr);
                using var cmd = new SqlCommand("dbo.sp_GetOgrenciNotlari", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@OgrenciId", ogrenciId);

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    notlar.Add(new
                    {
                        Id = reader["Id"],
                        BransAdi = reader["BransAdi"].ToString(),
                        Sinav1 = reader["Sinav1"] == DBNull.Value ? null : (int?)reader["Sinav1"],
                        Sinav2 = reader["Sinav2"] == DBNull.Value ? null : (int?)reader["Sinav2"],
                        Sozlu1 = reader["Sozlu1"] == DBNull.Value ? null : (int?)reader["Sozlu1"],
                        Sozlu2 = reader["Sozlu2"] == DBNull.Value ? null : (int?)reader["Sozlu2"],
                        Ortalama = reader["Ortalama"] == DBNull.Value ? null : (decimal?)reader["Ortalama"],
                        Durum = reader["Durum"].ToString(),
                        OgretmenAdi = reader["OgretmenAdi"].ToString(),
                        OgretmenSoyadi = reader["OgretmenSoyadi"].ToString()
                    });
                }

                return Ok(new { Status = true, Data = notlar });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Status = false, Message = ex.Message });
            }
        }
    }
}
