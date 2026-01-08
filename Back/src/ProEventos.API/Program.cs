using Microsoft.EntityFrameworkCore;
using ProEventos.API.Data;

var builder = WebApplication.CreateBuilder(args);

// =====================
// Services
// =====================

// Registrar o DbContext com SQLite
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("Default"));
});

// 🔹 CORS (ADICIONADO)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// =====================
// Pipeline
// =====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🔹 CORS (ADICIONADO — posição correta)
app.UseCors("AllowAngular");

app.UseAuthorization();
app.MapControllers();

app.Run();
