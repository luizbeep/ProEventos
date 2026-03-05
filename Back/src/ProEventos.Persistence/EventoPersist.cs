using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using Microsoft.EntityFrameworkCore;
using ProEventos.Application.Contratos;




namespace ProEventos.Persistence
{
        public class EventoPersist : IEventoPersist
        {
        private readonly ProEventosContext _context;
        public EventoPersist(ProEventosContext context)
        {
            _context = context;
        }

        public async Task<Evento[]> GetAllEventosAsync(int userId, bool includeArtistas = false)
        {
            IQueryable<Evento> query = _context.Eventos.Include(e => e.lotes).Include(e => e.RedesSociais).AsNoTracking();

            if (includeArtistas)
            {
                query = query.Include(e => e.ArtistasEvento).ThenInclude(ae => ae.Artista);
            }

            query = query.Where(e => e.UserId == userId).OrderBy(e => e.Id);


            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(int userId, string tema, bool includeArtistas = false)
        {
            IQueryable<Evento> query = _context.Eventos.Include(e => e.lotes).Include(e => e.RedesSociais).AsNoTracking()
;

            if (includeArtistas)
            {
                query = query.Include(e => e.ArtistasEvento).ThenInclude(ae => ae.Artista);
            }

            query = query.OrderBy(e => e.Id)
                         .Where(e => e.Tema.ToLower().Contains(tema.ToLower()) && 
                                     e.UserId == userId);
            return await query.ToArrayAsync();

            
        }

        public async Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includeArtistas = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(e => e.lotes)
                .Include(e => e.RedesSociais);

            if (includeArtistas)
            {
                query = query.Include(e => e.ArtistasEvento).ThenInclude(ae => ae.Artista);
            }

            return await query.AsNoTracking().FirstOrDefaultAsync(e => e.Id == eventoId && e.UserId == userId);
        }

    }
}