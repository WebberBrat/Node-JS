const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Шлях до моделі User

module.exports = function(passport) {
    // Налаштування стратегії для аутентифікації
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Знайти користувача за email
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'This email is not registered.' });
                }

                // Перевірка пароля
                user.comparePassword(password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid credentials' });
                    }
                });
            })
            .catch(err => console.error(err));
    }));

    // Сесійні серіалізація і десеріалізація
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};
