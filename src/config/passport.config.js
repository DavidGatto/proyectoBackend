import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await UserModel.findOne({ email });
          if (user) return done(null, false);

          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          let result = await UserModel.create(newUser);

          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          console.log("El usuario no existe");
          return done(null, false);
        }

        if (!isValidPassword(password, user)) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await UserModel.findById({ _id: id });
  done(null, user);
});

//Acá desarrollamos nuestra nueva estrategia con GitHub:
passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: "Iv1.3bc32c5563a722a8",
      clientSecret: "f00a473de73f9e7a7edfa1473f4a7b76e7db9faf",
      callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Profile: ", profile);
      try {
        let user = await UserModel.findOne({ email: profile._json.email });

        if (!user) {
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            age: 36,
            email: profile._json.email,
            password: "",
          };
          let result = await UserModel.create(newUser);
          done(null, result);
        } else {
          done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: "Iv1.caf76c8e55053c67",
      clientSecret: "3966f68d3000c3d13fd683283e895fec74849ffb",
      callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Profile: ", profile);
      try {
        let user = await UserModel.findOne({ email: profile._json.email });

        if (!user) {
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            age: 21,
            email: profile._json.email,
            password: "",
          };
          let result = await UserModel.create(newUser);
          done(null, result);
        } else {
          done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default initializePassport;
