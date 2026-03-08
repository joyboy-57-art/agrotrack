"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let mongoServer;
const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;
        // Fallback to in-memory db if no URI provided
        if (!mongoUri) {
            console.log('No MONGO_URI found in .env, using mongodb-memory-server...');
            mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
        }
        const conn = await mongoose_1.default.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map