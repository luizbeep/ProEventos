using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using AutoMapper;
using ProEventos.Persistence.Models;


namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;
        private readonly IMapper _mapper;

        public EventoService(
            IGeralPersist geralPersist,
            IEventoPersist eventoPersist,
            IMapper mapper)
        {
            _mapper = mapper;
            _eventoPersist = eventoPersist;
            _geralPersist = geralPersist;
        }

        public async Task<EventoDto> AddEventos(int userId, EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);
                evento.UserId = userId;
                _geralPersist.Add(evento);

                if (await _geralPersist.SaveChangesAsync())
                {
                    var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(userId, evento.Id, false);
                    return _mapper.Map<EventoDto>(eventoRetorno);
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> UpdateEvento(int userId, int eventoId, EventoDto model)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, false);
                if (evento == null) return null;

                model.Id = evento.Id;
                model.UserId = userId;

                _mapper.Map(model, evento);

                _geralPersist.Update(evento);

                if (await _geralPersist.SaveChangesAsync())
                {
                    var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(userId, evento.Id, false);
                    return _mapper.Map<EventoDto>(eventoRetorno);
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }



        public async Task<bool> DeleteEvento(int userId, int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, false);
                if(evento == null) throw new Exception("Evento para delete não encontrado");

                _geralPersist.Delete<Evento>(evento);

                return await _geralPersist.SaveChangesAsync();
            }
            catch (System.Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }


        public async Task<PageList<EventoDto>> GetAllEventosAsync(int userId, PageParams pageParams, bool includeArtistas = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(userId, pageParams, includeArtistas);
                if (eventos == null) return null;

                var eventosDto = _mapper.Map<List<EventoDto>>(eventos);

                var resultado = new PageList<EventoDto>(
                    eventosDto,
                    eventos.TotalCount,
                    eventos.CurrentPage,
                    eventos.PageSize
                );


                return resultado;


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


            public async Task<EventoDto> GetEventoByIdAsync(int userId, int eventoId, bool includeArtistas = false)
            {
                try
                {
                    var eventos = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, includeArtistas);
                    if (eventos == null) return null;

                    var resultado = _mapper.Map<EventoDto>(eventos);

                    return resultado;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }

    }
}