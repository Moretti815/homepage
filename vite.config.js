import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // 项目根目录
  root: ".",

  // 构建配置
  build: {
    // 输出目录
    outDir: "dist",

    // 清空输出目录
    emptyOutDir: true,

    // 资源内联限制（小于 4KB 的资源会内联）
    assetsInlineLimit: 4096,

    // 启用 CSS 代码分割
    cssCodeSplit: true,

    // 压缩选项
    minify: "terser",

    // 源映射（生产环境关闭）
    sourcemap: false,

    // Rollup 选项
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      // 外部依赖（不打包这些库）
      external: [],
      output: {
        // 入口文件
        entryFileNames: "assets/[name]-[hash].js",
        // 代码分割块
        chunkFileNames: "assets/[name]-[hash].js",
        // 资源文件
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/\.(css)$/i.test(assetInfo.name)) {
            return "assets/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },

  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  // 预览服务器配置
  preview: {
    port: 4173,
  },

  // 环境变量前缀（只有以 VITE_ 开头的变量才会暴露给客户端）
  envPrefix: "VITE_",

  // 路径别名
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },

  // CSS 配置
  css: {
    devSourcemap: true,
  },

  // 优化依赖
  optimizeDeps: {
    exclude: ["highlight.min.js", "chart.js", "marked.min.js"],
  },
});
