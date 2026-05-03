using Microsoft.EntityFrameworkCore;
using WaterIntakeTracker.Data;

var builder = WebApplication.CreateBuilder(args);

// services

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// allow react frontend to communicate
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            // common local development ports
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
        });
});

// in memory db
builder.Services.AddDbContext<WaterDbContext>(options =>
    options.UseInMemoryDatabase("WaterTrackerDB"));

var app = builder.Build();

// enable cors
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
