using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaterIntakeTracker.Data;
using WaterIntakeTracker.Models;

namespace WaterIntakeTracker.Controllers
{
    // /api/water
    [Route("api/[controller]")]
    [ApiController]
    public class WaterController : ControllerBase
    {
        private readonly WaterDbContext _context;

        public WaterController(WaterDbContext context)
        {
            _context = context;
        }

        // get api/water
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WaterLog>>> GetWaterLogs()
        {
            return await _context.WaterLogs
                .OrderByDescending(w => w.Timestamp)
                .ToListAsync();
        }

        // get api/water/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WaterLog>> GetWaterLog(int id)
        {
            var waterLog = await _context.WaterLogs.FindAsync(id);

            if (waterLog == null)
            {
                return NotFound();
            }

            return waterLog;
        }

        // post api/water
        [HttpPost]
        public async Task<ActionResult<WaterLog>> PostWaterLog(WaterLog waterLog)
        {
            // set timestamp
            waterLog.Timestamp = DateTime.UtcNow;

            _context.WaterLogs.Add(waterLog);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWaterLog), new { id = waterLog.Id }, waterLog);
        }

        // put api/water/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWaterLog(int id, WaterLog inputLog)
        {
            var log = await _context.WaterLogs.FindAsync(id);
            if (log == null)
            {
                return NotFound();
            }

            // update amount (keep timestamp)
            log.AmountMl = inputLog.AmountMl;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // delete api/water/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWaterLog(int id)
        {
            var waterLog = await _context.WaterLogs.FindAsync(id);
            if (waterLog == null)
            {
                return NotFound();
            }

            _context.WaterLogs.Remove(waterLog);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}