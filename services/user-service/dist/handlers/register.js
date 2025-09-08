"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const uuid_1 = require("uuid");
const password_1 = require("../hash/password");
const userRepository_1 = require("../database/userRepository");
const createCardQueue_1 = require("../sqs/createCardQueue");
const handler = async (event) => {
    try {
        const body = JSON.parse(event.body ?? "{}");
        const hashedPassword = await (0, password_1.hashPassword)(body.password);
        const user = {
            uuid: (0, uuid_1.v4)(),
            name: body.name,
            lastName: body.lastName,
            email: body.email,
            password: hashedPassword,
            document: body.document
        };
        await (0, userRepository_1.saveUser)(user);
        await (0, createCardQueue_1.sendCreateCardEvent)(user.uuid);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Usuario registrado", uuid: user.uuid })
        };
    }
    catch (err) {
        console.error(err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
exports.handler = handler;
