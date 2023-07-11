exports.up = knex => knex.schema.createTable("items", table => {
    table.increments("id");
    table.text("title");
    table.text("description");
    table.text("image").nullable();
    table.decimal("price", 8, 3);
    table.integer("user_id").references("id").inTable("users"); //forein key
 
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
})
 
exports.down = knex => knex.schema.dropTable("items")