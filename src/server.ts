import { app } from "./app";
import "dotenv/config";


app.listen({
  host: "0.0.0.0",
  port: 3001
}).then(() => {
  console.log(`server is running on port ${process.env.PORT}`);
})