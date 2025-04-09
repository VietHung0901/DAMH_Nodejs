var jsonwebtoken = require('jsonwebtoken');
var config = require('../../config/setting.json');

function verifyToken(req, res, next) {
    if (req.headers['authorization'] == null) {
        return res.status(401).send({ auth: false, message: 'Không có token nào được cung cấp.' });
    }

    var temp = req.headers['authorization'].split(" ");

    if (temp.length < 2) {
        return res.status(401).send({ auth: false, message: 'Định dạng token không hợp lệ.' });
    }

    token = temp[1];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'Token sai định dạng.' });
    }

    try{
        const decoded = jsonwebtoken.verify(token, config.jwt.secret);

        let details = (req.userData = {
            user: decoded.user,
            roles: decoded.roles,
            claims: decoded.claims
        });
        next();
    }
    catch(err){
        return res.status(500).send({auth: false, message: 'Không xác thực được token.'});
    }
}

function verifyPermission(permission) {
    return function(req, res, next) {
        if (!req.userData.claims.includes(permission)) {
            return res.status(403).json({ message: "Bị cấm: Bạn không có quyền cho hành động này" });
        }
        next();
    };
}

function verifyRole(role) {
    return function (req, res, next) {
        if (!req.userData.roles.includes(role)) {
            return res.status(403).json({ message: "Bị cấm: Bạn không có quyền cho hành động này" });
        }
        next();
    };
}

module.exports = { verifyToken, verifyPermission, verifyRole };

// module.exports = verifyToken;