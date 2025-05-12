const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/' , async(requestAnimationFrame,res)=>{
    try{
        res.json('Welcome to HRAPI');
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/locations-last-four-chars', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT location_id, postal_code, RIGHT(postal_code, 4) AS last_four_chars 
            FROM locations 
            WHERE postal_code IS NOT NULL;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/jobs-first-three-chars', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT job_id, job_title, SUBSTRING(job_title FROM 1 FOR 3) AS first_three_chars 
            FROM jobs 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});





app.get('/countries-uppercase-name', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT country_id, country_name, UPPER(country_name) AS uppercase_country_name 
            FROM countries 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


app.get('/employees-first-name-length', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT employee_id, first_name, LENGTH(first_name) AS first_name_length 
            FROM employees 
            ORDER BY first_name_length DESC, first_name 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});





app.get('/jobs-with-high-average-salary', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT job_title, AVG(salary) AS avg_salary 
            FROM employees e 
            JOIN jobs j ON e.job_id = j.job_id 
            GROUP BY job_title 
            HAVING AVG(salary) > 15000 
            ORDER BY avg_salary DESC 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/departments-with-more-than-5-employees', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.department_id, d.department_name, COUNT(e.employee_id) AS employee_count 
            FROM departments d 
            JOIN employees e ON d.department_id = e.department_id 
            GROUP BY d.department_id, d.department_name 
            HAVING COUNT(e.employee_id) > 5 
            ORDER BY employee_count DESC 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/country-location-count', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.country_id, c.country_name, COUNT(l.location_id) AS number_of_locations 
            FROM countries c 
            LEFT JOIN locations l ON c.country_id = l.country_id 
            GROUP BY c.country_id, c.country_name 
            ORDER BY number_of_locations DESC 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/lowest-paid-employees', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT employee_id, first_name, last_name, salary
            FROM employees
            ORDER BY salary ASC
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/latest-hired-employees', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT employee_id, first_name, last_name 
            FROM employees 
            ORDER BY hire_date DESC 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/region-postal-code-length', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.region_id, r.region_name, MIN(LENGTH(l.postal_code)) AS min_postal_code_length 
            FROM regions r 
            INNER JOIN countries c ON r.region_id = c.region_id 
            INNER JOIN locations l ON c.country_id = l.country_id 
            WHERE l.postal_code IS NOT NULL 
            GROUP BY r.region_id, r.region_name 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/departments-with-highest-salary', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.department_id, d.department_name, MAX(e.salary) AS max_salary 
            FROM departments d 
            INNER JOIN employees e ON d.department_id = e.department_id 
            INNER JOIN job_history jh ON e.employee_id = jh.employee_id 
            GROUP BY d.department_id, d.department_name 
            HAVING MAX(e.salary) >= 7000 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/employees-below-average-salary', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.first_name, e.last_name, e.salary, e.department_id 
            FROM employees e 
            WHERE e.salary < (SELECT AVG(salary) FROM employees) 
            AND e.department_id = (SELECT department_id FROM employees WHERE first_name = 'Laura') 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/highest-salary-in-hire-range', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, e.salary, d.department_name, l.city 
            FROM employees e 
            INNER JOIN departments d ON e.department_id = d.department_id 
            INNER JOIN locations l ON d.location_id = l.location_id 
            WHERE e.salary = (
                SELECT MAX(salary) 
                FROM employees 
                WHERE hire_date BETWEEN '2002-01-01' AND '2003-12-31'
            );
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});





app.get('/managers', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT employee_id, first_name, last_name 
            FROM employees 
            WHERE employee_id IN (SELECT manager_id FROM employees)
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/employee-salary-percentage', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, e.salary, e.department_id, d.department_name,
                   (e.salary / dept_stats.total_dept_salary) * 100 AS salary_percentage
            FROM employees e
            INNER JOIN departments d ON e.department_id = d.department_id
            INNER JOIN (
                SELECT department_id, SUM(salary) AS total_dept_salary 
                FROM employees 
                GROUP BY department_id
            ) dept_stats ON e.department_id = dept_stats.department_id
            WHERE e.salary > (dept_stats.total_dept_salary * 0.5);
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});






