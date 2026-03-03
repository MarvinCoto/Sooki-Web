import nodemailer from "nodemailer";
import { config } from "../config.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

export const sendVerificationEmail = async (toEmail, storeName, code) => {
    const mailOptions = {
        from: `"Sooki" <${config.email.user}>`,
        to: toEmail,
        subject: "Verifica tu cuenta - Sooki",
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Verificacion de cuenta</title>
        </head>
        <body style="margin:0;padding:0;background-color:#F2F5F8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F5F8;padding:40px 0;">
                <tr>
                    <td align="center">
                        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(27,43,68,0.10);">
                            
                            <!-- Header -->
                            <tr>
                                <td style="background-color:#1B2B44;padding:32px 40px;text-align:center;">
                                    <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">SOOKI</h1>
                                    <p style="margin:6px 0 0;color:#a0b0c8;font-size:13px;">Plataforma de tiendas en linea</p>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding:40px 40px 32px;">
                                    <p style="margin:0 0 8px;font-size:15px;color:#6b7a99;">Hola,</p>
                                    <h2 style="margin:0 0 20px;font-size:22px;color:#1B2B44;font-weight:700;">Verifica tu cuenta para <span style="color:#FF8C42;">${storeName}</span></h2>
                                    <p style="margin:0 0 28px;font-size:14px;color:#6b7a99;line-height:1.6;">
                                        Gracias por registrarte en Sooki. Para completar tu registro e iniciar sesion, ingresa el siguiente codigo de verificacion en la pantalla correspondiente.
                                    </p>

                                    <!-- Code box -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                        <tr>
                                            <td align="center">
                                                <div style="display:inline-block;background-color:#F2F5F8;border:2px solid #1B2B44;border-radius:10px;padding:20px 48px;">
                                                    <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#1B2B44;">${code}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Warning -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff5ee;border-left:4px solid #FF8C42;border-radius:0 8px 8px 0;margin-bottom:28px;">
                                        <tr>
                                            <td style="padding:14px 18px;">
                                                <p style="margin:0;font-size:13px;color:#1B2B44;">
                                                    Este codigo expira en <strong>30 minutos</strong>. Si no solicitaste este registro, puedes ignorar este correo.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin:0;font-size:13px;color:#a0b0c8;line-height:1.6;">
                                        Si tienes algún problema con tu cuenta, contacta a nuestro equipo de soporte.
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color:#F2F5F8;padding:20px 40px;text-align:center;border-top:1px solid #d1dae6;">
                                    <p style="margin:0;font-size:12px;color:#a0b0c8;">
                                        Sooki - Todos los derechos reservados
                                    </p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};