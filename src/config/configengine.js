import express from "express";
import path from "path";
const config = (app) => {
    app.use(express.static("public"));
    app.use("view engine", "ejs");
    app.set("views", path.join('/src', 'views'));
}

export default config;