app.get('/employees-in-uk', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, e.job_id, d.department_name, l.city, c.country_name
            FROM employees e 
            INNER JOIN departments d ON e.department_id = d.department_id 
            INNER JOIN locations l ON d.location_id = l.location_id 
            INNER JOIN countries c ON l.country_id = c.country_id 
            WHERE c.country_name = 'United Kingdom' 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


app.get('/emp-salary-status', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT employee_id, first_name, last_name, salary, 
                   CASE 
                       WHEN salary > (SELECT AVG(salary) FROM employees) THEN 'HIGH' 
                       ELSE 'LOW' 
                   END AS salary_status 
            FROM employees 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/department-employee-salary-summary', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.department_id, COUNT(e.employee_id) AS total_employees, SUM(e.salary) AS total_salary
            FROM departments d 
            INNER JOIN employees e ON d.department_id = e.department_id 
            GROUP BY d.department_id 
            HAVING COUNT(e.employee_id) > 0
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/employees-in-toronto', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, j.job_title, l.city 
            FROM employees e 
            INNER JOIN jobs j ON e.job_id = j.job_id 
            INNER JOIN departments d ON e.department_id = d.department_id 
            INNER JOIN locations l ON d.location_id = l.location_id 
            WHERE l.city = 'Toronto' 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});





