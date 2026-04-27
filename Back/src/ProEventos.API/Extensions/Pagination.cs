using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ProEventos.API.Models;

namespace ProEventos.API.Extensions
{
    public static class Pagination
    {
        public static void AddPagination(this HttpResponse response,
            int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var pagination = new PaginationHeader(
                currentPage, itemsPerPage, totalItems, totalPages);
            
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var paginationHeader = JsonSerializer.Serialize(pagination, options);
            
            // Adiciona o cabeçalho de paginação
            response.Headers.Append("Pagination", paginationHeader);
            
            // Expõe o cabeçalho para o frontend
            response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
        }
    }
}