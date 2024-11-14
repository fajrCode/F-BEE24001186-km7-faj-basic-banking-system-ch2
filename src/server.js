import "dotenv/config";
import { app } from "./configs/app.js";
import http from "http";
import listEndpoints from 'express-list-endpoints';

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
const server = http.createServer(app);

try {
    if (process.env.NODE_ENV == "development") {
        console.log("================== API - LIST =======================");
        listEndpoints(app).forEach((route) => {
            route.methods.forEach((method) => {
                console.log(`Route => ${method} ${route.path}`);
            });
        });
        console.log("================== API - LIST =======================\n");
    };

    server.listen(port, () => {
        console.log(`🚀 Server is on ${host || ''}`);
    });
} catch (error) {
    console.error(`Error: ${error.message}`);
}