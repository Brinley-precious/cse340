
// Import the categories model
import { getAllCategories } from '../models/categories.js';

// Define the categories page controller
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Project Categories';

    res.render('categories', { title, categories });
};

// Export the controller
export { showCategoriesPage };
