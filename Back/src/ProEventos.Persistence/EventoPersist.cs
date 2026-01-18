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

        public async Task<Evento[]> GetAllEventosAsync(bool includeArtistas = false)
        {
            IQueryable<Evento> query = _context.Eventos.Include(e => e.lotes).Include(e => e.RedesSociais).AsNoTracking();

            if (includeArtistas)
            {
                query = query.Include(e => e.ArtistasEvento).ThenInclude(ae => ae.Artista);
            }

            query = query.OrderBy(e => e.Id);


            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includeArtistas = false)
        {
            IQueryable<Evento> query = _context.Eventos.Include(e => e.lotes).Include(e => e.RedesSociais).AsNoTracking()
;

            if (includeArtistas)
            {
                query = query.Include(e => e.ArtistasEvento).ThenInclude(ae => ae.Artista);
            }

            query = query.OrderBy(e => e.Id).Where(e => e.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();

            
        }

        public async Task<Evento> GetEventoByIdAsync(int eventoId, bool includeArtistas = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(e => e.lotes)
                .Include(e => e.RedesSociais);

            if (includeArtistas)
            {
                query = query.Include(e => e.ArtistasEvento).ThenInclude(ae => ae.Artista);
            }

            return await query.AsNoTracking().FirstOrDefaultAsync(e => e.Id == eventoId);
        }

    }
}