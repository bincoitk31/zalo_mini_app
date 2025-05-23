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

app.post('/api/run_command', (req, res) => {
  const { env, command, description, app_id, access_token, site_id, zalo_secret_key, zalo_oa_id, zalo_private_key, settings } = req.body;

  if (!command) {
      return res.status(400).json({ error: 'Command is required' });
  }

  process.env.VITE_SITE_ID = site_id
  process.env.VITE_ZALO_SECRET_KEY = zalo_secret_key
  process.env.VITE_ZALO_OA_ID = zalo_oa_id
  process.env.VITE_APP_ID = app_id
  process.env.VITE_ZALO_PRIVATE_KEY = zalo_private_key
  process.env.VITE_ENV = env

  //write settings to app-settings.json

  fs.writeFileSync('app-settings.json', JSON.stringify(settings, null, 2), 'utf8');

  runDeployment(command, description, app_id, access_token).then((output) => {
    console.log("outputtt", output)
    res.json(output)
  }).catch((err) => {
    console.error("\n❌ Deployment Failed:\n", err);
  }).finally(() => {
    exec("rm -rf .env", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Lỗi khi xóa .env: ${error.message}`);
        return;
      }
      delete process.env.APP_ID
      delete process.env.VITE_SITE_ID
      delete process.env.VITE_ZALO_SECRET_KEY
      delete process.env.VITE_ZALO_OA_ID
      delete process.env.VITE_ZALO_PRIVATE_KEY
      delete process.env.VITE_ENV

      fs.writeFileSync('app-settings.json', JSON.stringify({}, null, 2), 'utf8');
      console.log(stdout)
    })
  })

});

async function runDeployment(command, description, app_id, access_token) {
  return new Promise((resolve, reject) => {
      console.log("🚀 Starting deployment...");

      // Chạy lệnh `zmp login`
      const loginProcess = spawn("zmp", ["login"],  {stdio: ["pipe", "pipe", "inherit"]});
      let isAppIdEntered = false;
      let isLoginMethodSelected = false;
      let isAccessTokenEntered = false;

      // Xử lý dữ liệu đầu ra từ quá trình
      loginProcess.stdout.on("data", (data) => {
        const text = data.toString();
        // Lưu trữ output từ terminal
        console.log("textttt",text)
        
        // Nhập mini app id nếu yêu cầu
        if (loginProcess.stdin.writable) {
          if (text.includes("Mini App ID") && !isAppIdEntered) {
            loginProcess.stdin.write(`${app_id}\n`)
            isAppIdEntered = true
          }

          // Chọn Login Method, tự động chọn "Login with App Access Token"
          if (text.includes("Choose a Login Method") && !isLoginMethodSelected) {
            loginProcess.stdin.write("2\n");
            isLoginMethodSelected = true
          }

          // Nhập "access token"
          if (text.includes("Zalo Access Token:") && !isAccessTokenEntered) {
            loginProcess.stdin.write(`${access_token}\n`);
            isAccessTokenEntered = true
          }

        }
      });

      loginProcess.stdin.on("error", (err) => {
        console.error("❌ Lỗi stdin:", err.message);
      });

      loginProcess.on("exit", (code) => {
        if (code === 0) {
          // Kiểm tra nếu command là "dev" hoặc "test" để chọn đúng version
          const versionChoice = command === "test" ? "Testing" : "Development";
          let isVersionChoiseEntered = false
          let isDesEntered = false
          // Chạy lệnh `zmp deploy`
          const deployProcess = spawn("zmp", ["deploy"]);

          // Lưu trữ output từ terminal
          let output = "";

          // Xử lý dữ liệu đầu ra từ quá trình
          deployProcess.stdout.on("data", (data) => {
              const text = data.toString();
              console.log(text, "texx")
              // output += text;
              if (text.includes("Version:")) output += text

              // Nếu xuất hiện menu chọn phiên bản, tự động chọn "Development"
              if (text.includes("What version status are you deploying?") && !isVersionChoiseEntered) {
                if (versionChoice === "Development") {
                    deployProcess.stdin.write("\n"); // Chọn Development (mặc định khi nhấn Enter)
                } else if (versionChoice === "Testing") {
                    deployProcess.stdin.write("2\n"); // Chọn Testing
                }
                isVersionChoiseEntered = true
              }

              // Nếu yêu cầu mô tả, nhập "dev"
              if (text.includes("Description:") && !isDesEntered) {
                  deployProcess.stdin.write(`${description}\n`);
                  isDesEntered = true
              }
          });

          deployProcess.stderr.on("data", (data) => {
              const text = data.toString();
              console.log(text, "texx")
              if (text.includes("Version:")) output += text
          });

          // Khi lệnh kết thúc
          deployProcess.on("close", (code) => {
              const match = output.match(/✔ Version: (\S+)/); // Tìm chuỗi sau "✔ Version: "
              const version = match ? match[1] : null
              resolve(version)
          });

          deployProcess.on("error", (err) => {
              console.error(`❌ Failed to start process: ${err.message}`);
              reject(err);
          });
        }
      })
  })
}

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