const path = require('path'),
  yosay = require('yosay'),
  to = require('to-case'),
  Generator = require('yeoman-generator'),
  mkdirp = require('mkdirp');

const genModelNames = model => ({
  slugName: to.slug(model),
  pascalName: to.pascal(model),
  camelName: to.camel(model)
});

const serverGenerator = class extends Generator {
  prompting() {
    this.log(
      yosay(
        '"Allo "allo! Out of the box I include Express and Mongoose, as well as a few other goodies, to build your rest api Server.'
      )
    );

    return this.prompt([
      {
        name: 'serverName',
        type: 'input',
        message: 'Server name:',
        filter: answer => to.slug(answer),
        default: path.basename(this.destinationPath())
      },
      {
        name: 'serverDescription',
        type: 'input',
        message: 'Server description:'
      },
      {
        name: 'serverVersion',
        type: 'input',
        message: 'Server version:',
        default: '0.1.0'
      },
      {
        name: 'authorName',
        type: 'input',
        message: 'Author name:',
        store: true
      },
      {
        name: 'authorEmail',
        type: 'input',
        message: 'Author email:',
        store: true
      },
      {
        name: 'databaseName',
        type: 'input',
        message: 'what should the database be named?',
        default: answers => to.slug(answers.serverName)
      },
      {
        name: 'databaseEngine',
        type: 'list',
        message: 'Which database engine would you prefer?',
        choices: [
          {
            name: 'MongoDB',
            value: 'mongoose'
          },
          {
            name: 'PostgreSQL',
            value: 'sequelize'
          }
        ]
      },
      {
        name: 'useAuthentication',
        type: 'confirm',
        message: 'Would you like to have an User model with authentication included in the app? (only for PostgreSQL)',
        default: true
      },
      {
        name: 'models',
        type: 'input',
        message: 'Models: (singular and comma separated)',
        filter: answer => answer.split(','),
        default: 'pet, owner'
      },
      {
        name: 'useDocker',
        type: 'confirm',
        message: 'Would you like to have Docker included in the app?',
        default: true
      }
    ]).then(answers => {
      this.serverName = answers.serverName;
      this.serverDescription = answers.serverDescription;
      this.serverVersion = answers.serverVersion;
      this.authorName = answers.authorName;
      this.authorEmail = answers.authorEmail;
      this.databaseName = answers.databaseName;
      this.databaseEngine = answers.databaseEngine;
      this.models = answers.models.map(genModelNames);
      this.useAuthentication = answers.useAuthentication;
      this.useDocker = answers.useDocker;
    });
  }

  writing() {
    // Config
    this.fs.copyTpl(this.templatePath('config/index.js'), this.destinationPath('config/index.js'), {
      serverName: this.serverName,
      databaseName: this.databaseName,
      databaseEngine: this.databaseEngine,
      useAuthentication: this.useAuthentication
    });
    this.fs.copy(this.templatePath('config/development.js'), this.destinationPath('config/development.js'));
    this.fs.copy(this.templatePath('config/init.js'), this.destinationPath('config/init.js'));
    // this.fs.copy(this.templatePath('config/logger.js'), this.destinationPath('config/logger.js'));
    this.fs.copy(this.templatePath('config/production.js'), this.destinationPath('config/production.js'));
    this.fs.copy(this.templatePath('config/staging.js'), this.destinationPath('config/staging.js'));
    this.fs.copyTpl(this.templatePath('config/testing.js'), this.destinationPath('config/testing.js'), {
      databaseEngine: this.databaseEngine
    });
    if (this.databaseEngine === 'sequelize')
      this.fs.copy(this.templatePath('config/db.js'), this.destinationPath('config/db.js'));

    // Mailer, Errors & Logger
    this.fs.copy(this.templatePath('services/mailer.js'), this.destinationPath('services/mailer.js'));
    this.fs.copy(this.templatePath('services/errors.js'), this.destinationPath('services/errors.js'));
    this.fs.copy(this.templatePath('templates/email.html'), this.destinationPath('templates/email.html'));
    this.fs.copy(this.templatePath('services/logger.js'), this.destinationPath('services/logger.js'));

    // Index
    this.fs.copyTpl(this.templatePath('index.js'), this.destinationPath('index.js'), {
      databaseEngine: this.databaseEngine,
      useAuthentication: this.useAuthentication
    });

    // Routes
    this.fs.copyTpl(this.templatePath('routes.js'), this.destinationPath('routes.js'), {
      serverName: this.serverName,
      models: this.models
    });

    // Gitignore
    this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));

    // .env
    this.fs.copyTpl(this.templatePath('config/.env'), this.destinationPath('.env'), {
      databaseName: this.databaseName
    });

    // Eslintrc
    this.fs.copy(this.templatePath('eslintrc.json'), this.destinationPath('.eslintrc.json'));

    // Eslintignore
    this.fs.copy(this.templatePath('eslintignore'), this.destinationPath('.eslintignore'));

    // Package
    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), {
      serverName: this.serverName,
      serverDescription: this.serverDescription,
      serverVersion: this.serverVersion,
      authorName: this.authorName,
      authorEmail: this.authorEmail,
      databaseEngine: this.databaseEngine,
      useAuthentication: this.useAuthentication
    });

    // Controller
    this.fs.copy(
      this.templatePath(`lib/${this.databaseEngine}/controller.js`),
      this.destinationPath('lib/controller.js')
    );

    // Facade
    this.fs.copy(
      this.templatePath(`lib/${this.databaseEngine}/facade.js`),
      this.destinationPath('lib/facade.js')
    );

    // Parsers and utils for sequelize generator
    if (this.databaseEngine === 'sequelize') {
      this.fs.copy(
        this.templatePath(`lib/${this.databaseEngine}/parsers.js`),
        this.destinationPath('lib/parsers.js')
      );
      this.fs.copy(this.templatePath('migrations'), this.destinationPath('migrations'));
      mkdirp.sync(this.destinationPath('migrations/migrations'));
      this.fs.copy(
        this.templatePath(`model/${this.databaseEngine}/index.js`),
        this.destinationPath('model/index.js')
      );
      this.fs.copy(
        this.templatePath(`model/${this.databaseEngine}/errors.js`),
        this.destinationPath('model/errors.js')
      );
      this.fs.copy(this.templatePath('sequelizerc'), this.destinationPath('.sequelizerc'));
    }

    // Model
    if(this.useAuthentication) this.models.push('user');
    this.models.forEach(model => {
      this.fs.copyTpl(
        this.templatePath('model/controller.js'),
        this.destinationPath(`model/${model.slugName}/controller.js`),
        {
          model
        }
      );

      this.fs.copyTpl(
        this.templatePath(`model/${this.databaseEngine}/facade.js`),
        this.destinationPath(`model/${model.slugName}/facade.js`),
        {
          model
        }
      );

      this.fs.copyTpl(
        this.templatePath('model/router.js'),
        this.destinationPath(`model/${model.slugName}/router.js`),
        {
          model
        }
      );

      if (this.databaseEngine === 'sequelize') { 
        if(model !== 'user') {
          this.fs.copyTpl(
            this.templatePath(`model/${this.databaseEngine}/schema.js`),
            this.destinationPath(`model/${model.slugName}/schemas/${model.slugName}.js`),
            {
              model
            }
          );
        } else {
          this.fs.copy(
            this.templatePath(`model/${this.databaseEngine}/userSchema.js`),
            this.destinationPath(`model/${model.slugName}/schemas/${model.slugName}.js`));
        }
      } else {
        this.fs.copyTpl(
          this.templatePath(`model/${this.databaseEngine}/schema.js`),
          this.destinationPath(`model/${model.slugName}/schema.js`),
          {
            model
          }
        );
      }
    });

    // Dockerfile
    if (this.useDocker) {
      this.fs.copy(this.templatePath('Dockerfile'), this.destinationPath('Dockerfile'));
    }

    // Docker-compose
    if (this.useDocker) {
      this.fs.copyTpl(this.templatePath('docker-compose.yml'), this.destinationPath('docker-compose.yml'), {
        databaseName: this.databaseName
      });
    }

    // Authentication Module
    if (this.useAuthentication) {
      this.fs.copy(this.templatePath('auth/index.js'), this.destinationPath('auth/index.js'));
      this.fs.copy(this.templatePath('auth/passport.js'), this.destinationPath('auth/passport.js'));
    }

    // Readme
    this.fs.copyTpl(this.templatePath('README.template.md'), this.destinationPath('README.md'), {
      useDocker: this.useDocker,
      serverName: this.serverName,
      serverDescription: this.serverDescription
    });
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: true
    });
  }
};

module.exports = serverGenerator;
