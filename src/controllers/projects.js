
// Import the projects model
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define the projects page controller
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS); // Get the upcoming projects
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

// Define the project details page controller
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    res.render('project', { title: project.title, project });
};

// Export the controller
export { showProjectsPage, showProjectDetailsPage };
