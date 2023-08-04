class StatementError extends Error{
    constructor(message){
        super(message);
        this.name = "Statement Error";
    }
}

const mysql = require('mysql');
const bodyParser = require('body-parser');
const util = require('util');
const express = require('express');
const cors = require('cors');

const app = express();
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kochbuch"
});
const query = util.promisify(connection.query).bind(connection);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function getData(selectStatement){
    if(selectStatement.match(/\s*select/gi) == null){
        throw new StatementError('Entered statement is not a SELECT statement!');
    }

    const data = await query(selectStatement);

    return data;
}
async function getRecipes(wc){
    const [recipe, ingredient] = wc.split("{");
    const pre = recipe.startsWith('^') ? "" : "%";
    const past = recipe.endsWith('$') ? "" : "%";
    const wildcard = pre + recipe.replaceAll(/\*/g, '%').replaceAll(/\./g, '_').replaceAll(/[\^\$]/g, '') + past;

    const data = await getData(`
        SELECT *
        FROM rezept
        WHERE bezeichnung LIKE '${wildcard}'
        ${ingredient == null || ingredient == undefined || ingredient.match(/(['"])[^'",]*\1(,(['"])[^'",]*\3)*}/g) == null || ingredient == "" ? "" : `
            AND ${(ingredient.match(/,/g) || []).length + 1} = (
                SELECT COUNT(*)
                FROM rezept_zutat
                WHERE zutat_id_fk IN (
                    SELECT zutat_id
                    FROM zutat
                    WHERE bezeichnung IN (${ingredient.split("}")[0]})
                )
                AND rezept_id_fk = (
                    SELECT rezept_id
                    FROM rezept
                    WHERE bezeichnung LIKE '${wildcard}'
                )
            )
        `}
    `);

    return data;
}
async function getIngredients(recipeId){
    const data = await getData(`
        SELECT z.bezeichnung, rz.menge
        FROM zutat z JOIN rezept_zutat rz
        ON z.zutat_id = rz.zutat_id_fk
        WHERE rz.rezept_id_fk = ${recipeId}
    `);

    return data;
}

app.post('/recipes', async (req, res) => {
    res.send(JSON.stringify(await getRecipes(req.body.wildcard)));
});
app.post('/ingredients', async (req, res) => {
    res.send(JSON.stringify(await getIngredients(req.body.recipeId)));
});

app.listen(8080, () => {
    console.log('Server live');
});