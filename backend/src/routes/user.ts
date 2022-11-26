import { Router } from 'express';

import { userController } from '@Controllers';

const router = Router();

router.get('/', userController);

export default router;
