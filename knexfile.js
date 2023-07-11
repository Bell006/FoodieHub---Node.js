
const path = require("path");

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "DataBase", "database.db")
    },
    //Habilitando deleção em cascata
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
    useNullAsDefault: true, //permitindo a criação de colunas com o valor null
    migrations: {
      directory: path.resolve(__dirname, "src", "DataBase", "knex", "migrations")
    }
  }
};
