var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    Object.keys(cluster.workers).forEach(function(id) {
        console.log('Worker running with ID: ' + cluster.workers[id].process.pid);
    });
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died');
    });
} else {
    require('./server.js');
}