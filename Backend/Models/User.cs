using System.ComponentModel.DataAnnotations;

namespace AngularAuthAPI.Models
{
    public class User
    {
        [Key]
        public int id   { get; set; }

        public string? fname { get; set; }

        public string? lname { get; set; }

        public string? gender { get; set; }

        public DateOnly? dob { get; set; }

        public string? address { get; set; }

        public decimal? phonenum { get; set; }

        public string? pfp { get; set; }

        public string? Country { get; set; }
        public string? City { get; set; }


        public string? State { get; set; }


        public string? email { get; set; }

        public string? password { get; set; }

   

        public string? Role { get; set; }

        public string? Token { get; set; }

        public string? ResetPasswordToken { get; set; }

        private DateTime resetPasswordExpiry;
   

        public DateTime ResetPasswordExpiry
        {
            get { return resetPasswordExpiry; }
            set { resetPasswordExpiry = value.ToUniversalTime(); }
        }


        public DateTime RegistrationDate { get; set; }

        public class UserRegistrationData
        {
            public DateTime Date { get; set; }
            public int RegisteredUsers { get; set; }
        }

    }


  
   
}