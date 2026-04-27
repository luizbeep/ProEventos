using System.Reflection.PortableExecutable;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Domain.Identity;

namespace ProEventos.Persistence.Contextos
{
    public class ProEventosContext : IdentityDbContext<User, Role, int, 
                                     IdentityUserClaim<int>, 
                                     UserRole, IdentityUserLogin<int>, 
                                     IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public ProEventosContext(DbContextOptions<ProEventosContext> options) : base(options) { }
        public DbSet<Evento> Eventos { get; set; } = null!;
        public DbSet<Lote> Lotes { get; set; } = null!;
        public DbSet<Artista> Artistas { get; set; } = null!;
        public DbSet<ArtistaEvento> ArtistasEventos { get; set; } = null!;
        public DbSet<RedeSocial> RedeSociais { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>(UserRole =>
                {
                UserRole.HasKey(ur => new {ur.UserId, ur.RoleId});

                UserRole.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();
                
                UserRole.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();                

                }
            );

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
