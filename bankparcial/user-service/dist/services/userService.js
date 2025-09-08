"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUser = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamoClient_1 = require("../aws/dynamoClient");
const uuid_1 = require("uuid");
const saveUser = async (user) => {
    const uuid = (0, uuid_1.v4)();
    const item = {
        uuid,
        ...user,
    };
    const command = new lib_dynamodb_1.PutCommand({
        TableName: "user-table",
        Item: item,
    });
    await dynamoClient_1.ddb.send(command);
    return uuid;
};
exports.saveUser = saveUser;
//# sourceMappingURL=userService.js.map