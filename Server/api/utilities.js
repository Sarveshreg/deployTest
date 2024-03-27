const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function getUserById(id) {
  return await prisma.users.findUnique({
    where: { id },
  });
}

async function getUserByEmail(email) {
  return await prisma.users.findUnique({
    where: { Email: email },
  });
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

function generateToken(user) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file");
  }
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
}

function verifyToken(token) {
  const JWT_SECRET = process.env.JWT_SECRET;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
};
