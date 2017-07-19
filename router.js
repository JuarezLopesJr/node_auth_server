const Auth = require('./controllers/auth')
const passportService = require('./services/passport')
const passport = require('passport')
// this is the validation middleware passed to router handler, this means
// before render the page, check token using this helper(requireAuth)
// session false means, don't create cookies
const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

module.exports = function (app) {
  app.get('/', requireAuth, function (req, res) {
    res.send({ connection: true })
  })
  app.post('/signin', requireSignin, Auth.signin)
  app.post('/signup', Auth.signup)
}
