const { default: axios } = require("axios");
const { default: Cookies } = require("js-cookie");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`,
      {
        name,
        email,
        password,
        password_confirmation,
      }
    );
    res.status(200).json({ data: user.data });

    //set cookie
    Cookies.set("token", user.data.token, { expires: 60 * 60 * 24 * 7 });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// module.exports = register;
