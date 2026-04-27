using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Persistence.Models;
namespace ProEventos.Application.Contratos

{
    public interface IEventoPersist
    {
        Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includeArtistas = false);
        Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includeArtistas = false);
    }
}
