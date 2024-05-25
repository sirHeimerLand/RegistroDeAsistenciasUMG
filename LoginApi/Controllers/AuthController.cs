using Microsoft.AspNetCore.Mvc;
using LoginApi.Data;
using LoginApi.Models;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace LoginApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext context, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("crear")]
        public IActionResult CrearUsuario([FromBody] Usuario usuario)
        {
            if (_context.Usuarios.Any(u => u.NombreUsuario == usuario.NombreUsuario))
            {
                return BadRequest("El nombre de usuario ya existe.");
            }

            if (!ValidatePassword(usuario.Contrasena))
            {
                return BadRequest("La contraseña no cumple con los requisitos de complejidad.");
            }

            CreatePasswordHash(usuario.Contrasena, out byte[] passwordHash, out byte[] passwordSalt);
            usuario.Contrasena = Convert.ToBase64String(passwordHash);
            usuario.Salt = Convert.ToBase64String(passwordSalt);
            _context.Usuarios.Add(usuario);
            _context.SaveChanges();

            return Ok(new { message = "Usuario creado exitosamente" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Usuario usuario)
        {
            _logger.LogInformation("Intentando iniciar sesión para el usuario: {NombreUsuario}", usuario.NombreUsuario);

            var user = _context.Usuarios.SingleOrDefault(u => u.NombreUsuario == usuario.NombreUsuario);
            if (user == null)
            {
                _logger.LogWarning("Usuario no encontrado: {NombreUsuario}", usuario.NombreUsuario);
                return Unauthorized("Usuario o contraseña incorrectos.");
            }

            if (!VerifyPasswordHash(usuario.Contrasena, Convert.FromBase64String(user.Contrasena), Convert.FromBase64String(user.Salt)))
            {
                _logger.LogWarning("Contraseña incorrecta para el usuario: {NombreUsuario}", usuario.NombreUsuario);
                return Unauthorized("Usuario o contraseña incorrectos.");
            }

            _logger.LogInformation("Inicio de sesión exitoso para el usuario: {NombreUsuario}", usuario.NombreUsuario);

            var token = GenerateJwtToken(user);

            return Ok(new { token, rol = user.Rol });
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new HMACSHA512(storedSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(storedHash);
        }

        private bool ValidatePassword(string password)
        {
            var pattern = new Regex("^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$");
            return pattern.IsMatch(password);
        }

        private string GenerateJwtToken(Usuario user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("Trestristestigrestragantrigoenuntrigal2024"); // Cambia esto a tu clave secreta
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.NombreUsuario),
                    new Claim(ClaimTypes.Role, user.Rol)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
