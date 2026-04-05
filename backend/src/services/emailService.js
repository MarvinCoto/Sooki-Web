import nodemailer from "nodemailer";
import { config } from "../config.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});



// Correo de verificacion de codigo de 6 digitos
export const sendVerificationEmail = async (toEmail, storeName, code) => {
    await transporter.sendMail({
        from: `"Sooki" <${config.email.user}>`,
        to: toEmail,
        subject: "Verifica tu correo - Sooki",
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"/></head>
        <body style="margin:0;padding:0;background-color:#F2F5F8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F5F8;padding:40px 0;">
                <tr><td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(27,43,68,0.10);">
                        <tr>
                            <td style="background-color:#1B2B44;padding:32px 40px;text-align:center;">
                                <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">SOOKI</h1>
                                <p style="margin:6px 0 0;color:#a0b0c8;font-size:13px;">Plataforma de tiendas en linea</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:40px 40px 32px;">
                                <p style="margin:0 0 8px;font-size:15px;color:#6b7a99;">Hola,</p>
                                <h2 style="margin:0 0 20px;font-size:22px;color:#1B2B44;font-weight:700;">Verifica tu correo para <span style="color:#FF8C42;">${storeName}</span></h2>
                                <p style="margin:0 0 28px;font-size:14px;color:#6b7a99;line-height:1.6;">
                                    Gracias por tu solicitud. Ingresa el siguiente codigo para verificar tu correo electronico.
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                    <tr><td align="center">
                                        <div style="display:inline-block;background-color:#F2F5F8;border:2px solid #1B2B44;border-radius:10px;padding:20px 48px;">
                                            <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#1B2B44;">${code}</span>
                                        </div>
                                    </td></tr>
                                </table>
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff5ee;border-left:4px solid #FF8C42;border-radius:0 8px 8px 0;margin-bottom:28px;">
                                    <tr><td style="padding:14px 18px;">
                                        <p style="margin:0;font-size:13px;color:#1B2B44;">
                                            Este codigo expira en <strong>30 minutos</strong>. Si no solicitaste este registro, puedes ignorar este correo.
                                        </p>
                                    </td></tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:#F2F5F8;padding:20px 40px;text-align:center;border-top:1px solid #d1dae6;">
                                <p style="margin:0;font-size:12px;color:#a0b0c8;">Sooki - Todos los derechos reservados</p>
                            </td>
                        </tr>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>
        `,
    });
};
 
// Correo de solicitud recibida — pantalla de espera
export const sendPendingApprovalEmail = async (toEmail, storeName) => {
    await transporter.sendMail({
        from: `"Sooki" <${config.email.user}>`,
        to: toEmail,
        subject: "Solicitud recibida - Sooki",
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"/></head>
        <body style="margin:0;padding:0;background-color:#F2F5F8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F5F8;padding:40px 0;">
                <tr><td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(27,43,68,0.10);">
                        <tr>
                            <td style="background-color:#1B2B44;padding:32px 40px;text-align:center;">
                                <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">SOOKI</h1>
                                <p style="margin:6px 0 0;color:#a0b0c8;font-size:13px;">Plataforma de tiendas en linea</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:40px 40px 32px;">
                                <h2 style="margin:0 0 16px;font-size:22px;color:#1B2B44;font-weight:700;">Solicitud recibida</h2>
                                <p style="margin:0 0 16px;font-size:14px;color:#6b7a99;line-height:1.6;">
                                    Hemos recibido la solicitud de registro para la tienda <strong style="color:#1B2B44;">${storeName}</strong>. Nuestro equipo revisara la informacion proporcionada.
                                </p>
                                <p style="margin:0 0 28px;font-size:14px;color:#6b7a99;line-height:1.6;">
                                    Una vez que tu solicitud sea aprobada, recibiras un correo con los pasos para configurar tu cuenta y comenzar a vender.
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F5F8;border-left:4px solid #1B2B44;border-radius:0 8px 8px 0;">
                                    <tr><td style="padding:14px 18px;">
                                        <p style="margin:0;font-size:13px;color:#1B2B44;">
                                            El proceso de revision puede tomar entre <strong>1 a 3 dias habiles</strong>.
                                        </p>
                                    </td></tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:#F2F5F8;padding:20px 40px;text-align:center;border-top:1px solid #d1dae6;">
                                <p style="margin:0;font-size:12px;color:#a0b0c8;">Sooki - Todos los derechos reservados</p>
                            </td>
                        </tr>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>
        `,
    });
};
 
