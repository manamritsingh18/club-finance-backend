const ROLE_HIERARCHY = {
  viewer: 1,
  analyst: 2,
  admin: 3,
};

module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ error: 'No role assigned.' });
    }

    const hasPermission = allowedRoles.some(
      (role) => ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[role]
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
      });
    }

    next();
  };
};