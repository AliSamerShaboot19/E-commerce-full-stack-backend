import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const seltRoundes = 10;
    const hashedPassword = await bcrypt.hash(password, seltRoundes);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashePassword) => {
  return bcrypt.compare(password, hashePassword);
};
