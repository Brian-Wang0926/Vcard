const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URI}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("進入 google strategy 的區域");
      const existingUser = await User.findOne({ googleID: profile.id });

      if (existingUser) {
        console.log("使用者已經註冊過了，無需存入資料庫");
        // 更新"最近登入時間"
        existingUser.lastActiveDate = new Date();
        console.log("現在時間：", Date());
        await existingUser.save();
        return done(null, existingUser);
      } else {
        console.log("偵測到新用戶，需存入資料庫");
        const newUser = new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.emails[0].value,
        });
        const saveUser = await newUser.save();
        console.log("成功創建新用戶");
        done(null, saveUser);
      }
    }
  )
);
// 透過 jwt 認證使用者
module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
  opts.secretOrKey = process.env.JWT_SECRET;
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        const user = await User.findById(jwt_payload._id);
        if (user) return done(null, user);
      } catch (e) {
        return done(e, false);
      }
      return done(null, false);
    })
  );
};
