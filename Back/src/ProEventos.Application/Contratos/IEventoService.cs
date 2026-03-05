using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;


namespace ProEventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<EventoDto> AddEventos(int userId, EventoDto model);
        Task<EventoDto> UpdateEvento(int userId, int eventoId, EventoDto model);
        Task<bool> DeleteEvento(int userId, int eventoId);

        Task<EventoDto[]> GetAllEventosByTemaAsync(int userId, string tema, bool includeArtistas = false);
        Task<EventoDto[]> GetAllEventosAsync(int userId, bool includeArtistas = false);
        Task<EventoDto> GetEventoByIdAsync(int userId, int eventoId, bool includeArtistas = false);


    }
}