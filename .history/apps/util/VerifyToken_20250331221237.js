var jsonwebtoken = require('jsonwebtoken');
var config = require('../../config/setting.json');

// function verifyToken(req, res, next) {
//     if (req.headers['authorization'] == null) {
//         return res.status(401).send({ auth: false, message: 'Không có token nào được cung cấp.' });
//     }

//     var temp = req.headers['authorization'].split(" ");

//     if (temp.length < 2) {
//         return res.status(401).send({ auth: false, message: 'Không có token nào được cung cấp.' });
//     }

//     token = temp[1];
//     if (!token) {
//         return res.status(401).send({ auth: false, message: 'Không có token nào được cung cấp.' });
//     }

//     try{
//         const decoded = jsonwebtoken.verify(token, config.jwt.secret);

//         let details = (req.userData = {
//             user: decoded.user,
//             roles: decoded.roles,
//             claims: decoded.claims
//         });
//         next();
//     }
//     catch(err){
//         return res.status(500).send({auth: false, message: 'Không xác thực được token.'});
//     }
// }

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    // Kiểm tra xem header Authorization có tồn tại không
    if (!authHeader) {
        return res.status(401).json({ auth: false, message: "Không có token nào được cung cấp." });
    }

    // Tách token từ "Bearer <token>"
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(401).json({ auth: false, message: "Định dạng token không hợp lệ." });
    }

    const token = tokenParts[1];

    // Xác thực token
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.userData = {
            user: decoded.user,
            roles: decoded.roles,
            claims: decoded.claims,
        };
        next();
    } catch (err) {
        return res.status(403).json({ auth: false, message: "Không xác thực được token." });
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