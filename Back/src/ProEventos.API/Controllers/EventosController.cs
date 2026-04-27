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
using ProEventos.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ProEventos.Persistence.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {

        private readonly IEventoService _eventoService;

        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IAccountService _accountService;
                private readonly IConfiguration _configuration; // ADICIONADO


        public EventosController(IEventoService eventoService, 
                                 IWebHostEnvironment hostEnvironment,
                                 IAccountService accountService, IConfiguration configuration)
        {
            _eventoService = eventoService;
            _hostEnvironment = hostEnvironment;
            _accountService = accountService;
                        _configuration = configuration; // ADICIONADO

        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery]PageParams pageParams)
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(User.GetUserId(), pageParams, true);
                if (eventos == null) return NoContent();

                Response.AddPagination(eventos.CurrentPage, eventos.PageSize, eventos.TotalCount, eventos.TotalPages);

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
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id, true);
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
                Console.WriteLine("=== NOVO POST ===");
                Console.WriteLine($"User.Identity.IsAuthenticated: {User.Identity?.IsAuthenticated}");
                
                var userId = User.GetUserId();
                Console.WriteLine($"UserId retornado pelo extension: {userId}");
                
                if (userId == 0)
                {
                    Console.WriteLine("Headers da requisição:");
                    foreach (var header in Request.Headers)
                    {
                        Console.WriteLine($"  {header.Key}: {header.Value}");
                    }
                    
                    return Unauthorized(new { 
                        error = "Usuário não autenticado. Faça login novamente.",
                        details = "UserId não encontrado no token"
                    });
                }
                
                var evento = await _eventoService.AddEventos(userId, model);
                
                if(evento == null) return NoContent();

                return Ok(evento);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO NO POST: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"INNER: {ex.InnerException.Message}");
                }
                
                return StatusCode(500, new { 
                    error = "Erro ao criar evento", 
                    details = ex.Message 
                });
            }    
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Put(int id, EventoDto model)
        {
            try
            {
                var evento = await _eventoService.UpdateEvento(User.GetUserId(), id, model);
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
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id, true);
                if (evento == null) return NoContent();

                if (await _eventoService.DeleteEvento(User.GetUserId(), id))
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