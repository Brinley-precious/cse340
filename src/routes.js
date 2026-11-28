
import express from 'express';
import { showHomePage } from './controllers/index.js';
import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsers
} from './controllers/users.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home page
router.get('/', showHomePage);

// Organization routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Admin-only organization routes
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post(
    '/new-organization',
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

// Project routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Admin-only project routes
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post(
    '/new-project',
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post(
    '/edit-project/:id',
    requireRole('admin'),
    projectValidation,
    processEditProjectForm
);

// Category routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Admin-only category routes
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post(
    '/new-category',
    requireRole('admin'),
    categoryValidation,
    processNewCategoryForm
);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post(
    '/edit-category/:id',
    requireRole('admin'),
    categoryValidation,
    processEditCategoryForm
);

// Admin-only project category assignment routes
router.get(
    '/assign-categories/:projectId',
    requireRole('admin'),
    showAssignCategoriesForm
);
router.post(
    '/assign-categories/:projectId',
    requireRole('admin'),
    processAssignCategoriesForm
);

// Error testing route
router.get('/test-error', testErrorPage);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireRole('admin'), showUsers);

export default router;
