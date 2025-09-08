"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const userService_1 = require("../services/userService");
const handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const { name, lastName, email, password, document } = body;
        if (!name || !lastName || !email || !password || !document) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required fields" }),
            };
        }
        const uuid = await (0, userService_1.saveUser)({ name, lastName, email, password, document });
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "User registered", uuid }),
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal error", error }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=registerUser.js.map