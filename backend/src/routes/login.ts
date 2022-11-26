import { Router } from 'express';

import { loginController } from '@Controllers';
import { loginValidationMiddleware } from '@Validations';

const router = Router();

router.post('/', loginValidationMiddleware, loginController);

export default router;
