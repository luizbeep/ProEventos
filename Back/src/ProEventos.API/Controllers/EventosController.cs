using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.Persistence;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Application.Contratos;
using ProEventos.Application;
using ProEventos.Application.Dtos;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {

        private readonly IEventoService _eventoService;

        private readonly IWebHostEnvironment _hostEnvironment;


        public EventosController(IEventoService eventoService, IWebHostEnvironment hostEnvironment)
        {
            _eventoService = eventoService;
            _hostEnvironment = hostEnvironment;
            
        }


        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(true);
                if(eventos == null) return NoContent();

                return Ok(eventos);

            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task <IActionResult> GetById(int id)
        {   
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(id, true);
                if(evento == null) return NoContent();
                
                return Ok(evento);

            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }        
        }

        
        [HttpGet("{tema}/tema")]
        public async Task <IActionResult> GetByTema(string tema)
        {   
            try
            {
                var evento = await _eventoService.GetAllEventosByTemaAsync(tema, true);
                if(evento == null) return NoContent();

                return Ok(evento);

            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }        
        }

        [HttpPost]

        public async Task<IActionResult> Post(EventoDto model)
        {   
            try
            {
                var evento = await _eventoService.AddEventos(model);
                if(evento == null) return NoContent();

                return Ok(evento);

            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar adicionar eventos. Erro: {ex.Message}");
            }    
        }

        [HttpPost("upload-image/{eventoId}")]
        public async Task<IActionResult> UploadImage(int eventoId)
        {   
            try
            {
                if (Request.Form.Files.Count == 0)
                {
                    return BadRequest("Sem arquivo");
                }

                var file = Request.Form.Files[0];
                Console.WriteLine($"Arquivo: {file.FileName} - {file.Length} bytes");
                
                var evento = await _eventoService.GetEventoByIdAsync(eventoId, true);
                if(evento == null) 
                {
                    return NotFound("Evento não encontrado");
                }

                if (!string.IsNullOrEmpty(evento.ImagemURL))
                {
                    DeleteImage(evento.ImagemURL);
                }

                var novoNomeImagem = await SaveImage(file);
                
                if (string.IsNullOrEmpty(novoNomeImagem))
                {
                    return BadRequest("Erro ao salvar a imagem");
                }

                evento.ImagemURL = novoNomeImagem;
                var eventoAtualizado = await _eventoService.UpdateEvento(eventoId, evento);
                
                return Ok(eventoAtualizado);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpPut("{id:int}")]
        public async Task<ActionResult> Put(int id, EventoDto model)
        {
            try
            {
                var evento = await _eventoService.UpdateEvento(id, model);
                if(evento == null) return NoContent();

                return Ok(evento);

            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar atualizar eventos. Erro: {ex.Message}");
            }          
        }


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(id, true);
                if (evento == null) return NoContent();

                if (await _eventoService.DeleteEvento(id))
                {
                    DeleteImage(evento.ImagemURL);
                    return Ok(new { message = "Deletado" });
                }

                throw new Exception("Ocorreu um problema ao tentar deletar o evento em questão");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar deletar eventos. Erro: {ex.Message}");
            }
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new string(
                Path.GetFileNameWithoutExtension(imageFile.FileName)
                .Take(10)
                .ToArray()
            ).Replace(' ', '-');

            imageName = $"{imageName}{DateTime.UtcNow:yyMMddHHmmssfff}{Path.GetExtension(imageFile.FileName)}";

            var imagesFolder = Path.Combine(_hostEnvironment.ContentRootPath, "Resources", "Images");

            if (!Directory.Exists(imagesFolder))
                Directory.CreateDirectory(imagesFolder);

            var imagePath = Path.Combine(imagesFolder, imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return imageName;
        }  

       [NonAction]
        public void DeleteImage(string imageName)
        {
            if (string.IsNullOrEmpty(imageName)) return;

            var imagesFolder = Path.Combine(_hostEnvironment.ContentRootPath, "Resources", "Images");
            var imagePath = Path.Combine(imagesFolder, imageName);

            Console.WriteLine($"🗑️ Tentando deletar: {imagePath}");

            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
                Console.WriteLine("Imagem deletada");
            }
            else
            {
                Console.WriteLine("Arquivo não encontrado");
            }
        }

    }
}