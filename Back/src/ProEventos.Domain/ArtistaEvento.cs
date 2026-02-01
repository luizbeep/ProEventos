using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Domain
{
    public class ArtistaEvento
    {
        public int ArtistaId { get; set; }
         public Evento? Evento { get; set; }

        public Artista? Artista { get; set; }
        public int EventoId { get; set; }
    }
}