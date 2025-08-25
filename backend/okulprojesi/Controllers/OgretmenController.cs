using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using okulprojesi.Data;
using okulprojesi.Entities;
using okulprojesi.Models;
using Microsoft.EntityFrameworkCore;

namespace okulprojesi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OgretmenController : ControllerBase
    {
        private readonly OkulDB _context;

        public OgretmenController(OkulDB context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<BaseResponseModel>> Get()
        {
            var response = new BaseResponseModel();
            try
            {
                var list = new List<Ogretmen>();

                using var conn = new SqlConnection(_context.Database.GetConnectionString());
                using var cmd = new SqlCommand("sp_OgretmenListele", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    list.Add(new Ogretmen
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
                        Name = reader.GetString(reader.GetOrdinal("name")),
                        Surname = reader.GetString(reader.GetOrdinal("surname")),
                        Tc = reader.GetString(reader.GetOrdinal("tc")),
                        Phone = reader.GetString(reader.GetOrdinal("phone")),
                        Email = reader.GetString(reader.GetOrdinal("email")),
                        DateOfBirth = reader.GetDateTime(reader.GetOrdinal("dateOfBirth")),
                        BransId = reader.GetInt32(reader.GetOrdinal("BransId"))

                    });
                }

                response.Status = true;
                response.Message = "Öğretmenler listelendi";
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
                using var conn = new SqlConnection(_context.Database.GetConnectionString());
                using var cmd = new SqlCommand("sp_OgretmenGetir", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@Id", id);

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    response.Status = false;
                    response.Message = "Öğretmen bulunamadı";
                    return NotFound(response);
                }

                var ogretmen = new Ogretmen
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    Name = reader.GetString(reader.GetOrdinal("name")),
                    Surname = reader.GetString(reader.GetOrdinal("surname")),
                    Tc = reader.GetString(reader.GetOrdinal("tc")),
                    Phone = reader.GetString(reader.GetOrdinal("phone")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    DateOfBirth = reader.GetDateTime(reader.GetOrdinal("dateOfBirth")),
                    BransId = reader.GetInt32(reader.GetOrdinal("BransId"))

                };

                response.Status = true;
                response.Message = "Öğretmen bulundu";
                response.Data = ogretmen;
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
        public async Task<ActionResult<BaseResponseModel>> Post([FromBody] CreativeOgretmenViewModel model)
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
                using var conn = new SqlConnection(_context.Database.GetConnectionString());
                using var cmd = new SqlCommand("sp_OgretmenEkle", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Name", model.Name);
                cmd.Parameters.AddWithValue("@Surname", model.Surname);
                cmd.Parameters.AddWithValue("@TC", model.Tc);
                cmd.Parameters.AddWithValue("@PhoneNumber", model.Phone);  // Burada dikkat!
                cmd.Parameters.AddWithValue("@Email", model.Email);
                cmd.Parameters.AddWithValue("@dateOfBirth", model.DateOfBirth);
                cmd.Parameters.AddWithValue("@BransId", model.BransId);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                response.Status = true;
                response.Message = "Öğretmen eklendi";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = ex.Message;
                return StatusCode(500, response);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponseModel>> Put(int id, [FromBody] CreativeOgretmenViewModel model)
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
                using var conn = new SqlConnection(_context.Database.GetConnectionString());
                using var cmd = new SqlCommand("sp_OgretmenGuncelle", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@Name", model.Name);
                cmd.Parameters.AddWithValue("@Surname", model.Surname);
                cmd.Parameters.AddWithValue("@TC", model.Tc);
                cmd.Parameters.AddWithValue("@Phone", model.Phone);
            
                cmd.Parameters.AddWithValue("@Email", model.Email);
                cmd.Parameters.AddWithValue("@dateOfBirth", model.DateOfBirth);
                cmd.Parameters.AddWithValue("@BransId", model.BransId);

                await conn.OpenAsync();
                var affected = await cmd.ExecuteNonQueryAsync();

                if (affected == 0)
                {
                    response.Status = false;
                    response.Message = "Güncellenecek öğretmen bulunamadı";
                    return NotFound(response);
                }

                response.Status = true;
                response.Message = "Öğretmen güncellendi";
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
                using var conn = new SqlConnection(_context.Database.GetConnectionString());
                using var cmd = new SqlCommand("sp_OgretmenSil", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Id", id);

                await conn.OpenAsync();
                var affected = await cmd.ExecuteNonQueryAsync();

                if (affected == 0)
                {
                    response.Status = false;
                    response.Message = "Silinecek öğretmen bulunamadı";
                    return NotFound(response);
                }

                response.Status = true;
                response.Message = "Öğretmen silindi";
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
                using var cmd = new SqlCommand("sp_OgretmenGetirByTC", conn);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@TC", tc);

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                var teachers = new List<Ogretmen>();
                while (await reader.ReadAsync())
                {
                    teachers.Add(new Ogretmen
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
                        Name = reader.GetString(reader.GetOrdinal("Name")),
                        Surname = reader.GetString(reader.GetOrdinal("Surname")),
                        Tc = reader.GetString(reader.GetOrdinal("Tc")),
                        Phone = reader.GetString(reader.GetOrdinal("Phone")),
                        Email = reader.GetString(reader.GetOrdinal("Email")),
                        DateOfBirth = reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                        BransId = reader.GetInt32(reader.GetOrdinal("BransId"))
                    });
                }

                if (!teachers.Any())
                {
                    response.Status = false;
                    response.Message = "TC ile eşleşen öğretmen bulunamadı";
                    return NotFound(response);
                }

                response.Status = true;
                response.Message = "Öğretmenler bulundu";
                response.Data = teachers.OrderBy(t => t.Tc).ToList(); // sıralı
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = ex.Message;
                return StatusCode(500, response);
            }
        }


    }
}
