exports.up = knex => knex.schema.createTable("users", table => {
   table.increments("id");
   table.text("email");
   table.text("name");
   table.text("password");
   table.boolean("isAdmin").defaultTo(false);

   table.timestamp("created_at").default(knex.fn.now());
   table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("users");