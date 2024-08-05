const LocalStrategy = require("passport-local").Strategy;
const pool = require("./models/localdb");

const authenticateUser = (username, password, done) => {
  const trimmedUsername = username.trim();

  console.log("Searching for username:", trimmedUsername);

  pool.query(
    `SELECT * FROM users WHERE LOWER(username) = LOWER($1)`,
    [trimmedUsername],
    (err, results) => {
      if (err) {
        return done(err);
      }
      if (results.rows.length > 0) {
        const user = results.rows[0];
        console.log("Authenticated user:", user);
        if (password.trim() === user.password.trim()) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password is incorrect" });
        }
      } else {
        return done(null, false, { message: "Username is not registered" });
      }
    }
  );
};

function initialize(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => {
    if (!user || !user.user_id) {
      return done(new Error("User not found or user_id is missing"));
    }
    done(null, user.user_id);
  });

  passport.deserializeUser((user_id, done) => {
    pool.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [user_id],
      (err, results) => {
        if (err) {
          return done(err);
        }
        if (results.rows.length === 0) {
          return done(new Error("User not found"));
        }
        const user = results.rows[0];
        done(null, user);
      }
    );
  });
}

module.exports = initialize;
