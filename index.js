const convertFactory = require("electron-html-to");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const api = require("./api");
const genHTML = require("./genHTML");



const questions = [
    {
      type: "input",
      name: "github",
      message: "Please enter your GitHub username"
    },
  
    {
      type: "list",
      name: "color",
      message: "What colorscheme would you like to use?",
      choices: ["red", "blue", "green", "pink"]
    }
  ];
  
  function writeToFile(fileName, data) {
    return fs.writeFileSync(path.join(process.cwd(), fileName), data);
  }
  
  function init() {
    inquirer.prompt(questions).then(({ github, color }) => {
      console.log("We're working on it...");
  
      api
        .getUser(github)
        .then(response =>
          api.getTotalStars(github).then(stars => {
            return genHTML({
              stars,
              color,
              ...response.data
            });
          })
        )
        .then(html => {
          const conversion = convertFactory({
            converterPath: convertFactory.converters.PDF
          });
  
          conversion({ html }, function(err, result) {
            if (err) {
              return console.error(err);
            }
  
            result.stream.pipe(
              fs.createWriteStream(path.join(__dirname, "resume.pdf"))
            );
            conversion.kill();
          });
  
          open(path.join(process.cwd(), "resume.pdf"));
        });
    });
  }
  
  init();
  





