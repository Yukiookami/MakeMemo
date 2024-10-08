/*
 * @Author: zxy
 * @Date: 2024-09-20 16:52:44
 * @LastEditTime: 2024-09-24 23:33:19
 * @FilePath: /sku-memo/vite.config.js
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicPath: "./",
  base: "./", // 确保资源路径相对于当前目录
  build: {
    outDir: "dist", // 打包输出目录
    assetsDir: "assets", // 静态资源目录
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 京东主题
        // 默认京东 APP 10.0主题 > @import "@nutui/nutui/dist/styles/variables.scss";
        // 京东科技主题 > @import "@nutui/nutui/dist/styles/variables-jdt.scss";
        // 京东B商城主题 > @import "@nutui/nutui/dist/styles/variables-jdb.scss";
        // 京东企业业务主题 > @import "@nutui/nutui/dist/styles/variables-jddkh.scss";
        // 全局变量
        additionalData: `@import "@nutui/nutui/dist/styles/variables-jdt.scss";
        @import "./src/assets/styles/variable.scss";`,
      },
    },
  },
});
