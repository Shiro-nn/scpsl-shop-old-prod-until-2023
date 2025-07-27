module.exports = {
    apps : [{
        name   : "cdn",
        script : "./cdn.js",
        out_file: "/dev/null",
        error_file: "/dev/null",
        exec_mode : "cluster"
    }]
}