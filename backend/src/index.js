import Server from './server.js';

const server = new Server();

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
})
