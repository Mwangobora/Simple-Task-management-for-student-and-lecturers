const Pool = require('pg').Pool;
const pool = new Pool({ 
    user: 'postgres',
    host: 'localhost',
    database:"task_management_system",
    password:'200212',
    port:5432
})
module.exports = pool;