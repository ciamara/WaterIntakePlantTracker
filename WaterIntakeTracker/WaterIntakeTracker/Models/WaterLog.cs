using System;

namespace WaterIntakeTracker.Models
{
    public class WaterLog
    {
        public int Id { get; set; }
        public int AmountMl { get; set; }
        public DateTime Timestamp { get; set; }
    }
}