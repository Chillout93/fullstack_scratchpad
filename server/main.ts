import cors from "cors";
import express, { json } from "express";
import { postGroups } from "./routes/post_groups";
import { posts } from "./routes/posts";
import { userPostGroups } from "./routes/user_post_groups";
import { users } from "./routes/users";

export const app = express();
app.use(cors());
app.use(json());

app.use('/post_groups', postGroups)
app.use('/posts', posts)
app.use('/user_post_groups', userPostGroups)
app.use('/users', users)

const port = 3500;

(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};
 

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});