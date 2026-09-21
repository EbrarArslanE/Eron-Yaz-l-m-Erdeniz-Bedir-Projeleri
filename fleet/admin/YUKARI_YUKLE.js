const { exec } = require("child_process");
const fs = require("fs");
const archiver = require("archiver");
const Client = require("ssh2").Client;
const SFTPClient = require("ssh2-sftp-client");

const serverConfig = {
  host: "ns3.senyildiz.com.tr",
  port: 22,
  username: "eron",
  password: "Er3007*19",
  remotePath: "/var/www/v2.fleetassist.com.tr/yedekParca/"
};

function buildProject() {
  return new Promise((resolve, reject) => {
    console.log("Proje Build Alınıyor...");
    exec(
      "ng build --configuration production --base-href=https://v2.fleetassist.com.tr/yedekParca/",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Build Error: ${stderr}`);
          return reject(error);
        }
        console.log("Build Başarılı!");
        resolve();
      }
    );
  });
}

function zipProject() {
  return new Promise((resolve, reject) => {
    console.log("Dist klasörü sıkıştırılıyor...");
    const output = fs.createWriteStream("dist.zip");
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`ZIP oluşturuldu: ${archive.pointer()} total bytes`);
      resolve();
    });

    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.directory("dist/nazox/", false);
    archive.finalize();
  });
}

function uploadToServer() {
  return new Promise(async (resolve, reject) => {
    const sftp = new SFTPClient();
    try {
      console.log("Servera bağlanıldı...");
      await sftp.connect(serverConfig);
      console.log("ZIP dosyası yükleniyor...");
      await sftp.put("dist.zip", `${serverConfig.remotePath}dist.zip`);
      console.log("Yükleme başarılı!");
      // await sftp.end();
      resolve();
    } catch (error) {
      console.error("Upload Error:", error);
      reject(error);
    }
  });
}

function extractOnServer() {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", () => {
        console.log("ZIP dosyası açılıyor...");
        conn.exec(
          `cd ${serverConfig.remotePath} && unzip -o dist.zip && unlink dist.zip`,
          (err, stream) => {
            if (err) return reject(err);
            stream
              .on("close", () => {
                console.log("ZIP Dosyası açıldı!");
                // conn.end();
                resolve();
              })
              .on("data", (data) => {
                // console.log("STDOUT: " + data)
              })
              .stderr.on("data", (data) => console.log("STDERR: " + data));
          }
        );
      })
      .connect(serverConfig);
  });
}

async function deploy() {
  try {
    await buildProject();
    await zipProject();
    await uploadToServer();
    await extractOnServer();
    console.log("Yukarı Yükleme Başarılı!");
    process.exit(0);
  } catch (error) {
    console.error("Deployment Failed:", error);
  }
}

deploy();
