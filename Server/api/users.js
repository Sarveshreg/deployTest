const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    const users = await prisma.users.findMany();
    res.json(users);
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
        where: { id },
    });
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

// Create a new user
router.post('/', async (req, res) => {
    const { FirstName, LastName, Email, Password, ZipCode } = req.body;
    try {
        const newUser = await prisma.users.create({
            data: { FirstName, LastName, Email, Password, ZipCode },
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Update an existing user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { FirstName, LastName, Email, Password, ZipCode } = req.body;
    try {
        const updatedUser = await prisma.users.update({
            where: { id },
            data: { FirstName, LastName, Email, Password, ZipCode },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.users.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
