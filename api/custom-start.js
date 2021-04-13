'use strict';

const path = require('path');
const cluster = require('cluster');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const execa = require('execa');

const { logger, webhook } = require('strapi-utils');

const strapi = require('strapi');


const git = require = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
// import globby from 'globby';
const path = require('path');


let webhookTimeout = null;


/**
 * `$ strapi develop`
 *
 */
const run = async function ({ build, watchAdmin, polling, browser }) {
  const dir = process.cwd();

  const serveAdminPanel = true;

  const buildExists = fs.existsSync(path.join(dir, 'build'));
  // Don't run the build process if the admin is in watch mode
  if (build && !watchAdmin && serveAdminPanel && !buildExists) {
    try {
      execa.shellSync('npm run -s build -- --no-optimization', {
        stdio: 'inherit',
      });
    } catch (err) {
      process.exit(1);
    }
  }

  try {
    if (cluster.isMaster) {
      if (watchAdmin) {
        try {
          execa('npm', ['run', '-s', 'strapi', 'watch-admin', '--', '--browser', browser], {
            stdio: 'inherit',
          });
        } catch (err) {
          process.exit(1);
        }
      }

      cluster.on('message', (worker, message) => {
        switch (message) {
          case 'reload':
            // logger.info('The server is restarting\n');
            // worker.send('isKilled');
            break;
          case 'kill':
            worker.kill();
            cluster.fork();
            break;
          case 'stop':
            worker.kill();
            process.exit(1);
          default:
            return;
        }
      });

      cluster.fork();
    }

    if (cluster.isWorker) {
      const strapiInstance = strapi({
        dir,
        autoReload: true,
        serveAdminPanel: watchAdmin ? false : true,
      });

      const adminWatchIgnoreFiles = strapiInstance.config.get('server.admin.watchIgnoreFiles', []);

      watchFileChanges({
        dir,
        strapiInstance,
        watchIgnoreFiles: adminWatchIgnoreFiles,
        polling,
      });

      process.on('message', (message) => {
        switch (message) {
          case 'isKilled':
            strapiInstance.server.destroy(() => {
              process.send('kill');
            });
            break;
          default:
          // Do nothing.
        }
      });

      return strapiInstance.start();
    }
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};

run({
  build: false,
  watchAdmin: false,
  polling: false,
});

/**
 * Init file watching to auto restart strapi app
 * @param {Object} options - Options object
 * @param {string} options.dir - This is the path where the app is located, the watcher will watch the files under this folder
 * @param {Strapi} options.strapi - Strapi instance
 * @param {array} options.watchIgnoreFiles - Array of custom file paths that should not be watched
 */
function watchFileChanges({ dir, strapiInstance, watchIgnoreFiles, polling }) {
  const restart = () => {
    if (strapiInstance.reload.isWatching && !strapiInstance.reload.isReloading) {
      strapiInstance.reload.isReloading = true;
      strapiInstance.reload();
    }
  };

  const customWebhook = () => {

    const customFetch = () => {
      
    }

    if (webhookTimeout){
      clearTimeout(webhookTimeout);
      webhookTimeout = null;
    }

    webhookTimeout = setTimeout(async () => {
      await gitRun({
        commit: {
          author: process.env.CUSTOM_WEBHOOK_GIT_AUTHOR,
          email: process.env.CUSTOM_WEBHOOK_GIT_EMAIL,
          message: process.env.CUSTOM_WEBHOOK_GIT_MESSAGE,
        },
        local: {
          remote: process.env.CUSTOM_WEBHOOK_REPO_REMOTE,
          ref: process.env.CUSTOM_WEBHOOK_REPO_REF,
        },
        auth: {
          username: process.env.CUSTOM_WEBHOOK_AUTH_USERNAME,
          password: process.env.CUSTOM_WEBHOOK_AUTH_PASSWORD,
        },
      });
    }, 1000);

    return;
  };

  const watcher = chokidar.watch(dir, {
    ignoreInitial: true,
    usePolling: polling,
    ignored: [
      /(^|[/\\])\../, // dot files
      /tmp/,
      '**/admin',
      '**/admin/**',
      'extensions/**/admin',
      'extensions/**/admin/**',
      '**/documentation',
      '**/documentation/**',
      '**/node_modules',
      '**/node_modules/**',
      '**/plugins.json',
      '**/index.html',
      '**/public',
      '**/public/**',
      '**/*.db*',
      '**/exports/**',
      ...watchIgnoreFiles,
    ],
  });

  watcher
    .on('add', (path) => {
      strapiInstance.log.info(`File created: ${path}`);
      if (process.env.CUSTOM_WEBHOOK_URL) {
          customWebhook();
      }
      // restart();
    })
    .on('change', (path) => {
      strapiInstance.log.info(`File changed: ${path}`);
      if (process.env.CUSTOM_WEBHOOK_URL) {
          customWebhook();
      }
      // restart();
    })
    .on('unlink', (path) => {
      strapiInstance.log.info(`File deleted: ${path}`);
      if (process.env.CUSTOM_WEBHOOK_URL) {
          customWebhook();
      }
      // restart();
    });
}



const gitRun = async (body) => {
  
    console.log(body);
  try{
    const dir = path.join('/usr/src/git-food-advisor');


    // Get the current branch name
    let branch = await git.currentBranch({
      fs,
      dir,
      fullname: true
    })
    console.log(branch);

    // Unstage all files
    console.log(await git.statusMatrix({
      fs,
      dir,
    }).then((status) =>
      Promise.all(
        status.map(([filepath, , worktreeStatus]) => {
            console.log(filepath);
            console.log(git.resetIndex({ fs, dir, filepath }));
            if(filepath.indexOf('api/') !== 0) return null; 
            return worktreeStatus ? git.add({ fs, dir, filepath }) : git.remove({ fs, dir, filepath });
          }
        )
      )
    ));

    console.log(dir);

    let sha = await git.commit({
      fs,
      dir,
      author: {
        name: body.commit.author,
        email: body.commit.email,
      },
      message: body.commit.message
    });
    console.log(sha)


    let pushResult = await git.push({
      fs,
      http,
      dir,
      remote: body.local.remote,
      ref: body.local.ref,
      onAuth: () => ({ username: body.auth.username, password: body.auth.password }),
    })
    console.log(pushResult);

  } catch (e) {
    console.error(e);
    return;
  }
} 


// async () => {
//   try{
//     strapiInstance.log.info(`Custom webhook ready: ${process.env.CUSTOM_WEBHOOK_URL}`);
//     await fetch(process.env.CUSTOM_WEBHOOK_URL, {
//       method: 'POST',
//       body: JSON.stringify({
//         commit: {
//           author: process.env.CUSTOM_WEBHOOK_GIT_AUTHOR,
//           email: process.env.CUSTOM_WEBHOOK_GIT_EMAIL,
//           message: process.env.CUSTOM_WEBHOOK_GIT_MESSAGE,
//         },
//         local: {
//           remote: process.env.CUSTOM_WEBHOOK_REPO_REMOTE,
//           ref: process.env.CUSTOM_WEBHOOK_REPO_REF,
//         },
//         auth: {
//           username: process.env.CUSTOM_WEBHOOK_AUTH_USERNAME,
//           password: process.env.CUSTOM_WEBHOOK_AUTH_PASSWORD,
//         },
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     strapiInstance.log.info(`Custom webhook complete: ${process.env.CUSTOM_WEBHOOK_URL}`);
//   } catch (e) {
//     console.error(e);
//   }
// }