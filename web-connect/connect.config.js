module.exports = {
    apps : [{
        name   : "web connect",
        script : "./connect.js",
        out_file: "/dev/null",
        error_file: "/dev/null",
        exec_mode : "cluster",
        max_memory_restart: "256M"
    }]
}