module.exports = {
    apps : [{
        name   : "web",
        script : "./fydne.js",
        out_file: "/dev/null",
        error_file: "/dev/null",
        exec_mode : "cluster",
        max_memory_restart: "1G"
    }]
}