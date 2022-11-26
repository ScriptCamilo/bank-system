import { Router } from 'express';

import { accountController } from '@Controllers';

const router = Router();

router.get('/', accountController);

export default router;
