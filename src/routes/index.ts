import { Router } from "express";

const router = Router();

router.get("/health", (_, response) => {
    return response.status(200).json({
        status: "ok",
        service: "MEI Finance API",
    });
});

export { router };