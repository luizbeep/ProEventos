using System.Reflection.PortableExecutable;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contextos
{
    public class ProEventosContext : DbContext
    {
        public ProEventosContext(DbContextOptions<ProEventosContext> options) : base(options) { }
        public DbSet<Evento> Eventos { get; set; } = null!;
        public DbSet<Lote> Lotes { get; set; } = null!;
        public DbSet<Artista> Artistas { get; set; } = null!;
        public DbSet<ArtistaEvento> ArtistasEventos { get; set; } = null!;
        public DbSet<RedeSocial> RedeSociais { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ArtistaEvento>()
                .HasKey(AE => new {AE.EventoId, AE.ArtistaId});

            modelBuilder.Entity<Evento>()
                .HasMany(e => e.RedesSociais)
                .WithOne(rs => rs.Evento)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Artista>()
                .HasMany(e => e.RedesSociais)
                .WithOne(rs => rs.Artista)
                .OnDelete(DeleteBehavior.Cascade);

        }

        

        


    }
}
