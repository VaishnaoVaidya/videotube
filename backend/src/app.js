import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))

app.use(cors({ origin: true, credentials: true }));

app.use(express.json({limit: "9kb"}));
app.use(express.urlencoded({extended: true, limit: "9kb"}));
app.use(express.static("public"))
app.use(cookieParser());
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });

//routes import
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js';
import likeRouter from './routes/like.routes.js';
import commentRouter from './routes/comment.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import playlistRouter from './routes/playlist.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import tweetRouter from './routes/tweet.routes.js';
import healthcheckRouter from './routes/healthcheck.routes.js'
import viewsRouter from './routes/views.routes.js'


//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/views", viewsRouter  )

app.use((err, req, res, next) => {
    const statusCode = err?.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err?.message || "Internal Server Error",
        errors: err?.errors || []
    });
});

//http://localhost:8000/api/v1/users/register

export{ app , io };
