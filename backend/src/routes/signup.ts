import { Router } from 'express';

import { signupController } from '@Controllers';
import { loginValidationMiddleware } from '@Validations';

const router = Router();

router.post('/', loginValidationMiddleware, signupController);

export default router;
