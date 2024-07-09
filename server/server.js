const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;
const cookieParser = require('cookie-parser');
const socketIo = require('socket.io');
require('dotenv').config();

require('../server/config/mongoose.config');
app.use(cookieParser());
app.use(
    cors({
      credentials: true,
      origin: ['http://localhost:3000', 'https://task-pro-snowy.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('./routes/user.routes')(app);
require('./routes/workspace.routes')(app);

require('./routes/issue.routes')(app);

// require('./routes/project.routes')(app);
// require('./routes/task.routes')(app);
require('./routes/project.routes')(app);
require('./routes/issue.routes')(app);

module.exports = app;


// const server = app.listen(port, () =>
//     console.log(`Listening on port: ${port}`)
// );



if (require.main === module) {
    const server = app.listen(port, () =>
        console.log(`Listening on port: ${port}`)
    );

    const io = socketIo(server);

    io.on('connection', (socket) => {
        // Your socket.io event handlers here
    });
}