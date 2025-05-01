const express = require("express");
const treeController = require("../controllers/treeController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const { validateCreateTree } = require("../middleware/treeValidation");
const { validationResult } = require("express-validator");
const { fileValidation } = require("../middleware/fileValidation");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// router.post("/", validateCreateTree,
//     (req, res, next) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       next();
//     },
//     fileValidation, treeController.createTree);
router.post("/create", authMiddleware, treeController.createTree);

// router.get('/get-admin-trees', checkRoleMiddleware('ADMIN'), treeController.getAllTrees)
router.get("/trees", treeController.getAllTrees);
router.get("/admin/tree/:id", checkRoleMiddleware('ADMIN'), treeController.getTreeById);

router.put("/admin/tree/:id",  checkRoleMiddleware('ADMIN'), treeController.updateTreeById);
router.delete("/admin/tree/:id", checkRoleMiddleware('ADMIN'), treeController.deleteTree);

router.get('/user-trees', treeController.getUserTrees)
router.post("/new-status", checkRoleMiddleware('ADMIN'), treeController.createStatus);
router.post("/new-note", checkRoleMiddleware('ADMIN'), treeController.createSpecialNote);
router.post("/new-env", checkRoleMiddleware('ADMIN'), treeController.createEnv);
router.post("/new-condition", checkRoleMiddleware('ADMIN'), treeController.createCondition);
router.get("/get-statuses", treeController.getStatus);
router.get("/get-envs", treeController.getEnvs);
router.get("/get-conditions", treeController.getConditions);
router.get("/get-notes", treeController.getNotes);
router.delete('/admin/status/:id', checkRoleMiddleware('ADMIN'), treeController.deleteStatus);
router.delete('/admin/note/:id', checkRoleMiddleware('ADMIN'), treeController.deleteSpecialNote);
router.delete('/admin/env/:id', checkRoleMiddleware('ADMIN'), treeController.deleteEnv);
router.delete('/admin/condition/:id', checkRoleMiddleware('ADMIN'), treeController.deleteCondition);
router.put("/status/update/:id", treeController.updateStatus);
router.put("/note/update/:id", treeController.updateSpecialNote);
router.put("/env/update/:id", treeController.updateEnv);
router.put("/condition/update/:id", treeController.updateCondition);




module.exports = router;
