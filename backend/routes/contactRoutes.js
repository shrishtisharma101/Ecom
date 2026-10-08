const express = require("express");

const router = express.Router();

const {
  submitContact,
  getContacts,
  deleteContact,
} = require("../controllers/contactController");


// ==========================================
// GET ALL CONTACTS - ADMIN
// GET /api/contact
// ==========================================

router.get("/", getContacts);


// ==========================================
// SUBMIT CONTACT FORM - USER
// POST /api/contact
// ==========================================

router.post("/", submitContact);


// ==========================================
// DELETE CONTACT - ADMIN
// DELETE /api/contact/:id
// ==========================================

router.delete("/:id", deleteContact);


module.exports = router;
