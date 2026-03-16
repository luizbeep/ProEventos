using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain.Identity;

namespace ProEventos.Application
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private SymmetricSecurityKey _key;

        public TokenService(IConfiguration config,
                            UserManager<User> userManager,
                            IMapper mapper)
        {
            _config = config;
            _userManager = userManager;
            _mapper = mapper;
            
            var tokenKey = _config["TokenKey"];
            if (string.IsNullOrEmpty(tokenKey))
            {
                throw new Exception("TokenKey não configurada no appsettings.json");
            }
            
            if (tokenKey.Length < 32)
            {
                throw new Exception("TokenKey deve ter pelo menos 32 caracteres");
            }
            
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
            
            Console.WriteLine($"TokenService inicializado com chave de {tokenKey.Length} caracteres");
        }
        
        public async Task<string> CreateToken(UserUpdateDto userUpdateDto)
        {
            try
            {
                Console.WriteLine($"Criando token para usuário: {userUpdateDto.UserName}");
                
                // Buscar o usuário completo do banco
                var user = await _userManager.FindByNameAsync(userUpdateDto.UserName);
                if (user == null)
                {
                    throw new Exception($"Usuário {userUpdateDto.UserName} não encontrado");
                }
                
                Console.WriteLine($"Usuário encontrado com ID: {user.Id}");
                
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // "nameid": "3"
                    new Claim(ClaimTypes.Name, user.UserName)                  // "unique_name": "espectra"
                };

                var roles = await _userManager.GetRolesAsync(user);
                claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

                var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddDays(1),
                    SigningCredentials = creds
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);
                
                Console.WriteLine("Token criado com sucesso!");
                return tokenString;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao criar token: {ex.Message}");
                throw;
            }
        }
    }
}