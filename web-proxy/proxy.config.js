module.exports = {
    apps : [{
        name   : "web proxy",
        script : "./proxy.js",
        out_file: "/dev/null",
        error_file: "/dev/null",
        exec_mode : "cluster",
        instances : 6,
        max_memory_restart: "512M"
    }]
}