# Backend code for Final Year Project (Group fyp22041)

These are the code that run as the backend server for the project. To have a better user experience, you can found the code of frontend application at [https://bitbucket.org/derek_szehoyin/reactapp/src/master/](https://bitbucket.org/derek_szehoyin/reactapp/src/master/)

---

## Prerequisite

<b>To install node modules for this project:</b>

1. Type `npm install` in the terminal


<b>To set up and install postgresql:</b>

1. Type `npm run db_setup` in the terminal
2. If the terminal prompt continue or not, continue for all the prompt
3. Input password of the computer user if the termianl prompt for password
4. Type `su - postgres` in the terminal
5. Type `createuser --interactive -P fyp@fyp-20222023` in the terminal
6. Enter `hku20222023#` when it prompt for "Enter password for new role:"
7. Enter `y` when it prompt for "Shall the new role be a superuser? (y/n)"
8. Open a new terminal and type `npm run input_dummy_data` to initialize the databse and input some dummy data to the db

---

## Start the project

<b>After completed all the prerequisite, the server can be started by following steps:</b>

1. Open a terminal and type `npm start`


You can start the front end application to have a full experience, or you can use postman to send request to [http://localhost:8000/](http://localhost:8000/) with specific path to use the API endpoint. The full documentation of the API endpoint could be found at [https://docs.google.com/spreadsheets/d/1Zt9E0wbxXcZfjjJ19BH2KuoYNMiH2tkxFsI0X3TyKvo/edit#gid=0](https://docs.google.com/spreadsheets/d/1Zt9E0wbxXcZfjjJ19BH2KuoYNMiH2tkxFsI0X3TyKvo/edit#gid=0)

---

## Running test case

<b>All backend test case can be run by following steps:</b>

1. Open a terminal and type `npm run test-server`

<b>To run test case for smart contract:</b> 

1. cd to "smart_contract" folder 
2. Type `npx hardhat test` in terminal

<b>To run specific test case, you can run by following steps:</b>

1. cd to the "test" folder located inside "server" folder. 
2. cd to the folder which specific test file you wish to run.
3. Type `mocha test_file_name_wish_to_run.js`