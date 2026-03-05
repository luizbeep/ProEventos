using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain.Identity;

namespace ProEventos.Domain
{
    public class Artista
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }        
        public string Descricao { get; set; }
        public string ImagemURL { get; set; }
        public IEnumerable<RedeSocial> RedesSociais { get; set; }
        public IEnumerable<ArtistaEvento> ArtistasEvento { get; set; }


    }
}