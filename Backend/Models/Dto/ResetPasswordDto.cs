namespace AngularAuthAPI.Models.Dto
{
    public record ResetPasswordDto
    {
        public string Email { get; set; }
        public string EmailToken { get; set; }
         public string password { get; set; }
        public string confirmPassword { get; set; }
    }
}
