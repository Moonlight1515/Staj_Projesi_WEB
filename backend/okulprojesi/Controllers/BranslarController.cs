using Microsoft.AspNetCore.Mvc;
using okulprojesi.Data;
using System.Linq;

namespace okulprojesi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BranslarController : ControllerBase
    {
        private readonly OkulDB _context;

        public BranslarController(OkulDB context)
        { 
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var branslar = _context.Branslar
                .Select(b => new { b.Id, b.Name })
                .ToList();

            return Ok(new { status = true, data = branslar });
        }
    }
}
