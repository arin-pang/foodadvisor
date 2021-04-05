import app from "./app";
import {createServer} from "http";

const port: number = Number(process.env.PORT) || 13000;

const server = createServer(app);

server.listen(port, () => {
  console.log(`Port ${port} waiting...`);
});

export default server;
