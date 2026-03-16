using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ProEventos.API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserName(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value 
                ?? user.FindFirst("unique_name")?.Value 
                ?? string.Empty;
        }

        public static int GetUserId(this ClaimsPrincipal user)
        {
            try
            {
                // Tenta encontrar o claim do ID
                var idClaim = user.FindFirst(ClaimTypes.NameIdentifier) 
                    ?? user.FindFirst("nameid")
                    ?? user.FindFirst("sub")
                    ?? user.FindFirst("id");

                if (idClaim == null || string.IsNullOrEmpty(idClaim.Value))
                    return 0;

                // Tenta converter para inteiro
                if (int.TryParse(idClaim.Value, out int userId))
                    return userId;

                return 0;
            }
            catch
            {
                return 0;
            }
        }
    }
}