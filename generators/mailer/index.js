const Generator = require('yeoman-generator'),
  to = require('to-case'),
  Parser = require('esprima');

const mailerGenerator = class extends Generator {
  writing() {
    // if (this.fs.exists(this.destinationPath('services/mailer.js'))) {
    //   this.log(`Mailer already exists in the project`);
    //   return;
    // }
    // this.fs.copy(
    //   this.templatePath('./../../app/templates/services/mailer.js'),
    //   this.destinationPath('services/mailer.js')
    // );
    // this.fs.copy(
    //   this.templatePath('./../../app/templates/templates/email.html'),
    //   this.destinationPath('templates/email.html')
    // );
    // this.log(`Mailer service needs to add 2 dependencies to your project`);
    // this.fs.extendJSON(this.destinationPath('package.json'), {
    //   dependencies: {
    //     nodemailer: '^4.4.2',
    //     nunjucks: '^3.1.2'
    //   }
    // });
    const isConstDeclaration = element => {
      return element.type === 'VariableDeclaration' && element.kind === 'const';
    };

    const parsedConfigFile = Parser.parse(this.fs.read(this.destinationPath('config/index.js')));
    const configObject = parsedConfigFile.body
      .filter(isConstDeclaration)
      .map(e => e.declarations)
      .map(e => e[0])
      .filter(e => e.id.name === 'config');
    this.log(configObject[0].init);
  }
  // install() {
  //   this.npmInstall();
  // }
};

module.exports = mailerGenerator;
