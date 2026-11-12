
// Import the organizations model
import {
    getAllOrganizations,
    getOrganizationDetails
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

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

// Export the controller
export { showOrganizationsPage, showOrganizationDetailsPage };
