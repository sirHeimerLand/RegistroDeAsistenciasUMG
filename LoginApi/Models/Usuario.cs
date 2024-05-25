namespace LoginApi.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public string Contrasena { get; set; } = string.Empty;
        public string Salt { get; set; } = string.Empty; // Asegúrate de que esta línea está presente
        public string Rol { get; set; } = string.Empty;
        public string NumeroTelefono { get; set; } = string.Empty;
    }
}
