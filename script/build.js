/*
 * build.js
 * Created by 还有醋v on 2021/10/19.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */

const rollup = require("rollup");
const option = require("../rollup.prod");

const watcher = rollup.watch(option);

watcher.on('event', (event) => {
    if (event.code === "END") {
        process.exit(0);
    }
});

