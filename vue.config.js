//@typescript-eslint/no-var-requires
const path = require('path')
// import * as path from "path"
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  "lintOnSave": false,
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    resolve: {
      alias: {
        "@shared": path.resolve(__dirname, "../vtt_shared"),
        "@store": path.resolve(__dirname, "src/store"),
      },
      extensions: ['.js', '.vue', '.json', ".ts"]
    }
  }
}