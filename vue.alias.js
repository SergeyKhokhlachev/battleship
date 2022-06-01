const path = require("path");

const alias = {
  // resource
  "@img": path.join(__dirname, "./src/assets/image"),
  "@font": path.join(__dirname, "./src/assets/fonts"),
  "@style": path.join(__dirname, "./src/assets/style"),
  "@public": path.join(__dirname, "./public"),

  // system
  "@entity": path.join(__dirname, "./src/core/entity"),
  "@enum": path.join(__dirname, "./src/core/enum"),
  "@filter": path.join(__dirname, "./src/core/filter"),
  "@layout": path.join(__dirname, "./src/core/layout"),
  "@plugin": path.join(__dirname, "./src/core/plugin"),
  "@router": path.join(__dirname, "./src/core/router"),
  "@service": path.join(__dirname, "./src/core/service"),
  "@store": path.join(__dirname, "./src/core/store"),

  // base
  "@views": path.join(__dirname, "./src/views"),
  "@components": path.join(__dirname, "./src/components"),
  "@": path.join(__dirname, "./src"),
};

module.exports = alias;
