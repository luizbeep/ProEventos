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
        public class LotePersist : ILotePersist
        {
        private readonly ProEventosContext _context;
        public LotePersist(ProEventosContext context)
        {
            _context = context;
        }

        public async Task<Lote> GetLoteByIdsAsync(int eventoId, int loteId)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                            .Where(lote => lote.EventoId == eventoId
                                    && lote.Id == loteId);    

            return await query.FirstOrDefaultAsync();                        
        }

        public async Task<Lote[]> GetLotesByEventoIdAsync(int eventoId)
        {
            return await _context.Lotes
                .Where(l => l.EventoId == eventoId)
                .AsNoTracking()
                .ToArrayAsync();
        }


        public async Task<Lote[]> GetEventoByIdAsync(int eventoId)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                            .Where(lote => lote.EventoId == eventoId);

            return await query.ToArrayAsync(); 
        }

        Task<Lote> ILotePersist.GetEventoByIdAsync(int eventoId)
        {
            throw new NotImplementedException();
        }
    }
}