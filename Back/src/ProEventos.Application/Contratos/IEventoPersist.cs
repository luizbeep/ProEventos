using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Application.Contratos
{
    public interface IEventoPersist
    {
        Task<Evento[]> GetAllEventosByTemaAsync(int userId, string tema, bool includeArtistas = false);
        Task<Evento[]> GetAllEventosAsync(int userId, bool includeArtistas = false);
        Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includeArtistas = false);
    }
}
