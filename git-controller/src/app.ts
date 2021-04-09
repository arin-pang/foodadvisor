import express from 'express';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs-extra';
// import globby from 'globby';
import path from 'path';
import bodyParser from 'body-parser';
// import util from 'util';


const app: express.Application = express();
app.use(bodyParser.json());


// commit & push  hook



app.post(
  "/git-commit-push",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try{
      const dir = path.join('/usr/src/food-advisor');
      // const gitdir = path.join(dir, '.git');
      // const apiDir = path.join(dir, 'api');


      // let files = await git.listFiles({ fs, dir, ref: 'HEAD'});
      // console.log(files);



      // Unstage all files
      await git.statusMatrix({
        fs,
        dir,
      }).then((status) =>
        Promise.all(
          status.map(([filepath, , worktreeStatus]) => {
              git.resetIndex({ ...{fs, dir}, filepath }) 
            }
          )
        )
      );


      // const apiFiles = files.filter(n => n.indexOf('api/') === 0);    
      // const paths = await globby([path.join(apiDir, '**'), path.join(apiDir, '**', '.*')], {gitignore: true, cwd: dir });
      // const relativePaths = paths.map(n => path.relative(dir, n));

      // const deletedFiles = apiFiles.filter(n => !relativePaths.includes(n));
      // console.log('deleted files', deletedFiles);


      // Stage all files in api dir
      await git.statusMatrix({
        fs,
        dir,
      }).then((status) =>
        Promise.all(
          status.map(([filepath, , worktreeStatus]) => {
              if(filepath.indexOf('api/') !== 0) return null; 
              console.log(filepath);
              return worktreeStatus ? git.add({ ...{fs, dir}, filepath }) : git.remove({ ...{fs, dir}, filepath })
            }
          )
        )
      );

      // console.log('ahahahahahahaha');

      // for(const filepath of deletedFiles){
      //   // await fs.outputFile( path.join(dir, filepath), null );
      //   // console.log(await git.add({fs, dir, filepath: path.relative(dir, filepath)}));
      //   // console.log(path.join(dir, filepath));
      //   console.log(await git.remove({fs, dir, filepath: path.relative(dir, filepath)}));
      //   // await fs.unlink( path.relative(dir, filepath));
      // }

      // const mixedPaths = paths.concat(deletedFiles);

      // console.log(JSON.stringify(paths, null, 2));

      // for (const filepath of paths){
      //   // console.log(path.relative(dir, filepath));
      //   // console.log(await git.resetIndex({fs, dir, filepath: path.relative(dir, filepath)}));
      //   console.log(path.join(dir, filepath));
      //   (await git.add({fs, dir, filepath: path.relative(dir, filepath)}));
      // }

      
        // (await git.add({fs, dir, filepath: path.relative(dir, apiDir)}));

      // let files2 = await git.listFiles({ fs, dir });

      // console.log(JSON.stringify(files2, null, 2));

      // console.log(dir);

      let sha = await git.commit({
        fs,
        dir,
        author: {
          name: req.body.commit.author,
          email: req.body.commit.email,
        },
        message: req.body.commit.message
      });
      console.log(sha)


      let pushResult = await git.push({
        fs,
        http,
        dir,
        remote: req.body.local.remote,
        ref: req.body.local.ref,
        onAuth: () => ({ username: req.body.auth.username, password: req.body.auth.password }),
      })
      console.log(pushResult);

    } catch (e) {
      console.error(e);
      res.status(400).send("Error occured");
    }
    res.send("hello typescript express!");
  }
);

export default app;