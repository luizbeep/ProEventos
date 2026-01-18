using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface IArtistaPersist
    {
        Task<Artista[]> GetAllEventosByNomeAsync(string nome, bool includeEventos);
        Task<Artista[]> GetAllArtistasAsync(string tema, bool includeEventos = false);
        Task<Artista[]> GetAllArtistasByIdAsync(int artistaId, bool includeEventos);
    }
}