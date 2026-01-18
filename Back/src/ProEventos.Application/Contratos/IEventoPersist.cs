using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Application.Contratos
{
    public interface IEventoPersist
    {
        Task<Evento> GetEventoByIdAsync(int eventoId, bool includeArtistas = false);

        Task<Evento[]> GetAllEventosAsync(bool includeArtistas = false);
        Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includeArtistas = false);
    }
}
