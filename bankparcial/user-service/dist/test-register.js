"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registerUser_1 = require("./lambdas/registerUser");
const mockEvent = {
    body: JSON.stringify({
        name: "Jane",
        lastName: "Doe",
        email: "jane@doe.com",
        password: "1234567890",
        document: "1234567890",
    }),
};
(0, registerUser_1.handler)(mockEvent).then((response) => {
    console.log("Lambda response:", response);
});
//# sourceMappingURL=test-register.js.map