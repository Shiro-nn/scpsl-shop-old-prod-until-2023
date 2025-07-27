const DateToString = require('../../DateToString');
module.exports = function(user, balance, type, color, sum, name, server){
const html = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
<title>Уведомление о покупке привилегии</title>
<style type="text/css">
</style>
</head>
<body>
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #27262f; min-width: 320px; font-size: 0px; line-height: normal;">
<tr>
<td align="center" valign="top">
<table cellpadding="0" cellspacing="0" border="0" width="700" class="table700" style="max-width: 700px; min-width: 320px; background: #27262f;">
<tr>
<td align="center" valign="top">
<div style="height: 15px; line-height: 15px; font-size: 0px;">&nbsp;</div>
<a href="https://scpsl.shop" target="_blank" style="display: block; max-width: 600px;">
<img src="https://cdn.scpsl.shop/another/0821dee79c59/_logo.png" alt="" width="600" border="0" style="display: block; width: 600px; max-width: 100%;">
</a>
<div style="height: 15px; line-height: 15px; font-size: 0px;">&nbsp;</div>
<table cellpadding="0" cellspacing="0" border="0" width="700" class="table700" style="max-width: 700px; min-width: 320px; background: #afafaf;">
<tr>
<td align="center" valign="top">
<table cellpadding="0" cellspacing="0" border="0" width="620" class="table700" style="max-width: 620px; min-width: 280px;">
<tr>
<td align="center" valign="top">
<div style="height: 15px; line-height: 15px; font-size: 0px;">&nbsp;</div>
<div align="left">
<b style="font-family: Arial; color: #000000; font-size: 25px; line-height: 35px;">Уведомление о покупке</b>
<div style="height: 30px; line-height: 30px; font-size: 0px;">&nbsp;</div>
<span style="font-family: Arial; color: #000000; font-size: 20px; line-height: 27px;">Дата: <b>${DateToString(new Date())}</b></span>
<div style="height: 8px; line-height: 8px; font-size: 0px;">&nbsp;</div>
<span style="font-family: Arial; color: #000000; font-size: 20px; line-height: 27px;">Часовой пояс: <b>МСК</b> (UTC+3)</span>
<div style="height: 17px; line-height: 17px; font-size: 17px;">&nbsp;</div>
<span style="font-family: Arial; color: #000000; font-size: 20px; line-height: 27px;">Приобретено: <b>${type}</b> '<span style="color: ${color};">${name}</span>'</span>
<div style="height: 8px; line-height: 8px; font-size: 0px;">&nbsp;</div>
<span style="font-family: Arial; color: #000000; font-size: 20px; line-height: 27px;">Аккаунт: <b>${user}</b></span>
<div style="height: 8px; line-height: 8px; font-size: 0px;">&nbsp;</div>
<span style="font-family: Arial; color: #000000; font-size: 20px; line-height: 27px;">Сервер: <b>${server}</b></span>
<div style="height: 8px; line-height: 8px; font-size: 0px;">&nbsp;</div>
<span style="font-family: Arial; color: #000000; font-size: 20px; line-height: 27px;">Стоимость: <b>${sum}₽</b></span>
<div style="height: 8px; line-height: 8px; font-size: 0px;">&nbsp;</div>
<span style="font-family: Arial; color: #000000; font-size: 20px; line-height: 27px;">Текущий баланс: <b>${balance}₽</b></span>
</div>
<div style="height: 15px; line-height: 15px; font-size: 0px;">&nbsp;</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
<div style="height: 15px; line-height: 15px; font-size: 0px;">&nbsp;</div>
<table cellpadding="0" cellspacing="0" border="0" width="700" class="table700" style="max-width: 700px; min-width: 320px; background: #312e3c;">
<tr>
<td align="center" valign="top">
<table cellpadding="0" cellspacing="0" border="0" width="620" class="table700" style="max-width: 620px; min-width: 280px;">
<tr>
<td align="center" valign="top">
<div style="height: 15px; line-height: 15px; font-size: 0px;">&nbsp;</div>
<div style="border-collapse:collapse;font-size:15px;line-height:1.5;background-color:#312e3c">
<span style="font-family: Arial; color: #d5cde2; font-size:13px;line-height:19.5px;">Copyright © fydne ${new Date().getFullYear()}</span>
</div>
<div style="height: 15px; line-height: 15px; font-size: 0px;">&nbsp;</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
<div style="height: 45px; line-height: 45px; font-size: 0px;">&nbsp;</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
return [{data:html, alternative:true}];
}