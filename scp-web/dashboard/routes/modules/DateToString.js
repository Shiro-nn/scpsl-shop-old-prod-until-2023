module.exports = function(date) {
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	let hour = date.getHours();
	let minute = date.getMinutes();
	if (parseInt(day) < 10) {
		let t = "0";
		t += day;
		day = t;
	}
	if (parseInt(hour) < 10) {
		let t = "0";
		t += hour;
		hour = t;
	}
	if (parseInt(minute) < 10) {
		let t = "0";
		t += minute;
		minute = t;
	}
	if (parseInt(month) == 13) {
		month = "01";
		year = date.getFullYear() + 1;
	}
	if (parseInt(month) < 10) {
		var t = "0";
		t += month;
		month = t;
	}
	month = `${month}`.replaceAll('001', '01');
	return day + "." + month + "." + year + " " + hour + ':' + minute;
}