import {
    getUpcomingProjects,
    getProjectDetails,
    createProject
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// Define validation rules for the new project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ max: 999 })
        .withMessage('Project description must be less than 1000 characters'),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required')
        .isLength({ max: 199 })
        .withMessage('Project location must be less than 200 characters'),

    body('date')
        .notEmpty()
        .withMessage('Project date is required')
        .isISO8601()
        .withMessage('Please provide a valid project date'),

    body('organizationId')
        .notEmpty()
        .withMessage('Please select an organization')
        .isInt()
        .withMessage('Please select a valid organization')
];

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define the projects page controller
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

// Define the project details page controller
const showProjectDetailsPage = async (req, res, next) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const categories = await getCategoriesByProjectId(projectId);
    const title = project.title;

    res.render('project', { title, project, categories });
};

// Display the new project form
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

// Process the new project form submission

const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    // Extract project information from the submitted form
    const { organizationId, title, description, location, date } = req.body;

    try {
        // Insert the new project into the database
        await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        // Display success message
        req.flash('success', 'Service project added successfully!');

        // Redirect to the projects page
        return res.redirect('/projects');

    } catch (error) {
        console.error('Error creating new project:', error);

        req.flash('error', 'There was an error creating the service project.');

        return res.redirect('/new-project');
    }
};


// Export the controllers
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
};
