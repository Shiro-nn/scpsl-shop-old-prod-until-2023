module.exports = {
    apps : [{
        name   : "scp socket",
        script : "./socket.js",
        exec_mode : "cluster",
        max_memory_restart: "512M"
    }]
}