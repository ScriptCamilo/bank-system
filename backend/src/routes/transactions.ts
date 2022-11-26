import { Router } from 'express';

import { transactionsController } from '@Controllers';
import { transactionsValidationMiddleware, transactionQueryValidationMiddleware } from '@Validations';

const router = Router();

router.post('/cash-out', transactionsValidationMiddleware, transactionsController.createNewTransaction);

router.get('/', transactionQueryValidationMiddleware, transactionsController.getTransactionsQuery, transactionsController.getTransactions);

export default router;
