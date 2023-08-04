const express = require('express');
const cors = require('cors');
const uuidv4 = require('uuid').v4;
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const util = require('util');

const connection = mysql.createConnection({
    user: "root",
    password: "",
    database: "shop",
    host: "localhost"
});

const query = util.promisify(connection.query).bind(connection);
const app = express();

const sessions = [];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", async (req, res) => {
    const response = {
        successful: true,
        error: null,
        sessionID: null
    };

    const { username, password } = req.body;

    if(!(await checkUserPassword(username, password))){
        response.successful = false;
        response.error = new Error("Incorrect username or password");
    }
    else{
        response.sessionID = uuidv4();
        sessions[username] = response.sessionID;
    }

    res.send(response);
});
app.delete("/login", async (req, res) => {
    const response = {
        successful: true,
        error: null
    };

    const { username, sessionID } = req.body;

    if(!(await checkUserSession(username, sessionID))){
        response.successful = false;
        response.error = new Error("No open session");
    }
    else{
        delete sessions[username];
    }

    res.send(response);
});

app.post("/users", async (req, res) => {
    const response = {
        successful: true,
        error: null
    };

    const { username, password } = req.body;

    try{
        await addUser(username, password)
    }
    catch(error){
        response.successful = false;
        response.error = error;
    }

    res.send(response);
});
app.patch("/users", async (req, res) => {
    const response = {
        successful: true,
        error: null
    };

    const { username, sessionID, column, value } = req.body;

    if(!(await checkUserSession(username, sessionID))){
        response.successful = false;
        response.error = new Error("No open session");
    }
    else{
        try{
            await updateUser(username, column, value);
        }
        catch(error){
            response.successful = false;
            response.error = error;
        }
    }

    res.send(response);
});
app.delete("/users", async (req, res) => {
    const response = {
        successful: true,
        error: null
    };

    const { username, sessionID } = req.body;

    if(!(await checkUserSession(username, sessionID))){
        response.successful = false;
        response.error = new Error("No open session");
    }
    else{
        try{
            await deleteUser(username);
        }
        catch(error){
            response.successful = false;
            response.error = error;
        }
    }

    res.send(response);
});

app.get("/products", async (req, res) => {
    res.send({
        products: await getProduct()
    });
});
app.get("/products/:name", async (req, res) => {
    res.send({
        products: await getProduct(req.params.name)
    });
});

app.listen(8080, () => {
    console.log("Server running");
});

async function checkUserPassword(username, password){
    const result = await query(`SELECT password FROM user WHERE username=?`, username);

    if(result.length == 0){
        return false;
    }

    const hash = result[0].password;

    return await bcrypt.compare(password, hash);
}
async function checkUserSession(username, sessionID){
    return sessions[username] === sessionID;
}

async function addUser(username, password){
    const hash = await bcrypt.hash(password, 10);

    await query(`INSERT INTO user VALUES('${username}', '${hash}')`);
}
async function updateUser(username, column, value){
    if(column === "password"){
        const hash = bcrypt.hash(value, 10);
        await query(`UPDATE user SET ${column} = '${hash}' WHERE username='${username}'`);
    }
    if(column === "username"){
        await query(`UPDATE user SET ${column} = '${value}' WHERE username='${username}'`);

        const sessionID = sessions[username];
        delete sessions[username];
        sessions[value] = sessionID;
    }
}
async function deleteUser(username){
    await query(`DELETE FROM user WHERE username=?`, username);
}
async function getProduct(wildcard){
    const result = await query(`SELECT * FROM product WHERE product_name LIKE '%${wildcard == undefined || wildcard == null ? "" : wildcard}%'`);

    return result;
}