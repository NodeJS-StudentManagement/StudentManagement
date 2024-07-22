# StudentManagement

The Student Management project is a robust Node.js application designed to simplify and streamline the management of student and department records. The application provides a comprehensive set of RESTful API endpoints that facilitate various operations related to user authentication, student management, department handling, and data reporting.  The application includes an endpoint to send a JSON-formatted email containing a list of all students.

## Tech Stack
- **Node.js**: A JavaScript runtime used for building scalable network applications, providing the foundation for the server-side logic of the application.
- **Express.js**: A web framework for Node.js that simplifies routing and handling HTTP requests, facilitating the creation of robust APIs.
- **PostgreSQL**: A powerful, open-source relational database used for storing and managing student records with a focus on data integrity and performance.

## NPM Packages
- **JWT (JSON Web Tokens)**: Used for secure authentication.
- **Nodemailer**: A module for sending emails from the application, useful for notifications and communication.
- **Dotenv**: A module for loading environment variables from a `.env` file, simplifying configuration management.
- **node-schedule**: A package for scheduling tasks and jobs, useful for recurring actions like sending automated emails.
- **pg**: A PostgreSQL client for Node.js, allowing the application to communicate with the PostgreSQL database.
- **bcrypt**: A library for hashing passwords, enhancing security by encrypting user passwords before storing them.


## Getting Started
To run the project locally, follow these steps:
1. Clone the repository:
    ```bash
    git clone https://github.com/NodeJS-StudentManagement/StudentManagement.git
    ```
2. Navigate to the project directory:
    ```bash
    cd ./StudentManagement/src
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the src directory and add the necessary environment variables:

    ```bash
    DB_HOST=
	DB_USER=
	DB_PASSWORD=
	DB_NAME=
	DB_PORT=
	PORT=
	EMAIL_FROM=
	EMAIL_TO=
	EMAIL_FROM_PASSWORD=
	EMAIL_PERIOD="0 9 * * 3"
	JWT_SECRET=
    ```
5. Make sure you have created a corresponding database in your PostgreSQL server based on the `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` and `DB_PORT` specified in your `.env` file.

6. Start the server:
    ```bash
    npm start
    ```

### Requirements
- Node.js (>=14.0.0)
- npm

<hr/>

### Auth Endpoints

| Endpoint               | Method  | Parameters| Description |
| -----------            | :---:   | :--------:|-------------|
| /api/v1/auth/register  | POST    | username (string), password (string) | Registers a new user with a unique username |
| /api/v1/auth/login     | POST    | username (string), password (string) |Authenticates a user by verifying the provided credentials, and if valid, returns an authentication token. |


### Student Endpoints

| Endpoint              | Method  | Parameters   | Description |
| -------------         | :---:   | -------------|-------------|
| /api/v1/students      | GET     | -	   |     Get all students        |				
| /api/v1/students      | POST    |name (string), email (string), deptid (number)| Add a new student     |
| /api/v1/students/:id  | GET     | id (params) |Get a student by id|				
| /api/v1/students/:id  | PUT     | id (params), name (string), email (string), deptid (number)| Update a student by id |
| /api/v1/students/:id  | DELETE  |		id (params)	   |     Delete a student by ID       |				



### Department Endpoints

| Endpoint              | Method  | Parameters   | Description |
| -------------         | :---:  | -------------|-------------|
| /api/v1/departments      | GET     |		 -	   |     Get all departments       |				
| /api/v1/departments      | POST    |     name (string) |        Add a new department    |
| /api/v1/departments/:id  | GET     | 		 id (params)	   |     Get a department by id       |				
| /api/v1/departments/:id  | PUT     |id (params), name (string) | Update a department by id |
| /api/v1/departments/:id  | DELETE  |		id (params)	   |     Delete a department by ID       |				

### User Endpoint

| Endpoint     | Method  | Parameters  | Description |
| -----------  | :---:   | :----------:|-------------|
| /api/v1/user | GET     |		 -     |Get all users|

### Email Endpoint

| Endpoint      | Method  | Parameters  | Description |
| -----------   | :---:   | :----------:|-------------|
| /api/v1/email | GET     |  		 -  |Sends the list of all students as an email in JSON format.|

### Student Counter Endpoint

| Endpoint      | Method  | Parameters  | Description |
| -----------   | :---:   | :----------:|-------------|
| /api/v1/counter | GET     |  		 -  | Retrieves the total count of students|


## Contributing
If you'd like to contribute, please follow these steps:

- Fork this repository.
- Create a new branch: git checkout -b feature/feature-name.
- Make your changes and commit them: git commit -m 'Add new feature'.
- Push to the branch: git push origin feature/feature-name.
- Open a pull request.

