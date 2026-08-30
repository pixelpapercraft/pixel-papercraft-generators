import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const host = "127.0.0.1";
const port = 3001;
const appRootUrl = `http://${host}:${port}/`;
const appRouteUrl = `http://${host}:${port}/generator/example`;
const startupTimeoutMs = Number(
  process.env.TEST_IMAGES_STARTUP_TIMEOUT_MS ?? 60_000
);
const update = process.argv.includes("--update");
const vitestArgs = process.argv.slice(2).filter((arg) => arg !== "--update");

const nextBin = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);
const vitestBin = path.join(
  projectRoot,
  "node_modules",
  "vitest",
  "vitest.mjs"
);

let nextServer = null;
let vitestRun = null;
let shuttingDown = false;

function spawnNodeModule(scriptPath, args, extraEnv = {}) {
  return spawn(process.execPath, [scriptPath, ...args], {
    cwd: projectRoot,
    env: {
      ...process.env,
      ...extraEnv,
    },
    stdio: "inherit",
  });
}

function terminate(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) {
    return;
  }

  child.kill("SIGTERM");
  setTimeout(() => {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGKILL");
    }
  }, 5_000).unref?.();
}

function cleanup(code = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  terminate(vitestRun);
  terminate(nextServer);
  if (code !== 0) {
    process.exitCode = code;
  }
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    cleanup(1);
  });
}

process.on("exit", () => {
  cleanup(process.exitCode ?? 0);
});

function waitForApp(url, timeoutMs, child) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    let settled = false;

    const finish = (fn) => (value) => {
      if (settled) {
        return;
      }

      settled = true;
      fn(value);
    };

    const resolveOnce = finish(resolve);
    const rejectOnce = finish(reject);

    const poll = async () => {
      if (settled) {
        return;
      }

      if (child.exitCode !== null || child.signalCode !== null) {
        rejectOnce(
          new Error(
            `next dev exited before ${url} became ready (exitCode=${child.exitCode}, signal=${child.signalCode ?? "null"})`
          )
        );
        return;
      }

      try {
        const response = await fetch(url, { cache: "no-store" });
        if (response.ok) {
          resolveOnce();
          return;
        }
      } catch {
        // Keep waiting until the app responds or the timeout expires.
      }

      if (Date.now() >= deadline) {
        rejectOnce(
          new Error(`Timed out after ${timeoutMs}ms waiting for ${url}`)
        );
        return;
      }

      setTimeout(poll, 500).unref?.();
    };

    child.once("error", rejectOnce);
    child.once("exit", (code, signal) => {
      if (!settled) {
        rejectOnce(
          new Error(
            `next dev exited before ${url} became ready (exitCode=${code}, signal=${signal ?? "null"})`
          )
        );
      }
    });

    void poll();
  });
}

async function main() {
  nextServer = spawnNodeModule(nextBin, [
    "dev",
    "--webpack",
    "--hostname",
    host,
    "-p",
    String(port),
  ]);
  await waitForApp(appRootUrl, startupTimeoutMs, nextServer);

  const env = {
    VITE_IMAGE_APP_URL: appRouteUrl,
  };

  vitestRun = spawnNodeModule(
    vitestBin,
    [
      "run",
      "--project",
      "browser",
      ...(update ? ["--update"] : []),
      ...vitestArgs,
    ],
    env
  );

  const vitestExitCode = await new Promise((resolve, reject) => {
    vitestRun.once("error", reject);
    vitestRun.once("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`vitest exited via ${signal}`));
        return;
      }

      resolve(code ?? 1);
    });
  });

  cleanup(vitestExitCode);
  process.exitCode = vitestExitCode;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  cleanup(1);
  process.exitCode = 1;
});
