const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // console.log(allowedRoles);
        // Check if roles exist in the request object
        console.log(req.roles);
        if (!req?.roles) return res.sendStatus(401);
        
        // Ensure allowedRoles is an array
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        // Check if req.roles is an array and contains any of the allowed roles
        const result = req.roles.some(role => rolesArray.includes(role));
        console.log(result);
        if (!result) return res.sendStatus(401);        
        // Proceed to the next middleware if role is authorized
        next();
    }
}

module.exports = verifyRoles;
