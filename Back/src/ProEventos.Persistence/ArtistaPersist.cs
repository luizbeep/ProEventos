using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
        public class ArtistaPersist : IArtistaPersist
        {
        private readonly ProEventosContext _context;
        public ArtistaPersist(ProEventosContext context)
        {
            _context = context;
        }
        public async Task<Artista[]> GetAllArtistasAsync(string tema, bool includeEventos = false)
        {
            IQueryable<Artista> query = _context.Artistas.Include(a => a.RedesSociais).AsNoTracking();

            if (includeEventos)
            {
                query = query.Include(a => a.ArtistasEvento).ThenInclude(ae => ae.Evento);
            }

            query = query.OrderBy(a => a.Id);


            return await query.ToArrayAsync();
        }

        public async Task<Artista> GetAllArtistasByIdAsync(int ArtistaId, bool includeEventos)
        {
            IQueryable<Artista> query = _context.Artistas.Include(a => a.RedesSociais).AsNoTracking();

            if (includeEventos)
            {
                query = query.Include(a => a.ArtistasEvento).ThenInclude(ae => ae.Evento);
            }

            query = query.OrderBy(a => a.Id).Where(a => a.Id == ArtistaId);


            return await query.FirstOrDefaultAsync();
        }


        public async Task<Artista[]> GetAllArtistasByNomeAsync(string nome, bool includeEventos)
        {
            IQueryable<Artista> query = _context.Artistas.Include(a => a.RedesSociais).AsNoTracking();

            if (includeEventos)
            {
                query = query.Include(a => a.ArtistasEvento).ThenInclude(ae => ae.Evento);
            }

            query = query.OrderBy(a => a.Id)
            .Where(a => a.User.PrimeiroNome.ToLower().Contains(nome.ToLower()));


            return await query.ToArrayAsync();
        }

        Task<Artista[]> IArtistaPersist.GetAllArtistasByIdAsync(int ArtistaId, bool includeEventos)
        {
            throw new NotImplementedException();
        }

        public Task<Artista[]> GetAllEventosByNomeAsync(string tema, bool includeEventos)
        {
            throw new NotImplementedException();
        }
    }
}