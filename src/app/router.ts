import { Router } from "express";
import HealthController from "./controllers/HealthController";
import UserController from "./controllers/UserController";
import ApiKeyMiddleware from "./middlewares/ApiKeyMiddleware";

const router: Router = Router();

router.use(ApiKeyMiddleware.handle);
router.route("/health").get(HealthController.get);

router.route("/:id").get(UserController.getOne);

export default router;
