import User from "../models/userModel";
import jwt from "jsonwebtoken";

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "6d",
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const isDev = process.env.NODE_ENV === "development" ? true : false;
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: isDev ? false : true,
	};
	res.cookie("jwt", token, cookieOptions).status(statusCode);
	user.password = undefined;

	res.status(statusCode).json({
		data: user,
	});
};
