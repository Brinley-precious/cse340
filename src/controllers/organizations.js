
// Import the organizations model
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';


// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),

    body('description')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),

    body('contactEmail')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

// Define the organizations page controller
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res, next) => {
    const organizationId = req.params.id;

    const organizationDetails = await getOrganizationDetails(organizationId);

    // Check whether the organization exists
    if (!organizationDetails) {
        const err = new Error('Organization Not Found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', { title, organizationDetails, projects });
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

const showEditOrganizationForm = async (req, res, next) => {
    const organizationId = req.params.id;

    const organizationDetails = await getOrganizationDetails(organizationId);

    // Check whether the organization exists
    if (!organizationDetails) {
        const err = new Error('Organization Not Found');
        err.status = 404;
        return next(err);
    }

    const title = 'Edit Organization';

    res.render('edit-organization', { title, organizationDetails });
};

const processNewOrganizationForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png';

    const organizationId = await createOrganization(
        name,
        description,
        contactEmail,
        logoFilename
    );

    req.flash('success', 'Organization added successfully!');

    res.redirect(`/organization/${organizationId}`);
};

const processEditOrganizationForm = async (req, res, next) => {
    const organizationId = req.params.id;

    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {
        // Display validation errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit form
        return res.redirect(`/edit-organization/${organizationId}`);
    }

    const { name, description, contactEmail, logoFilename } = req.body;

    const updatedOrganizationId = await updateOrganization(
        organizationId,
        name,
        description,
        contactEmail,
        logoFilename
    );

    // Check whether the organization was updated
    if (!updatedOrganizationId) {
        const err = new Error('Organization Not Found');
        err.status = 404;
        return next(err);
    }

    req.flash('success', 'Organization updated successfully!');

    res.redirect(`/organization/${organizationId}`);
};

// Export the controller
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};