using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Application.Contratos;


namespace ProEventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<Evento> AddEventos(Evento model);
        Task<Evento> UpdateEvento(int eventoId, Evento model);
        Task<bool> DeleteEvento(int eventoId);

        Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includeArtistas = false);
        Task<Evento[]> GetAllEventosAsync(bool includeArtistas = false);
        Task<Evento> GetEventoByIdAsync(int eventoId, bool includeArtistas = false);


    }
}