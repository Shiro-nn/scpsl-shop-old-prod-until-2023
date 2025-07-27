const config = require('../../../../../config');
module.exports = function(nick, link){
const html = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
<title>Подтверждение почты</title>
<style type="text/css">
</style>
</head>
<body>
    <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" style="text-size-adjust: 100%; border-spacing: 0px; border-collapse: collapse; margin: 0px auto;" bgcolor="#27262f">
        <tbody>
            <tr style="text-size-adjust: 100%;">
                <td valign="top" style="text-size-adjust: 100%;">
                    <center style="width: 100%; text-size-adjust: 100%;">
                        <div style="text-size-adjust: 100%; max-width: 600px; margin: auto;">
                            <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="text-size-adjust: 100%; border-spacing: 0px; border-collapse: collapse; max-width: 600px; margin: 0px auto;">
                                <tbody>
                                    <tr style="text-size-adjust: 100%;">
                                        <td style="text-size-adjust: 100%; color: rgb(158, 158, 167); font-family:'Courier New', sans-serif; font-size: 13px; line-height: 1.6; padding: 20px 0px;" align="center">
                                            <a href="https://${config.dashboard.baseURL}" style="text-size-adjust: 100%; color: rgb(110, 109, 122); text-decoration: none;">
                                                <img width="165" src="${config.dashboard.cdn}/qurre.id/img/emailMiniLogo.png" style="text-size-adjust: 100%; height: auto; outline: none; line-height: 100%; text-decoration: none; border-width: 0px; max-width: 600px;">
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="text-size-adjust: 100%; border-spacing: 0px; border-collapse: collapse; max-width: 600px; margin: 0px auto;" bgcolor="#afafaf">
                                <tbody>
                                    <tr style="text-size-adjust: 100%;">
                                        <td style="text-size-adjust: 100%;">
                                            <table border="0" cellpadding="30" cellspacing="0" width="100%" style="text-size-adjust: 100%; border-spacing: 0px; border-collapse: collapse; margin: 0px auto;">
                                                <tbody>
                                                    <tr style="text-size-adjust: 100%;">
                                                        <td valign="top" style="text-size-adjust: 100%; color: rgb(13, 12, 34); font-family: 'Courier New', sans-serif; font-size: 14px; line-height: 150%;">
                                                            <div style="text-size-adjust: 100%; margin-bottom: 20px; padding-bottom: 25px; border-bottom: 1px solid rgb(238, 238, 238);">
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="text-size-adjust: 100%; border-spacing: 0px; border-collapse: collapse; margin: 0px auto;">
                                                                    <tbody>
                                                                        <tr style="text-size-adjust: 100%;">
                                                                            <td style="text-size-adjust: 100%;">
                                                                                <h1 style="text-size-adjust: 100%;display: block;color: rgb(13, 12, 34);font-family: 'Courier New', sans-serif;font-size: 18px;font-weight: 700;line-height: 1.3;margin: 0px;">
                                                                                    Привет, ${nick}<span style="text-size-adjust: 100%; display: block; color: rgb(69, 69, 73); font-size: 15px; font-weight: 700;">Добро пожаловать на Qurre ID & fydne</span>
                                                                                </h1>
                                                                            </td>
                                                                            <td width="58" align="right" style="text-size-adjust: 100%;">
                                                                                <img width="48" height="48" src="${config.dashboard.cdn}/qurre.id/img/cyber-security-pink.png" style="text-size-adjust: 100%; height: auto; outline: none; line-height: 100%; text-decoration: none; display: inline; width: 48px; border-radius: 50%; border-width: 0px;">
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <p style="text-size-adjust: 100%; margin-top: 15px; margin-bottom: 15px; color: rgb(85, 85, 85); font-size: 16px; line-height: 1.5;font-weight: 600;">Завершите регистрацию, нажав на кнопку:</p>
                                                            <table cellspacing="0" cellpadding="0" border="0" align="center" style="text-size-adjust: 100%; border-spacing: 0px; border-collapse: collapse; margin: auto;">
                                                                <tbody>
                                                                    <tr style="text-size-adjust: 100%;">
                                                                        <td style="text-size-adjust: 100%; border-radius: 4px; transition: all 100ms ease-in 0s;" align="center" bgcolor="#e647f5">
                                                                            <a href="${link}" style="text-size-adjust: 100%; color: #ffffff; font-family: 'Courier New', sans-serif; font-weight: 500; text-decoration: none; display: block; border-radius: 4px; background-color: #e647f5; font-size: 13px; line-height: 1.1; text-align: center; transition: all 100ms ease-in 0s; border: 15px solid #e647f5;">Кнопочка</a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <p style="text-size-adjust: 100%; margin-top: 15px; margin-bottom: 15px; color: rgb(85, 85, 85); font-size: 16px; line-height: 1.5;font-weight: 600;">Ссылка действительна в течение 2х дней</p>
                                                            <p style="text-size-adjust: 100%; margin-top: 15px; margin-bottom: 15px; color: rgb(85, 85, 85); font-size: 16px; line-height: 1.5;font-weight: 600;">Если вы не регистрировались на Qurre ID (fydne), проигнорируйте данное письмо</p>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style="height: 15px; line-height: 15px; font-size: 0px;">&nbsp;</div>
                            <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="text-size-adjust: 100%; border-spacing: 0px; border-collapse: collapse; max-width: 600px; margin: 0px auto;" bgcolor="#312e3c">
                                <tbody>
                                    <tr>
                                        <td align="center" valign="top">
                                            <table cellpadding="0" cellspacing="0" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td align="center" valign="top">
                                                            <div style="height: 15px; line-height: 15px; font-size: 0px;">&nbsp;</div>
                                                            <div style="border-collapse:collapse;font-size:15px;line-height:1.5;background-color:#312e3c">
                                                                <span style="font-family: Arial; color: #d5cde2; font-size:13px;line-height:19.5px;">Copyright © Qurre ${new Date().getFullYear()}</span>
                                                            </div>
                                                            <div style="height: 15px; line-height: 15px; font-size: 0px;">&nbsp;</div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style="height: 45px; line-height: 45px; font-size: 0px;">&nbsp;</div>
                        </div>
                    </center>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>`;
return {data:html, alternative:true};
};