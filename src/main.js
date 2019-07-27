import chalk from 'chalk';
import fs from 'fs';
import unzipper from 'unzipper';
import request from 'request';

export async function skiwaMaterializeBoilerplate(options){



  //Generating files
  if(!fs.existsSync('./'+options.name)){

    //Creating folders
    createFolders(options);

    //Creating main files
    createMainFiles(options);

    //Adding materialize
    retrieveMaterializeFiles(options);

    //Adding jquery

    //Generating the stylesheets
    //Retrieving the colors and creating the functions
    //Creating the sections

    //

  }else{
    console.log(chalk.red.bold(`ERREUR: Un dossier avec le nom ${options.name} existe déjà !`));
  }



}

/**
 * Creates the main folders
 */
async function createFolders(options){
  fs.mkdirSync('./'+options.name);
  fs.mkdirSync('./'+options.name+'/css');
  fs.mkdirSync('./'+options.name+'/files');
  fs.mkdirSync('./'+options.name+'/img');
  fs.mkdirSync('./'+options.name+'/img/social');
  fs.mkdirSync('./'+options.name+'/js');
  fs.mkdirSync('./'+options.name+'/sass');
}

/**
 * Creates the main user files
 */
async function createMainFiles(options){
  fs.writeFileSync('./'+options.name+'/js'+'/main.js');
  fs.writeFileSync('./'+options.name+'/sass'+'/main.scss');
  fs.writeFileSync('./'+options.name+'/index.html');
}

/**
 * Download the materialize archive and retrieve its content
 */
async function retrieveMaterializeFiles(options){

  //Downloads the archive and extracts it
  const directory = await unzipper.Open.url(request,'https://github.com/Dogfalo/materialize/releases/download/1.0.0/materialize-src-v1.0.0.zip')
  .then(d=>{

    //Creates the materialize folders
    fs.mkdirSync('./'+options.name+'/sass/materialize');
    fs.mkdirSync('./'+options.name+'/sass/materialize/components');
    fs.mkdirSync('./'+options.name+'/sass/materialize/components/forms');
    fs.mkdirSync('./'+options.name+'/js/materialize');
    fs.mkdirSync('./'+options.name+'/js/materialize/bin');

    d.files.forEach(f=>{

      //Removes the first path folder
      var path = f.path.split('/');
      path.shift();

      //Only retrieves js and sass files while excluding the uncompressed js
      if((f.path.includes('/js/') || f.path.includes('/sass/')) && f.path !== 'materialize-src/js/bin/materialize.js'){
        //adds the 'materialize' folder in the path
        path.splice(1,0,'materialize');
        //reconstructs the path
        path=path.join('/');

        //Copies the file
        if(!fs.existsSync('./'+options.name+'/'+path)){
          fs.writeFileSync('./'+options.name+'/'+path);
          console.log(chalk.yellow.bold(path));
        }
      }
    });
  });
}
