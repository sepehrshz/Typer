const { Surreal } = require("surrealdb.js");
const fastify = require('fastify')();
const db = new Surreal();

const main = async () => {
  try {
    await db.connect("http://127.0.0.1:8000", {
      namespace: "test",
      database: "test",
      auth: {
        namespace: "test",
        database: "test",
        username: "root",
        password: "root",
      },
    });

    await fastify.post('/signup', async (request, reply) => {
      try {
        const userData = request.body; // Assuming you're sending user data in the request body
        // Store userData in SurrealDB
        // Example: await fastify.surrealdb.put('users', userData.id, userData);
        console.log(userData)
        reply.send({ success: true, message: 'User signed up successfully!' });
      } catch (err) {
        console.error(err);
        reply.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    });

    // Create a new person with a random id
    //   await db.create("person", {
    //     name: {
    //       first: "Sepehr",
    //       last: "Shirazi",
    //     },
    //     email: "sepehrshirazi27@gmail.com"
    //   });
  } catch (e) {
    console.error("ERROR", e);
  }
};

main();
