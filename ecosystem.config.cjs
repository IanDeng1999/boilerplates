const { z } = require("zod");

/* 部署脚本
DEPLOY_ENV=prod \
DEPLOY_HOST=x.x.x.x \
DEPLOY_PORT=5000 \
pm2 deploy ecosystem.config.cjs app
*/

const APP_NAME = "unnamed";
const PORT = 25050;

const env = loadConfig();
const { DEPLOY_ENV, DEPLOY_HOST, DEPLOY_PORT } = env;
console.info("Deploy Info: ", env);

const DEPLOY_NAME = `${APP_NAME}-${DEPLOY_ENV}-${DEPLOY_PORT}`;

module.exports = {
  apps: [
    {
      name: DEPLOY_NAME,
      script: "dist/app.js",
      interpreter: "node",
      node_args: "",
      autorestart: true,
      instances: 2,
      exec_mode: "cluster",
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: DEPLOY_PORT,
      },
    },
  ],

  deploy: {
    app: {
      user: "deploy",
      host: DEPLOY_HOST,
      ref: "origin/develop",
      repo: `git@github.com:xxx/xxx.git`,
      keep_releases: 5,
      path: `/home/deploy/projects/${DEPLOY_NAME}`,
      "post-deploy": [
        "volta -v",
        "node -v",
        "npm i pnpm -g",
        "pnpm -v",
        "pnpm install --frozen-lockfile",
        "pnpm build",
        `DEPLOY_PORT=${DEPLOY_PORT} DEPLOY_ENV=${DEPLOY_ENV} pm2 reload ecosystem.config.cjs --only ${DEPLOY_NAME}`,
      ].join(" && "),
      env: {
        NODE_ENV: "production",
      },
    },
  },
};

function loadConfig() {
  const env = z
    .object({
      DEPLOY_ENV: z.enum(["pre", "prod"]),
      DEPLOY_PORT: z.enum([`${PORT}`, `${PORT + 1}`]),
      DEPLOY_HOST: z.ipv4().optional(),
    })
    .parse(process.env);

  return {
    ...env,
  };
}
