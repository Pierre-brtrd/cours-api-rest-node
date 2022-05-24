// Imports
const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = "sdkjhsdfkhu08970983kjbdkfhAIHIDUHàçukhdsfoIUOHDIYQGiughzdihdOIJHA9667443jhbgsdf"

// Exported functions
module.exports = {
    generateTokenForUser: function (userData) {
        return jwt.sign({
                userId: userData.id,
                isAdmin: userData.isAdmin
            },
            JWT_SIGN_SECRET, {
                expiresIn: '1h'
            }
        )
    }
}