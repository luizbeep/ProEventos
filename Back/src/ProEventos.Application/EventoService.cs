using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Application.Contratos;


namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;
        public EventoService(IGeralPersist geralPersist, IEventoPersist eventoPersist)
        {
            _eventoPersist = eventoPersist;
            _geralPersist = geralPersist;
        }
        public async Task<Evento> AddEventos(Evento model)
        {
            try
            {
                _geralPersist.Add<Evento>(model);
                if (await _geralPersist.SaveChangesAsync())
                {
                    return await _eventoPersist.GetEventoByIdAsync(model.Id, false);
                }
                return null;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<Evento> UpdateEvento(int eventoId, Evento model)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if(evento == null) return null;

                model.Id = evento.Id;

                _geralPersist.Update(model);

                if (await _geralPersist.SaveChangesAsync())
                {
                    return await _eventoPersist.GetEventoByIdAsync(model.Id, false);
                }
                return null;
            }
            catch (System.Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }


        public async Task<bool> DeleteEvento(int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if(evento == null) throw new Exception("Evento para delete não encontrado");

                _geralPersist.Delete<Evento>(evento);

                return await _geralPersist.SaveChangesAsync();
            }
            catch (System.Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }


        public async Task<Evento[]> GetAllEventosAsync(bool includeArtistas = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(includeArtistas);
                if(eventos == null) return null;

                return eventos;
            }
            catch (System.Exception ex)
            {
                throw new Exception(ex.Message);
            }        
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includeArtistas = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosByTemaAsync(tema, includeArtistas);
                if(eventos == null) return null;

                return eventos;
            }
            catch (System.Exception ex)
            {
                throw new Exception(ex.Message);
            }               
        }

        public async Task<Evento> GetEventoByIdAsync(int eventoId, bool includeArtistas = false)
        {
            try
            {
                return await _eventoPersist.GetEventoByIdAsync(eventoId, includeArtistas);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

     }
}