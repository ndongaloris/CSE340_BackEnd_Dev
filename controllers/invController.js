const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build management view
 * ************************** */

invCont.buildManagement = async function(req, res, next){
    let nav = await utilities.getNav();
    const links = await utilities.getManagementLinks();
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav, 
        links,
    })
}

invCont.buildAddClassification = async function(req, res, next){
    let nav = await utilities.getNav();
    const form = await utilities.buildNewClassification();
    res.render("./inventory/add-classification", {
        title : "Add New Classification",
        nav, 
        form,
    })
}


invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const {classificationName} = req.body;
    const newClassification = await invModel.addClassification(classificationName);
    
    if (newClassification) {
        req.flash(
            "notice",
            `${classificationName} has been added as a classification.`
        )
        res.redirect("./")

    } else {
    req.flash("notice", "Classification not added, try again")
    res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
    })}
}

invCont.buildAddInventory = async function(req, res, next){
    let nav = await utilities.getNav();
    const selectList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
        title : "Add New Vehicle",
        nav, 
        selectList,
    })
}

invCont.addVehicle = async function(req, res, next){
    let nav = await utilities.getNav();
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body;
    const newVehicle = await invModel.addVehicle(
        classification_id,
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color,
    );
    
    if (newVehicle) {
        req.flash(
            "notice",
            `${inv_make} ${inv_model} has been added.`
        )
        res.redirect("./")

    } else {
        req.flash("notice", "Classification not added, try again")
        res.status(501).render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
        })
    }
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

// Controller function to handle requests for building a single inventory page
invCont.BuildSinglePageId = async function(req, res, next) {    
    // Extracting the vehicle ID from the request parameters
    const vehicleId = req.params.singleViewId;
    
    // Retrieving inventory data for the specified vehicle ID
    const data = await invModel.getInventory(vehicleId);
    
    // Building a single view of the inventory data
    const singleView = await utilities.BuildSingleView(data);
    
    // Retrieving navigation data
    let nav = await utilities.getNav();
    
    // Generating a title for the single view based on the vehicle details
    const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
    
    // Rendering the single view page with the retrieved data
    res.render("./inventory/singleView", {
        title: className, // Title for the page
        nav, // Navigation data
        singleView, // Single view data
    });
};

invCont.serverError = (req, res, next) => {
    const error = new Error("yep");
    next(error);
}

module.exports = invCont;