app.get('/employees-higher-than-average-salary', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, e.salary 
            FROM employees e 
            WHERE e.salary > (SELECT AVG(salary) FROM employees) 
            AND e.department_id IN (
                SELECT department_id 
                FROM employees 
                WHERE first_name LIKE '%J%' OR last_name LIKE '%J%'
            )
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/highest-salary-offset', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * 
            FROM employees 
            ORDER BY salary DESC 
            LIMIT 1 OFFSET 2;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


app.get('/employees-lowest-salary-per-department', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.first_name, e.last_name, e.salary, d.department_id
            FROM employees e
            INNER JOIN departments d ON e.department_id = d.department_id
            WHERE e.salary = (
                SELECT MIN(salary)
                FROM employees
                WHERE department_id = e.department_id
            )
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/employees-by-country', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, c.country_name
            FROM employees e
            INNER JOIN departments d ON e.department_id = d.department_id
            INNER JOIN locations l ON d.location_id = l.location_id
            INNER JOIN countries c ON c.country_id = l.country_id
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/employees-no-commission', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.first_name, e.last_name, j.job_title, jh.start_date, jh.end_date
            FROM employees e
            INNER JOIN jobs j ON e.job_id = j.job_id
            INNER JOIN job_history jh ON j.job_id = jh.job_id
            WHERE e.commission_pct IS NULL
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/locations-with-multiple-employees', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.country_name, l.city, COUNT(d.department_id) AS number_of_departments
            FROM countries c
            INNER JOIN locations l ON c.country_id = l.country_id
            INNER JOIN departments d ON l.location_id = d.location_id
            INNER JOIN employees e ON d.department_id = e.department_id
            GROUP BY c.country_name, l.city
            HAVING COUNT(e.employee_id) >= 2
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/job-history-between-dates', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.first_name, e.last_name, j.job_title, d.department_name, jh.start_date
            FROM job_history jh
            INNER JOIN employees e ON e.employee_id = jh.employee_id
            INNER JOIN departments d ON e.department_id = d.department_id
            INNER JOIN jobs j ON j.job_id = e.job_id
            WHERE jh.start_date >= '1993-01-01' AND jh.end_date <= '1997-08-31'
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/employee-department-location', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, e.email, e.phone_number,
                   d.department_id, d.department_name, l.location_id, l.city, l.state_province
            FROM employees e
            INNER JOIN departments d ON e.department_id = d.department_id
            INNER JOIN locations l ON d.location_id = l.location_id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


app.get('/department-avg-commission', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.department_id, d.department_name, 
                   AVG(e.commission_pct) AS avg_commission_pct,
                   COUNT(e.employee_id) AS employee_count
            FROM departments d
            LEFT JOIN employees e ON d.department_id = e.department_id
            GROUP BY d.department_id, d.department_name
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


app.get('/employee-count-per-department', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT department_id, COUNT(*) AS employee_count
            FROM employees
            GROUP BY department_id
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/employee-count-per-department', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT department_id, COUNT(*) AS employee_count
            FROM employees
            GROUP BY department_id
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/employees-multiple-jobs', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.first_name, e.last_name
            FROM employees e
            INNER JOIN (
                SELECT employee_id
                FROM job_history
                GROUP BY employee_id
                HAVING COUNT(employee_id) > 1
            ) jh ON e.employee_id = jh.employee_id
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/employees-no-department', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT employee_id, first_name, last_name
            FROM employees
            WHERE department_id IS NULL
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


app.get('/high-salary-employees', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.first_name, e.last_name, e.salary, j.job_title
            FROM employees e
            INNER JOIN jobs j ON e.job_id = j.job_id
            WHERE e.salary > (
                SELECT AVG(salary)
                FROM employees
                WHERE department_id = e.department_id
            )
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/departments-below-avg-commission', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.department_id, d.department_name
            FROM departments d
            INNER JOIN employees e ON d.department_id = e.department_id
            WHERE e.commission_pct < (
                SELECT AVG(commission_pct)
                FROM employees
            )
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/departments-n-cities', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.department_name, l.city
            FROM departments d
            INNER JOIN locations l ON d.location_id = l.location_id
            WHERE l.city LIKE 'N%'
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/locations-in-asia', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT l.street_address, l.city, c.country_id, r.region_name
            FROM locations l
            INNER JOIN countries c ON l.country_id = c.country_id
            INNER JOIN regions r ON c.region_id = r.region_id
            WHERE r.region_name LIKE 'Asia'
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



app.get('/employees-same-as-dept-manager', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.first_name, e.last_name, e.manager_id, j.job_title
            FROM employees e
            INNER JOIN jobs j ON e.job_id = j.job_id
            INNER JOIN departments d ON d.department_id = e.department_id
            WHERE d.manager_id = e.manager_id
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


app.get('/employees-with-managers', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.first_name AS employee_first_name,
                   e.last_name AS employee_last_name,
                   m.first_name AS manager_first_name,
                   m.last_name AS manager_last_name,
                   m.commission_pct AS manager_commission_pct
            FROM employees e
            INNER JOIN departments d ON e.department_id = d.department_id
            INNER JOIN employees m ON d.manager_id = m.employee_id
            WHERE m.commission_pct > 0.15
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


app.get('/emp-full-details', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                e.first_name AS employee_first_name, 
                e.last_name AS employee_last_name, 
                m.first_name AS manager_first_name, 
                m.last_name AS manager_last_name, 
                j.job_title, 
                d.department_name, 
                l.city 
             FROM employees e 
             INNER JOIN employees m ON e.manager_id = m.employee_id 
             INNER JOIN jobs j ON e.job_id = j.job_id 
             INNER JOIN departments d ON e.department_id = d.department_id 
             INNER JOIN locations l ON d.location_id = l.location_id 
             LIMIT 10`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/emp-details', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                e.first_name AS employee_first_name, 
                e.last_name AS employee_last_name, 
                m.first_name AS manager_first_name, 
                m.last_name AS manager_last_name, 
                j.job_title, 
                d.department_name 
             FROM employees e 
             INNER JOIN employees m ON e.manager_id = m.employee_id 
             INNER JOIN jobs j ON e.job_id = j.job_id 
             INNER JOIN departments d ON e.department_id = d.department_id 
             LIMIT 10`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.get('/emp-jobs', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                e.first_name, 
                e.last_name, 
                j.job_title, 
                d.department_name, 
                l.city 
             FROM employees e 
             INNER JOIN jobs j ON e.job_id = j.job_id 
             INNER JOIN departments d ON e.department_id = d.department_id 
             INNER JOIN locations l ON d.location_id = l.location_id 
             LIMIT 10`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/emp-managers', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                e.first_name AS employee_first_name, 
                e.last_name AS employee_last_name, 
                m.first_name AS manager_first_name, 
                m.last_name AS manager_last_name, 
                d.department_name, 
                l.city 
             FROM employees e 
             INNER JOIN employees m ON e.manager_id = m.employee_id 
             INNER JOIN departments d ON e.department_id = d.department_id 
             INNER JOIN locations l ON d.location_id = l.location_id 
             LIMIT 10`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/emp-count', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT e.first_name, e.last_name, d.department_name, l.city, c.country_name
             FROM employees e
             INNER JOIN departments d ON e.department_id = d.department_id
             INNER JOIN locations l ON d.location_id = l.location_id
             INNER JOIN countries c ON l.country_id = c.country_id
             LIMIT 10`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/emp-dept-city', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.first_name, 
                e.last_name, 
                d.department_name, 
                l.city 
            FROM 
                departments d 
                LEFT JOIN employees e ON e.department_id = d.department_id 
                INNER JOIN locations l ON d.location_id = l.location_id 
            LIMIT 10;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});




app.get('/emp-count' ,async(req,res) =>{
    try{
        const result = await pool.query(
            
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }cd 
});


app.get('/emp-count' ,async(req,res) =>{
    try{
        const result = await pool.query(
            `
            SELECT 
                c.country_name, 
                r.region_name, 
                l.street_address 
            FROM 
                locations l 
                LEFT JOIN countries c ON l.country_id = c.country_id 
                INNER JOIN regions r ON r.region_id = c.region_id 
            LIMIT 10;
        `
            
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }cd 
});

app.get('/emp-count' ,async(req,res) =>{
    try{
        const result = await pool.query(
`
            SELECT 
                l.location_id,
                l.street_address, 
                l.city, 
                l.postal_code,
                c.country_id,
                c.country_name, 
                r.region_id,
                r.region_name 
            FROM 
                locations l 
            JOIN 
                countries c ON l.country_id = c.country_id 
            JOIN 
                regions r ON r.region_id = c.region_id 
            ORDER BY
                l.city, c.country_name
            LIMIT $1 OFFSET $2
        `
            
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }cd 
});

app.get('/emp-count' ,async(req,res) =>{
    try{
        const result = await pool.query(
            `
            SELECT 
                e.first_name, 
                e.last_name, 
                j.job_title, 
                c.country_name,
                jh.start_date,
                jh.end_date,
                d.department_name,
                l.city
            FROM 
                job_history jh 
            INNER JOIN 
                employees e ON jh.employee_id = e.employee_id 
            INNER JOIN 
                departments d ON d.department_id = jh.department_id 
            INNER JOIN 
                jobs j ON j.job_id = jh.job_id 
            INNER JOIN 
                locations l ON l.location_id = d.location_id
            INNER JOIN 
                countries c ON c.country_id = l.country_id
            ORDER BY 
                e.last_name, e.first_name, jh.start_date
            LIMIT 10
        `
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }cd 
});

app.get('/emp-count' ,async(req,res) =>{
    try{
        const result = await pool.query(
            `
            SELECT 
                e.first_name, 
                e.last_name, 
                j.job_title, 
                l.street_address,
                l.city,
                l.state_province,
                l.postal_code,
                c.country_name,
                jh.start_date,
                jh.end_date
            FROM 
                job_history jh 
            INNER JOIN 
                employees e ON jh.employee_id = e.employee_id 
            INNER JOIN 
                departments d ON d.department_id = jh.department_id 
            INNER JOIN 
                jobs j ON j.job_id = jh.job_id 
            INNER JOIN 
                locations l ON l.location_id = d.location_id
            INNER JOIN
                countries c ON l.country_id = c.country_id
            ORDER BY 
                e.last_name, e.first_name, jh.start_date
            LIMIT 10
        `
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }cd 
});

app.get('/emp-count' ,async(req,res) =>{
    try{
        const result = await pool.query(

            `
            SELECT 
                e.first_name, 
                e.last_name, 
                j.job_title, 
                d.department_name,
                jh.start_date,
                jh.end_date
            FROM 
                job_history jh 
            INNER JOIN 
                employees e ON jh.employee_id = e.employee_id 
            INNER JOIN 
                departments d ON d.department_id = jh.department_id 
            INNER JOIN 
                jobs j ON j.job_id = jh.job_id 
            ORDER BY 
                e.last_name, e.first_name, jh.start_date
            LIMIT 10
        `
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }cd 
});




app.get('/emp-count' ,async(req,res) =>{
    try{
        const result = await pool.query( 
            `
            SELECT 
                e.employee_id, 
                e.first_name, 
                e.last_name, 
                jh.start_date, 
                jh.end_date, 
                j.job_title 
            FROM 
                job_history jh 
            INNER JOIN 
                employees e ON e.employee_id = jh.employee_id 
            INNER JOIN 
                jobs j ON j.job_id = jh.job_id 
            ORDER BY 
                e.employee_id, jh.start_date
            LIMIT 10
        `
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }cd 
});

app.get('/emp-count' ,async(req,res) =>{
    try{
        const result = await pool.query(  
            `
            SELECT 
                e.employee_id, 
                e.first_name, 
                e.last_name, 
                jh.start_date, 
                jh.end_date, 
                jh.job_id,
                d.department_name 
            FROM 
                job_history jh 
            INNER JOIN 
                employees e ON e.employee_id = jh.employee_id 
            INNER JOIN 
                departments d ON d.department_id = jh.department_id 
            ORDER BY 
                e.employee_id, jh.start_date
            LIMIT 10
        `
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }cd 
});


app.get('/Qone-c' ,async(req,res) =>{
    try{
        const result = await pool.query(
            `
            SELECT 
                e.employee_id, 
                e.first_name, 
                e.last_name, 
                l.street_address, 
                l.city, 
                l.state_province,
                c.country_name 
            FROM 
                employees e 
                INNER JOIN departments d ON e.department_id = d.department_id 
                INNER JOIN locations l ON l.location_id = d.location_id 
                INNER JOIN countries c ON c.country_id = l.country_id 
            LIMIT $1 OFFSET $2
        `
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/emp-count' ,async(req,res) =>{
    try{
        const result = await pool.query( `
            SELECT 
                e.employee_id, 
                e.first_name, 
                e.last_name, 
                jh.start_date,
                jh.end_date, 
                jh.job_id,
                j.job_title  -- Added job title for more complete information
            FROM 
                employees e 
            LEFT JOIN 
                job_history jh ON jh.employee_id = e.employee_id
            LEFT JOIN
                jobs j ON jh.job_id = j.job_id  -- Added join to get job titles
            ORDER BY
                e.employee_id, jh.start_date DESC  -- Better sorting
            LIMIT $1 OFFSET $2
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }cd 
});

app.get('/employee-details', async (req, res) => {
    try {
        const query = `
            SELECT 
                e.employee_id, 
                e.first_name, 
                e.last_name, 
                jh.start_date, 
                jh.end_date, 
                jh.job_id,
                d.department_name, 
                l.street_address, 
                l.city 
            FROM 
                employees e 
            LEFT JOIN 
                job_history jh ON jh.employee_id = e.employee_id 
            INNER JOIN 
                departments d ON e.department_id = d.department_id 
            INNER JOIN 
                locations l ON d.location_id = l.location_id 
            ORDER BY 
                e.employee_id
            LIMIT 10
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching employee details:', err);
        res.status(500).json({ error: 'Failed to fetch employee details', details: err.message });
    }
});



app.get('/emp-count' ,async(req,res) =>{
    try{
        const result = await pool.query(    
             `
            SELECT 
                e.employee_id, 
                e.first_name, 
                e.last_name, 
                jh.start_date, 
                jh.end_date, 
                jh.job_id,
                c.country_name 
            FROM 
                employees e 
            LEFT JOIN 
                job_history jh ON jh.employee_id = e.employee_id
            INNER JOIN 
                departments d ON e.department_id = d.department_id 
            INNER JOIN 
                locations l ON d.location_id = l.location_id 
            INNER JOIN 
                countries c ON l.country_id = c.country_id 
            ORDER BY 
                e.employee_id
            LIMIT 10
        `
        )   ;
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }cd 
});




app.get('/JOB_HISTORY-count' ,async(req,res) =>{
    try{
        const result = await pool.query(

            `
            SELECT 
                e.employee_id, 
                e.first_name, 
                e.last_name, 
                jh.start_date,
                jh.end_date, 
                jh.job_id 
            FROM 
                employees e 
            RIGHT JOIN 
                job_history jh ON jh.employee_id = e.employee_id
            ORDER BY
                jh.start_date DESC
            LIMIT $1 OFFSET $2
        `
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});




const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Connect Successfully...on PORT ${PORT}`);
});