// Correo de aprobacion con link para crear credenciales
export const sendApprovalEmail = async (toEmail, storeName, credentialsLink) => {
    await transporter.sendMail({
        from: `"Sooki" <${config.email.user}>`,
        to: toEmail,
        subject: "Tu tienda fue aprobada - Sooki",
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"/></head>
        <body style="margin:0;padding:0;background-color:#F2F5F8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F5F8;padding:40px 0;">
                <tr><td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(27,43,68,0.10);">
                        <tr>
                            <td style="background-color:#1B2B44;padding:32px 40px;text-align:center;">
                                <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">SOOKI</h1>
                                <p style="margin:6px 0 0;color:#a0b0c8;font-size:13px;">Plataforma de tiendas en linea</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:40px 40px 32px;">
                                <h2 style="margin:0 0 16px;font-size:22px;color:#1B2B44;font-weight:700;">Tu solicitud fue aprobada</h2>
                                <p style="margin:0 0 16px;font-size:14px;color:#6b7a99;line-height:1.6;">
                                    La tienda <strong style="color:#1B2B44;">${storeName}</strong> ha sido aprobada en Sooki. Ya puedes configurar tus credenciales de acceso.
                                </p>
                                <p style="margin:0 0 28px;font-size:14px;color:#6b7a99;line-height:1.6;">
                                    Haz clic en el siguiente boton para crear tu nombre de usuario y contrasena. Este enlace estara disponible por <strong style="color:#1B2B44;">48 horas</strong>.
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                    <tr><td align="center">
                                        <a href="${credentialsLink}" style="display:inline-block;background-color:#FF8C42;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
                                            Configurar mis credenciales
                                        </a>
                                    </td></tr>
                                </table>
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff5ee;border-left:4px solid #FF8C42;border-radius:0 8px 8px 0;">
                                    <tr><td style="padding:14px 18px;">
                                        <p style="margin:0;font-size:13px;color:#1B2B44;">
                                            Si el boton no funciona, copia y pega este enlace en tu navegador: <br/>
                                            <span style="color:#FF8C42;word-break:break-all;">${credentialsLink}</span>
                                        </p>
                                    </td></tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:#F2F5F8;padding:20px 40px;text-align:center;border-top:1px solid #d1dae6;">
                                <p style="margin:0;font-size:12px;color:#a0b0c8;">Sooki - Todos los derechos reservados</p>
                            </td>
                        </tr>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>
        `,
    });
};

    

export const sendResendVerificationEmail = async (email, code, name) => {
    const mailOptions = {
        from: `"Sooki" <${config.email.user}>`,
        to: email,
        subject: "Nuevo codigo de verificacion - Sooki",
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Nuevo codigo de verificacion</title>
        </head>
        <body style="margin:0;padding:0;background-color:#F2F5F8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F5F8;padding:40px 0;">
                <tr>
                    <td align="center">
                        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(27,43,68,0.10);">
                            <tr>
                                <td style="background-color:#1B2B44;padding:32px 40px;text-align:center;">
                                    <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">SOOKI</h1>
                                    <p style="margin:6px 0 0;color:#a0b0c8;font-size:13px;">Plataforma de tiendas en linea</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:40px 40px 32px;">
                                    <p style="margin:0 0 8px;font-size:15px;color:#6b7a99;">Hola, <strong>${name}</strong></p>
                                    <h2 style="margin:0 0 20px;font-size:22px;color:#1B2B44;font-weight:700;">Nuevo codigo de verificacion</h2>
                                    <p style="margin:0 0 28px;font-size:14px;color:#6b7a99;line-height:1.6;">
                                        Has solicitado un nuevo codigo de verificacion para tu cuenta de Sooki.
                                    </p>
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                        <tr>
                                            <td align="center">
                                                <div style="display:inline-block;background-color:#F2F5F8;border:2px solid #1B2B44;border-radius:10px;padding:20px 48px;">
                                                    <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#1B2B44;">${code}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff5ee;border-left:4px solid #FF8C42;border-radius:0 8px 8px 0;margin-bottom:28px;">
                                        <tr>
                                            <td style="padding:14px 18px;">
                                                <p style="margin:0;font-size:13px;color:#1B2B44;">
                                                    Este codigo expira en <strong>2 horas</strong>. Si no solicitaste este codigo, puedes ignorar este correo.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color:#F2F5F8;padding:20px 40px;text-align:center;border-top:1px solid #d1dae6;">
                                    <p style="margin:0;font-size:12px;color:#a0b0c8;">Sooki - Todos los derechos reservados</p>
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

export const sendPasswordRecoveryEmail = async (email, code, name) => {
    const mailOptions = {
        from: `"Sooki" <${config.email.user}>`,
        to: email,
        subject: "Recuperacion de contrasena - Sooki",
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Recuperacion de contrasena</title>
        </head>
        <body style="margin:0;padding:0;background-color:#F2F5F8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F5F8;padding:40px 0;">
                <tr>
                    <td align="center">
                        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(27,43,68,0.10);">
                            <tr>
                                <td style="background-color:#1B2B44;padding:32px 40px;text-align:center;">
                                    <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">SOOKI</h1>
                                    <p style="margin:6px 0 0;color:#a0b0c8;font-size:13px;">Plataforma de tiendas en linea</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:40px 40px 32px;">
                                    <p style="margin:0 0 8px;font-size:15px;color:#6b7a99;">Hola, <strong>${name}</strong></p>
                                    <h2 style="margin:0 0 20px;font-size:22px;color:#1B2B44;font-weight:700;">Recuperacion de contrasena</h2>
                                    <p style="margin:0 0 28px;font-size:14px;color:#6b7a99;line-height:1.6;">
                                        Recibimos una solicitud para restablecer tu contrasena en Sooki. Usa el siguiente codigo para continuar.
                                    </p>
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                        <tr>
                                            <td align="center">
                                                <div style="display:inline-block;background-color:#F2F5F8;border:2px solid #1B2B44;border-radius:10px;padding:20px 48px;">
                                                    <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#1B2B44;">${code}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff5ee;border-left:4px solid #FF8C42;border-radius:0 8px 8px 0;margin-bottom:28px;">
                                        <tr>
                                            <td style="padding:14px 18px;">
                                                <p style="margin:0;font-size:13px;color:#1B2B44;">
                                                    Este codigo expira en <strong>25 minutos</strong>. Si no solicitaste este cambio, puedes ignorar este correo.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff3cd;border-left:4px solid #ffc107;border-radius:0 8px 8px 0;">
                                        <tr>
                                            <td style="padding:14px 18px;">
                                                <p style="margin:0;font-size:13px;color:#1B2B44;">
                                                    <strong>⚠️ Importante:</strong> No compartas este codigo con nadie. Sooki nunca te pedira tu contrasena por correo.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color:#F2F5F8;padding:20px 40px;text-align:center;border-top:1px solid #d1dae6;">
                                    <p style="margin:0;font-size:12px;color:#a0b0c8;">Sooki - Todos los derechos reservados</p>
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