import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import { authMiddleware } from '@Authentication';
import { errorMiddleware } from '@Errors';
import { accountRouter, loginRouter, signupRouter, transactionsRouter, userRouter } from '@Routes';

const BASE_URL = '/api/v1'

const app = express();

app.use(express.json());
app.use(cors());

app.use(`${BASE_URL}/signup`, signupRouter);
app.use(`${BASE_URL}/login`, loginRouter);

app.use(authMiddleware);
app.use(`${BASE_URL}/user`, userRouter);
app.use(`${BASE_URL}/account`, accountRouter);
app.use(`${BASE_URL}/transactions`, transactionsRouter);

app.use(errorMiddleware);

export default app;
