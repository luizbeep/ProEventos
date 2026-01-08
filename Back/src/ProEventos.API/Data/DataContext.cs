using Microsoft.EntityFrameworkCore;
using ProEventos.API.Models;

namespace ProEventos.API.Data
{
    public class DataContext : DbContext
    {
        // Construtor obrigatório para EF Core Design
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        // Suas entidades
        public DbSet<Evento> Eventos { get; set; } = null!;
    }
}
