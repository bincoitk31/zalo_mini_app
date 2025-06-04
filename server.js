const express = require('express');
const { spawn, exec } = require('child_process');
const fs = require('fs');
require('dotenv').config();
const { PartnerClient, deployMiniApp } = require("zmp-openapi-nodejs")
const app = express();
const port = 3000;

const client = new PartnerClient(
  "97771a9d-16ac-4de7-a6ec-d5fe7419fe1d",
  "1133",
)

app.use(express.json()); // To parse JSON request bodies

app.post('/api/deploy', async (req, res) => {
  const { createReadStream } = require('fs')
  const { env, description, app_id, site_id, zalo_oa_id, zalo_private_key, settings, name } = req.body

  try {
    // Kiểm tra các tham số bắt buộc
    if (!app_id || !name || !description) {
      return res.status(400).json({ error: 1, message: "miniAppId, name, description is required" });
    }

    // thêm env
    process.env.VITE_SITE_ID = site_id
    process.env.VITE_ZALO_OA_ID = zalo_oa_id
    process.env.VITE_APP_ID = app_id
    process.env.VITE_ZALO_PRIVATE_KEY = zalo_private_key
    process.env.VITE_ENV = env
    process.env.APP_ID = app_id
    //write settings to app-settings.json
    fs.writeFileSync('app-settings.json', JSON.stringify(settings, null, 2), 'utf8');

    //run build
    const isBuildSuccess = await runBuild()
    if (!isBuildSuccess) {
      return res.status(400).json({message: "Build failed" });
    }
    // clean env
    await cleanEnv()

    // Tạo read stream với buffer size phù hợp
    const file = createReadStream("build.zip");

    const { versionId, entrypoint, error, message } = await client.deployMiniApp({
      miniAppId: app_id,
      file,
      name,
      description,
    });

    if (error !== 0) {
      return res.status(400).json({ error, message });
    }

    res.status(200).json({
      versionId,
      entrypoint,
      message: "Deploy successful"
    });
  } catch (err) {
    console.error('Deploy error:', err);
    res.status(500).json({ error: 1, message: err.message });
  }
});

async function runBuild() {
  return new Promise((resolve, reject) => {
    exec('npm run build:zip', (error, stdout, stderr) => {
      if (error) {
        console.error('Error running build:', error);
        reject(error);
        return;
      }
      console.log('Build successful:', stdout);
      resolve(true);
    });
  });
}

async function cleanEnv() {
  return new Promise((resolve, reject) => {
    exec("rm -rf .env", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Lỗi khi xóa .env: ${error.message}`);
        reject(error);
        return;
      }
      delete process.env.APP_ID;
      delete process.env.VITE_SITE_ID;
      delete process.env.VITE_ZALO_SECRET_KEY;
      delete process.env.VITE_ZALO_OA_ID;
      delete process.env.VITE_ZALO_PRIVATE_KEY;
      delete process.env.VITE_ENV;

      fs.writeFileSync('app-settings.json', JSON.stringify({}, null, 2), 'utf8');
      resolve();
    });
  });
}

app.listen(port, '0.0.0.0',() => {
  console.log(`Server running at http://localhost:${port}`);
});