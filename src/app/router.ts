import { Router } from "express";
import HealthController from "./controllers/HealthController";
import UserController from "./controllers/UserController";
import ApiKeyMiddleware from "./middlewares/ApiKeyMiddleware";
import SessionMiddleware from "./middlewares/SessionMiddleware";
import RoleMiddleware from "./middlewares/RoleMiddleware";
import AuthController from "./controllers/AuthController";
import ClassController from "./controllers/ClassController";
import EnrollmentController from "./controllers/EnrollmentController";
import ChallengeController from "./controllers/ChallengeController";
import UserClassController from "./controllers/UserClassController";
import InstitutionController from "./controllers/InstitutionController";
import StatsController from "./controllers/StatsController";
import NewsletterController from "./controllers/NewsletterController";
import upload from "./middlewares/UploadMiddleware";

const router: Router = Router();

router.use(ApiKeyMiddleware.handle);
router.route("/health").get(HealthController.get);

// Auth Endpoints
const auth = AuthController;
router.route("/auth").post(auth.register).patch(auth.forgotPassword);
router.route("/auth/login").post(auth.login);
router.route("/auth/refresh").post(auth.refreshSession);
router.route("/auth/register").post(auth.createUser);
router.route("/auth/:token").patch(auth.changePassword);
router
  .route("/institution/domain/:domain")
  .get(InstitutionController.searchByDomain);

// Newsletter Endpoints
const newsletter = NewsletterController;
router
  .route("/newsletter")
  .post(newsletter.subscribe)
  .delete(newsletter.unsubscribe);

router.use(SessionMiddleware.handle);

// User Endpoints
const user = UserController;
router.route("/user").get(user.checkUserExists);
router
  .route("/user/search")
  .get(RoleMiddleware.allow("teacher", "admin"), user.searchStudents);
router
  .route("/user/email/:email")
  .get(RoleMiddleware.allow("teacher", "admin"), user.getByEmail);
router.route("/user/me/challenges").get(user.getMyChallenges);
router.route("/user/:id/challenges").get(user.getChallenges);
router
  .route("/user/:id")
  .get(user.getOne)
  .patch(user.updateOne)
  .delete(user.deleteOne);

// Class Endpoints
const classes = ClassController;
router
  .route("/class")
  .post(RoleMiddleware.allow("teacher", "admin"), classes.create);
router.route("/class/tutor/:tutor_id").get(classes.getByTutor);
router
  .route("/class/:id")
  .get(classes.getOne)
  .patch(classes.updateOne)
  .delete(classes.deleteOne);

// Enrollment Endpoints
const enroll = EnrollmentController;
router.route("/enrollment").post(enroll.enroll).delete(enroll.unenroll);
router
  .route("/enrollment/complete")
  .patch(RoleMiddleware.allow("teacher", "admin"), enroll.complete);
router
  .route("/enrollment/uncomplete")
  .patch(RoleMiddleware.allow("teacher", "admin"), enroll.uncomplete);
router.route("/enrollment/user/:user_id").get(enroll.getByUser);
router.route("/enrollment/challenge/:challenge_id").get(enroll.getByChallenge);

// Institution Endpoints
const institution = InstitutionController;
router
  .route("/institution")
  .get(RoleMiddleware.allow("admin"), institution.getAll)
  .post(RoleMiddleware.allow("admin"), institution.create);
router
  .route("/institution/:id")
  .get(institution.getOne)
  .patch(RoleMiddleware.allow("admin"), institution.updateOne)
  .delete(RoleMiddleware.allow("admin"), institution.deleteOne);

// UserClass Endpoints
const userClass = UserClassController;
router
  .route("/user-class")
  .post(RoleMiddleware.allow("teacher", "admin"), userClass.addUserToClass)
  .delete(
    RoleMiddleware.allow("teacher", "admin"),
    userClass.removeUserFromClass,
  );
router.route("/user-class/user/:user_id").get(userClass.getClassesByUser);
router.route("/user-class/class/:class_id").get(userClass.getUsersByClass);

// Challenge Endpoints
const challenge = ChallengeController;
router
  .route("/challenge")
  .post(RoleMiddleware.allow("teacher", "admin"), upload.single("image"), challenge.create);
router.route("/challenge/class/:class_id").get(challenge.getByClass);
router
  .route("/challenge/:id/image")
  .post(RoleMiddleware.allow("teacher", "admin"), upload.single("image"), challenge.uploadImage)
  .delete(RoleMiddleware.allow("teacher", "admin"), challenge.deleteImage);
router
  .route("/challenge/:id")
  .get(challenge.getOne)
  .patch(RoleMiddleware.allow("teacher", "admin"), upload.single("image"), challenge.updateOne)
  .delete(RoleMiddleware.allow("teacher", "admin"), challenge.deleteOne);

router
  .route("/newsletter/subscribers")
  .get(RoleMiddleware.allow("admin"), newsletter.getAll);

// Stats Endpoints
const stats = StatsController;
router
  .route("/stats/platform")
  .get(RoleMiddleware.allow("admin"), stats.getPlatform);
router.route("/stats/user/:user_id").get(stats.getByUser);
router.route("/stats/challenge/:challenge_id").get(stats.getByChallenge);
router.route("/stats/class/:class_id/ranking").get(stats.getRanking);
router
  .route("/stats/class/:class_id")
  .get(RoleMiddleware.allow("teacher", "admin"), stats.getByClass);

export default router;
