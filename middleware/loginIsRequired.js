function loginIsRequired(req, res, next){
    if(!req.session.user) {
        return res.status(401).json({ error: 'Nicht eingeloggt'});
    }
    next(); // Fährt direkt weitre fort, ohne zustoppen.
}

module.exports = loginIsRequired;