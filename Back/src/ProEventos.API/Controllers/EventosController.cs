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
        
[AllowAnonymous]
[HttpGet("test-headers")]
public IActionResult TestHeaders()
{
    var headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());
    return Ok(headers);
}

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(User.GetUserId(), true);
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

        
        [HttpGet("{tema}/tema")]
        public async Task <IActionResult> GetByTema(string tema)
        {   
            try
            {
                var evento = await _eventoService.GetAllEventosByTemaAsync(User.GetUserId(), tema, true);
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
            // Listar headers para debug
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



[HttpGet("debug-claims")]
public IActionResult DebugClaims()
{
    var claims = User.Claims.Select(c => new 
    { 
        c.Type, 
        c.Value,
        c.ValueType 
    }).ToList();
    
    return Ok(new 
    { 
        isAuthenticated = User.Identity.IsAuthenticated,
        claims = claims
    });
}

[AllowAnonymous]
[HttpGet("debug/validate-token")]  // Rota mais específica
public async Task<IActionResult> DebugTokenValidation()
{
    try
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        
        if (string.IsNullOrEmpty(token))
        {
            return Ok(new { error = "Token não fornecido" });
        }
        
        // PEGAR A CHAVE DO APPSETTINGS.JSON
        var tokenKey = _configuration["TokenKey"];
        if (string.IsNullOrEmpty(tokenKey))
        {
            return Ok(new { error = "TokenKey não configurada no appsettings.json" });
        }
        
        Console.WriteLine($"TokenKey encontrada: {tokenKey.Substring(0, 5)}... (tamanho: {tokenKey.Length})");
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
        
        try
        {
            // Validar o token recebido
            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            
            var claims = principal.Claims.Select(c => new { c.Type, c.Value });
            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = principal.FindFirst(ClaimTypes.Name)?.Value;
            
            Console.WriteLine($"✅ Token válido! UserId: {userId}, UserName: {userName}");
            
            // Verificar se é um JwtSecurityToken para acessar propriedades específicas
            string algorithm = "Desconhecido";
            if (validatedToken is JwtSecurityToken jwtToken)
            {
                algorithm = jwtToken.SignatureAlgorithm;
            }
            
            return Ok(new
            {
                success = true,
                message = "Token VÁLIDO!",
                userId = userId,
                userName = userName,
                claims = claims,
                tokenInfo = new
                {
                    algorithm = algorithm,
                    validFrom = validatedToken.ValidFrom,
                    validTo = validatedToken.ValidTo
                }
            });
        }
        catch (SecurityTokenExpiredException ex)
        {
            Console.WriteLine($"❌ Token expirado: {ex.Message}");
            return Ok(new
            {
                success = false,
                message = "Token EXPIRADO",
                error = ex.Message
            });
        }
        catch (SecurityTokenInvalidSignatureException ex)
        {
            Console.WriteLine($"❌ Assinatura inválida: {ex.Message}");
            return Ok(new
            {
                success = false,
                message = "Assinatura do token inválida",
                error = ex.Message
            });
        }
        catch (SecurityTokenException ex)
        {
            Console.WriteLine($"❌ Token inválido: {ex.Message}");
            return Ok(new
            {
                success = false,
                message = "Token INVÁLIDO",
                error = ex.Message
            });
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erro geral: {ex.Message}");
        return Ok(new
        {
            success = false,
            error = ex.Message
        });
    }
}


[HttpGet("debug-token")]
public IActionResult DebugToken()
{
    var token = Request.Headers["Authorization"].ToString();
    Console.WriteLine($"Token recebido: {token}");
    
    return Ok(new
    {
        isAuthenticated = User.Identity?.IsAuthenticated,
        authenticationType = User.Identity?.AuthenticationType,
        userId = User.GetUserId(),
        userName = User.GetUserName(),
        claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList(),
        tokenHeader = token
    });
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
                
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), eventoId, true);
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
                var eventoAtualizado = await _eventoService.UpdateEvento(User.GetUserId(), eventoId, evento);
                
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