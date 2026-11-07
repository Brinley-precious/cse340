-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

-- Create the project table
CREATE TABLE IF NOT EXISTS public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES public.organization(organization_id)
);

-- Insert five projects for BrightFuture Builders
INSERT INTO public.project
    (organization_id, title, description, location, date)
VALUES
(
    (SELECT organization_id FROM public.organization WHERE name = 'BrightFuture Builders'),
    'Community Library Renovation',
    'Renovating a local library to provide a better learning environment for children and adults.',
    'Ikeja, Lagos',
    '2026-11-20'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'BrightFuture Builders'),
    'Safe Playground Project',
    'Building a safe and accessible playground for children in the community.',
    'Surulere, Lagos',
    '2026-11-25'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'BrightFuture Builders'),
    'Community Road Improvement',
    'Improving damaged community roads to make transportation safer and easier.',
    'Yaba, Lagos',
    '2026-12-02'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'BrightFuture Builders'),
    'School Classroom Repairs',
    'Repairing classroom facilities to create a more comfortable learning space.',
    'Agege, Lagos',
    '2026-12-05'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'BrightFuture Builders'),
    'Public Sanitation Facility',
    'Constructing and improving public sanitation facilities for residents.',
    'Mushin, Lagos',
    '2026-12-10'
);

-- Insert five projects for GreenHarvest Growers
INSERT INTO public.project
    (organization_id, title, description, location, date)
VALUES
(
    (SELECT organization_id FROM public.organization WHERE name = 'GreenHarvest Growers'),
    'Community Vegetable Garden',
    'Creating a shared vegetable garden where residents can grow fresh produce.',
    'Lekki, Lagos',
    '2026-11-22'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'GreenHarvest Growers'),
    'Urban Farming Training',
    'Teaching residents practical urban farming and sustainable food production skills.',
    'Ajah, Lagos',
    '2026-11-28'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'GreenHarvest Growers'),
    'Tree Planting Initiative',
    'Planting trees to improve green spaces and environmental awareness.',
    'Victoria Island, Lagos',
    '2026-12-03'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'GreenHarvest Growers'),
    'School Gardening Programme',
    'Helping students learn about food production through hands-on gardening.',
    'Maryland, Lagos',
    '2026-12-07'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'GreenHarvest Growers'),
    'Food Sustainability Campaign',
    'Educating local households about reducing food waste and sustainable food choices.',
    'Ikorodu, Lagos',
    '2026-12-12'
);

-- Insert five projects for UnityServe Volunteers
INSERT INTO public.project
    (organization_id, title, description, location, date)
VALUES
(
    (SELECT organization_id FROM public.organization WHERE name = 'UnityServe Volunteers'),
    'Community Clean-Up Day',
    'Bringing volunteers together to clean public spaces and improve the local environment.',
    'Festac Town, Lagos',
    '2026-11-23'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'UnityServe Volunteers'),
    'Food Donation Drive',
    'Collecting and distributing food supplies to families experiencing food insecurity.',
    'Apapa, Lagos',
    '2026-11-29'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'UnityServe Volunteers'),
    'Children Reading Programme',
    'Supporting children through reading sessions and educational activities.',
    'Oshodi, Lagos',
    '2026-12-04'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'UnityServe Volunteers'),
    'Elderly Care Outreach',
    'Organising volunteers to provide companionship and basic support to older residents.',
    'Anthony, Lagos',
    '2026-12-08'
),
(
    (SELECT organization_id FROM public.organization WHERE name = 'UnityServe Volunteers'),
    'Community Health Awareness',
    'Sharing basic health information and connecting residents with community health resources.',
    'Badagry, Lagos',
    '2026-12-14'
);


-- ========================================
-- Category Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project Category Junction Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    CONSTRAINT pk_project_category
        PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id)
        REFERENCES public.project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id)
        REFERENCES public.category(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert Service Project Categories
-- ========================================

INSERT INTO public.category (name)
VALUES
    ('Environment'),
    ('Education'),
    ('Community Support'),
    ('Health and Wellness')
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- Associate Projects with Categories
-- ========================================

INSERT INTO public.project_category (project_id, category_id)
SELECT
    p.project_id,
    c.category_id
FROM (
    VALUES
        ('Community Library Renovation', 'Education'),
        ('Community Library Renovation', 'Community Support'),

        ('Safe Playground Project', 'Community Support'),
        ('Safe Playground Project', 'Environment'),

        ('Community Road Improvement', 'Environment'),
        ('Community Road Improvement', 'Community Support'),

        ('School Classroom Repairs', 'Education'),
        ('School Classroom Repairs', 'Community Support'),

        ('Public Sanitation Facility', 'Environment'),
        ('Public Sanitation Facility', 'Community Support'),

        ('Community Vegetable Garden', 'Environment'),
        ('Community Vegetable Garden', 'Community Support'),

        ('Urban Farming Training', 'Education'),
        ('Urban Farming Training', 'Environment'),

        ('Tree Planting Initiative', 'Environment'),

        ('School Gardening Programme', 'Education'),
        ('School Gardening Programme', 'Environment'),

        ('Food Sustainability Campaign', 'Environment'),
        ('Food Sustainability Campaign', 'Education'),

        ('Community Clean-Up Day', 'Environment'),
        ('Community Clean-Up Day', 'Community Support'),

        ('Food Donation Drive', 'Community Support'),

        ('Children Reading Programme', 'Education'),
        ('Children Reading Programme', 'Community Support'),

        ('Elderly Care Outreach', 'Community Support'),

        ('Community Health Awareness', 'Community Support'),
        ('Community Health Awareness', 'Health and Wellness')
) AS project_category_data(project_title, category_name)

INNER JOIN public.project AS p
    ON p.title = project_category_data.project_title

INNER JOIN public.category AS c
    ON c.name = project_category_data.category_name

ON CONFLICT (project_id, category_id) DO NOTHING;
