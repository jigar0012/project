using System; 

namespace AngularAuthAPI.Helpers
{
    public static class EmailBody
    {
        public static string EmailStringBody(string email, string emailToken)
        {
            return $@"<html>
        <head>
    </head>
    <body style=""margin:0;padding:;font-family:Arial,Helvetica,sans-serif:"">
    <div style=""height:auto;background:white;padding:30px"">
<div>
    <div>
    <h1>Reset Your Password</h1>
    <hr>
    <p>hello,you're receiving this e-mail because you requested a password reset for your account.</p>
    
    <p>Please tap the button below to choose a new password.</p>
    
    <a href =""http://localhost:4200/rp?email={email}&code={emailToken}"" target=""_blank"" style=""background:#000000;padding:10px;border:none;
    color:white;border-radus:4px;display:block;margin:0 auto;width:50%;text-align:center;text-decoration:none"">Reset Password</a><br>

    <p>Kind Regards,<br><br>
    Jigar Shankhpal</p>
    </div>
    </div>
    </div>
    </body>
    </html>";
        }
    }
}
