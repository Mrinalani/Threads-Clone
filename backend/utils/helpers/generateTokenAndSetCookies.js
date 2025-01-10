import Jwt from 'jsonwebtoken'

const generatrTokenAndSetCookies = (userId, res) => {
  const token = Jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // more secure
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  }); 

  return token;
};


export default generatrTokenAndSetCookies