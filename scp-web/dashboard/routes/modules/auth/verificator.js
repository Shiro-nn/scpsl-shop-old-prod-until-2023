module.exports = {};
module.exports.checkAuth = (req) => {
    if(!req.bs.data.user || isNaN(req.bs.data.user.id) || req.bs.data.user.id == 0) return false;
	return true;
}