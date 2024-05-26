// Needed Resources 
const express = require("express"); // Importing Express framework
const router = new express.Router(); // Creating a new router instance
const invController = require("../controllers/invController"); // Importing inventory controller
const utilities = require("../utilities"); // Importing utility functions
const classValidate = require('../utilities/management-validation'); // Importing validation functions

/***********************
 * Get section
************************/

// Route to display the management page
router.get("/", invController.buildManagement);

// Route to build the ability to add a classification
router.get("/add-classification", invController.buildAddClassification);

// Route to add the ability to add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to handle requests for building inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to handle requests for building a single inventory page
router.get("/detail/:singleViewId",utilities.handleErrors(invController.BuildSinglePageId));

// Route to trigger intentional error
router.get("/serverError", utilities.handleErrors(invController.serverError));

// Route to get inventory data in JSON format
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to update an item in the inventory
router.get("/edit/:inventoryId", utilities.handleErrors(invController.editInventory));

// Route to delete an item in the inventory
router.get("/delete/:inventoryId", utilities.handleErrors(invController.deleteItem));

/*****************************
 * Post Section
 * ***************************/ 

// Route to process adding a classification
router.post(
    "/add-classification",
    classValidate.classificationRules(), 
    classValidate.checkClassificationData, 
    utilities.handleErrors(invController.addClassification)
);

// Route to process adding inventory
router.post(
    "/add-inventory", 
    classValidate.inventoryRules(), 
    classValidate.checkInventoryData,
    utilities.handleErrors(invController.addVehicle)
);

// Route to process updating inventory
router.post("/update/", utilities.handleErrors(invController.updateInventory));

// Route to process deleting inventory
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router; // Exporting the router for use in other modules
