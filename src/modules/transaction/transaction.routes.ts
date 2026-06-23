import { Router } from "express";
import { transactionController } from "./transaction.controller";
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionIdParamSchema,
} from "./transaction.schema";
import { validateRequest } from "../../middlewares/validateRequest";
import { authMiddleware } from "../../middlewares/authMiddleware";

const transactionRouter = Router();

transactionRouter.use(authMiddleware);

transactionRouter.post(
  "/transaction",
  validateRequest({ body: createTransactionSchema }),
  transactionController.create.bind(transactionController)
);

transactionRouter.get(
  "/transaction",
  transactionController.readAll.bind(transactionController)
);

transactionRouter.get(
  "/transaction/:id",
  validateRequest({ params: transactionIdParamSchema }),
  transactionController.readById.bind(transactionController)
);

transactionRouter.put(
  "/transaction/:id",
  validateRequest({
    params: transactionIdParamSchema,
    body: updateTransactionSchema,
  }),
  transactionController.update.bind(transactionController)
);

transactionRouter.delete(
  "/transaction/:id",
  validateRequest({ params: transactionIdParamSchema }),
  transactionController.delete.bind(transactionController)
);

/** Alias plural — alinhado ao README e convenção REST. */
transactionRouter.post(
  "/transactions",
  validateRequest({ body: createTransactionSchema }),
  transactionController.create.bind(transactionController)
);

transactionRouter.get(
  "/transactions",
  transactionController.readAll.bind(transactionController)
);

transactionRouter.get(
  "/transactions/:id",
  validateRequest({ params: transactionIdParamSchema }),
  transactionController.readById.bind(transactionController)
);

transactionRouter.put(
  "/transactions/:id",
  validateRequest({
    params: transactionIdParamSchema,
    body: updateTransactionSchema,
  }),
  transactionController.update.bind(transactionController)
);

transactionRouter.delete(
  "/transactions/:id",
  validateRequest({ params: transactionIdParamSchema }),
  transactionController.delete.bind(transactionController)
);

export { transactionRouter };
