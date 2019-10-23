-- use this to remove a table
DROP TABLE IF EXISTS salaries;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS titles;
DROP TABLE IF EXISTS dept_emp;
DROP TABLE IF EXISTS dept_manager;
DROP TABLE IF EXISTS employees;

-- create six tables, one for each csv file to import
CREATE TABLE departments (
	dept_no VARCHAR NOT NULL,
	dept_name VARCHAR NOT NULL,
	PRIMARY KEY (dept_no)
);

CREATE TABLE employees (
	emp_no integer NOT NULL,
	birth_date Date,
	first_name character varying NOT NULL,
	last_name character varying NOT NULL,
	gender character varying NOT NULL,
	hire_date Date,
	PRIMARY KEY (emp_no)
);

CREATE TABLE dept_emp (
	emp_no integer NOT NULL,
	dept_no VARCHAR NOT NULL,
	from_date Date,
	to_date Date,
	FOREIGN KEY (emp_no) REFERENCES employees(emp_no),
	FOREIGN KEY (dept_no) REFERENCES departments(dept_no)
);

CREATE TABLE dept_manager (
	dept_no VARCHAR NOT NULL,
	emp_no integer NOT NULL,
	from_date Date,
	to_date Date,
	FOREIGN KEY (emp_no) REFERENCES employees(emp_no),
	FOREIGN KEY (dept_no) REFERENCES departments(dept_no)
);

CREATE TABLE salaries (
	emp_no integer NOT NULL,
	salary integer NOT NULL,
	from_date Date,
	to_date Date
);

ALTER TABLE salaries
ADD FOREIGN KEY (emp_no) REFERENCES employees(emp_no);

CREATE TABLE titles (
	emp_no integer NOT NULL,
	titles character varying NOT NULL,
	from_date Date,
	to_date Date
);

ALTER TABLE titles
ADD FOREIGN KEY (emp_no) REFERENCES employees(emp_no);

-- there are 6 datasets to import, confirm they look as expected
SELECT * FROM departments LIMIT 10;
SELECT * FROM dept_emp LIMIT 10;
SELECT * FROM employees LIMIT 10;
SELECT * FROM dept_manager LIMIT 10;
SELECT * FROM salaries LIMIT 10;
SELECT * FROM titles LIMIT 10;

-- Homework queries 1-8
-- (1) List the following details of each employee: employee number, last name, first name, gender, and salary
SELECT employees.emp_no, employees.last_name, employees.first_name, employees.gender, salaries.salary
FROM salaries
INNER JOIN employees ON
employees.emp_no=salaries.emp_no
ORDER BY (emp_no) ASC;

-- (2) List employees who were hired in 1986
SELECT emp_no, last_name, first_name, gender, hire_date
FROM employees
WHERE hire_date >= '1986-01-01' AND hire_date <= '1986-12-31'
ORDER BY (hire_date) ASC;

or

SELECT emp_no, last_name, first_name, gender, hire_date
FROM employees
WHERE hire_date between '1986-01-01' AND '1986-12-31'
ORDER BY (hire_date) ASC;

-- (3) List the manager of each department with the following information: department number, department  
-- name, the manager's employee number, last name, first name, and start and end employment dates
SELECT d.dept_no, d.dept_name, de.emp_no, e.last_name, e.first_name, de.from_date, de.to_date
FROM dept_emp de
JOIN titles t ON t.emp_no=de.emp_no
JOIN employees e ON	e.emp_no=de.emp_no
JOIN departments d ON d.dept_no=de.dept_no
WHERE titles = 'Manager'
ORDER BY (dept_no) ASC;
		
-- (4)List the department of each employee with the following information: employee number, 
-- last name, first name, and department name
SELECT de.emp_no, e.last_name, e.first_name, d.dept_name
FROM dept_emp de
JOIN employees e ON	e.emp_no=de.emp_no
JOIN departments d ON d.dept_no=de.dept_no
ORDER BY (emp_no) ASC;

-- (5) List all employees whose first name is "Hercules" and last names begin with "B"
SELECT first_name, last_name
FROM employees
WHERE first_name = 'Hercules' AND last_name LIKE 'B%'
ORDER BY (last_name) ASC;

-- (6) List all employees in the Sales department, including their employee number, 
-- last name, first name, and department name
SELECT de.emp_no, e.last_name, e.first_name, d.dept_name
FROM dept_emp de
JOIN employees e ON	e.emp_no=de.emp_no
JOIN departments d ON d.dept_no=de.dept_no
WHERE dept_name = 'Sales'
ORDER BY (emp_no) ASC;

-- (7) List all employees in the Sales and Development departments, including 
-- their employee number, last name, first name, and department name
SELECT de.emp_no, e.last_name, e.first_name, d.dept_name
FROM dept_emp de
JOIN employees e ON	e.emp_no=de.emp_no
JOIN departments d ON d.dept_no=de.dept_no
WHERE dept_name = 'Sales' OR dept_name = 'Development'
ORDER BY (emp_no) ASC;

-- (8) In descending order, list the frequency count of employee last names, 
-- i.e., how many employees share each last name
SELECT last_name, COUNT(last_name) AS "Employees with this last_name"
FROM employees
GROUP BY last_name
ORDER BY COUNT(last_name) DESC;			 
			 
-- Bonus

