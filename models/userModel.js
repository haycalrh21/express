import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
const { Schema } = mongoose;

const userSchema = new Schema({
	name: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: true,
		validate: validator.isEmail,
	},
	password: { type: String, required: true, minlength: 4 },
	role: { type: String, enum: ["admin", "user"], default: "user" },
});

userSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.methods.comparePassword = async function (reqBody) {
	return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
