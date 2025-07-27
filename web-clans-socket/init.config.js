module.exports = {
    apps : [{
        name   : "clans socket",
        script : "./init.js",
        out_file: "/dev/null",
        error_file: "/dev/null",
        exec_mode : "cluster",
        max_memory_restart: "512M"
    }]
}