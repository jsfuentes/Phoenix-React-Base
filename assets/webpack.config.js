const path = require("path");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const postcssNormalize = require("postcss-normalize");
const conf = require("./conf");

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

const paths = {
  appBuild: path.resolve(__dirname, "../priv/static"),
};

module.exports = (env, options) => ({
  optimization: {
    minimizer: [
      new TerserPlugin({ parallel: true }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  entry: {
    "./src/app.js": glob.sync("./vendor/**/*.js").concat(["./src/app.js"]),
  },
  output: {
    filename: "[name]",
    chunkFilename: "src/[name].[contenthash:8].chunk.js",
    path: paths.appBuild,
    // webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    // We inferred the "public path" (such as / or /my-project) from homepage.
    // ---------
    // webpack needs to know it to put the right <script> hrefs into HTML even in
    // single-page apps that may serve index.html for nested URLs like /todos/42.
    // We can't use a relative path in HTML because we don't want to load something
    // like /todos/42/static/js/bundle.7289d.js. We have to know the root.
    publicPath: conf.get("CLIENT_URL") + "/",
  },
  module: {
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: imageInlineSizeLimit,
              name: "./media/[name].[hash:8].[ext]",
            },
          },
          {
            test: /\.(js|mjs|jsx)$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    ident: "postcss",
                    plugins: [
                      require("postcss-flexbugs-fixes"),
                      require("tailwindcss"),
                      require("postcss-preset-env")({
                        autoprefixer: {
                          flexbox: "no-2009",
                        },
                        stage: 3,
                      }),
                      // Adds PostCSS Normalize as the reset css with default options,
                      // so that it honors browserslist config in package.json
                      // which in turn let's users customize the target behavior as per their needs.
                      postcssNormalize(),
                    ],
                  },
                },
              },
            ],
          },
          {
            loader: require.resolve("file-loader"),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: "./media/[name].[hash:8].[ext]",
            },
          },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "css/app.css" }),
    new CopyWebpackPlugin({ patterns: [{ from: "public/", to: "./" }] }),
  ],
  resolve: {
    modules: [path.resolve("./node_modules")],
    alias: {
      src: path.resolve("./src"),
      conf: path.resolve("./conf"),
      img: path.resolve("./img"),
      css: path.resolve("./css"),
    },
  },
});
