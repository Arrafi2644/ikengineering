import express from "express";
import { submitContactForm } from "../controllers/contact-controller.js";
import { submitJobApplication } from "../controllers/application-controller.js";
import { uploadSpec, uploadCV } from "../middleware/upload.js";
import { validateRequest } from "@/middleware/validateRequest.js";
import { checkAuth } from "@/middleware/checkAuth.js";
import { createUserZodSchema, updateUserZodSchema } from "@/validations/user.validation.js";
import { UserControllers } from "@/controllers/user.controller.js";
import { Role } from "@/interfaces/user.interface.js";
import { AuthControllers } from "@/controllers/auth.contollers.js";
import { changePasswordZodSchema } from "@/validations/auth.validation.js";
import { multerUpload } from "@/config/multer.config.js";
import { ServiceControllers } from "@/controllers/service.controller.js";
import { HeroSchema } from "@/validations/hero.validation.js";
import { HeroControllers } from "@/controllers/hero.controller.js";
import { ProjectControllers } from "@/controllers/project.controller.js";
import { SiteInfoControllers } from "@/controllers/siteInfo.controller.js";
import { contactFormSchema } from "@/validations/contact.validation.js";
import { ContactController } from "@/controllers/contact.controller.js";
import { JobApplicationController } from "@/controllers/jobApplication.controller.js";
import { SEOControllers } from "@/controllers/seo.controller.js";
import { createSEOZodSchema, updateSEOZodSchema } from "@/validations/seo.validation.js";

const router = express.Router();

// Contact form route with file upload middleware
router.post("/contact", uploadSpec, submitContactForm);

// Job application route with file upload middleware
router.post("/application", uploadCV, submitJobApplication);

// user 
router.post('/user/register', validateRequest(createUserZodSchema), UserControllers.createUser)
router.get('/user/me',
     checkAuth(...Object.values(Role)),
      UserControllers.getMe)
router.get('/user',
    UserControllers.getAllUser)
router.get("/user/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser)
router.delete("/user/:id",
    UserControllers.deleteUser)
router.patch("/user/:id", validateRequest(updateUserZodSchema),
  UserControllers.updateUser)

// auth 
router.post('/auth/login', AuthControllers.credentialLogin)
router.post('/auth/logout', AuthControllers.logout)
router.post("/auth/refresh-token", AuthControllers.getNewAccessToken)
router.post("/auth/change-password", checkAuth(...Object.values(Role)), validateRequest(changePasswordZodSchema), AuthControllers.changePassword)

// Service 
router.post(
    "/service/create-service",
    multerUpload.fields([
        { name: "serviceImage", maxCount: 1 },
    ]),
    ServiceControllers.createService
);

router.patch("/service/reorder", ServiceControllers.reorderServices);

router.patch(
    "/service/update-service/:id",
    multerUpload.single('image'),
    ServiceControllers.updateService
);
router.get("/service/:slug", ServiceControllers.getSingleService)
router.get("/service", ServiceControllers.getAllServices)
router.delete("/service/:id",
    ServiceControllers.deleteService)


// Hero 
router.post(
    '/hero/create-hero',
    multerUpload.array("files"),
    validateRequest(HeroSchema),
    HeroControllers.createHero
)
router.patch(
    "/hero/update-hero/:id",
    multerUpload.array('files', 5),
    validateRequest(HeroSchema),
    HeroControllers.updateHero
)

router.get("/hero", HeroControllers.getSingleHero)

// Project 
router.post(
    "/project/create-project",
    multerUpload.fields([
        { name: "projectImage", maxCount: 1 },
    ]),
    ProjectControllers.createProject
);

router.patch(
    "/project/update-project/:id",
    multerUpload.single('image'),
    ProjectControllers.updateProject
);
router.get("/project/:slug", ProjectControllers.getSingleProject)
router.get("/project", ProjectControllers.getAllProjects)
router.delete("/project/:id",
    ProjectControllers.deleteProject)

// Site info 

router.get('/site-info', SiteInfoControllers.getSiteInfo);

router.post(
    "/site-info",
    multerUpload.fields([
        { name: "mainLogo", maxCount: 1 },
        { name: "faviconLogo", maxCount: 1 },
        { name: "footerLogo", maxCount: 1 },
    ]),
    SiteInfoControllers.createSiteInfo
);

router.patch(
    "/site-info",
    multerUpload.fields([
        { name: "mainLogo", maxCount: 1 },
        { name: "faviconLogo", maxCount: 1 },
        { name: "footerLogo", maxCount: 1 },
    ]),
    SiteInfoControllers.updateSiteInfo
);

// Contact form 

router.post(
    '/contact-form/submit-form',
    multerUpload.fields([
        { name: "contactFile", maxCount: 3 },
    ]),
    ContactController.contactForm
)

router.get("/contact-form/:id", ContactController.getSingleContactForm);
router.get("/contact-form", ContactController.getAllContactForms);
router.delete("/contact-form/:id", ContactController.deleteContactForm);

// Job Application 
router.post(
    "/job-application",
    multerUpload.single("cvFile"),
    JobApplicationController.submitJobApplication
);
router.get("/job-application/:id", JobApplicationController.getSingleJobApplication);
router.get("/job-application", JobApplicationController.getAllJobApplications);
router.delete("/job-application/:id", JobApplicationController.deleteJobApplication);

// SEO

router.get('/seo', SEOControllers.getAllSeo)
router.get('/seo/:pagePath', SEOControllers.getSinglePageSEO);
router.post(
    '/seo',
    validateRequest(createSEOZodSchema),
    SEOControllers.createSEO
);

router.patch(
    '/seo/:id',
    validateRequest(updateSEOZodSchema),
    SEOControllers.updateSEO
);

router.delete(
    '/seo/:pagePath',
    SEOControllers.deleteSEO
);



export default router;
