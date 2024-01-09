import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const port = 3000;
var i = 0;
var i1 = 0;

const messages = {
    name: [],
    title: [],
    content: [],
};
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/edits/:title", (req, res) => {
    var edTitle = req.params.title;
    var edPos = 0;
    var possibleEdTitle = messages.title[0];
    for(edPos=0; edTitle != possibleEdTitle; edPos++) {
        possibleEdTitle = messages.title[edPos];
    }
    res.render("editing.ejs", {title: messages.title[edPos], name: messages.name[edPos], content: messages.content[edPos],});
});

app.get("/", (req, res) => {
    res.render("index.ejs", {message: messages,});
    const number = messages.title.length;
    if (i<number) {
        console.log("working in here");
        for (i1; i1<number; i1++) {
            var title = messages.title[i1];
            app.get("/" + messages.title[i1], (req, res) => {
                res.render("./clientDocs/" + title + ".ejs");
            });
        }
        i1 = number;
    }
});


app.post("/posts", (req, res) => {
    messages.name.push(req.body["name"]);
    messages.title.push(req.body["title"]);
    messages.content.push(req.body["content"]);
    console.log(messages);
    var number = messages.title.length;
    var delTitle = req.body["title"];
    var firstPos = 0;
    var rep = 0;
    for(var delPos=0; delPos < number; delPos++) {
        console.log("working")
        if(messages.title[delPos] === delTitle){
            rep++;
            if(rep==1)
            {
              firstPos = delPos;  
            }
            
            if(rep>=2) {
                messages.title.splice(firstPos, 1);
                messages.name.splice(firstPos, 1);
                messages.content.splice(firstPos, 1);
                console.log(firstPos);
                console.log(messages);
            }
        }
    }
    rep = 0;
    number = messages.title.length;
    i = 0;
    if (i<number) {;
        for (i; i<number; i++) {
            console.log(messages.content[i]);
            console.log("running")
            const data = '<%-include("../partials/header.ejs")%><li class="nav-item"><a href="/"class="nav-link active">Home</a></li><li class="nav-item"><a href="/posts"class="nav-link">Post</a></li><li class="nav-item"><a href="/contact"class="nav-link">Contact us</a></li></ul></header></div><div class="parent"><div class="contact layer"><div class="innerContact"><form method="post" action="/delete/' + messages.title[i] + '" class="noHeight"><input class="bg-danger left-align" type="submit" name="delete" value="delete"></form> <form method="GET" action="/edits/' + messages.title[i] + '" class="noHeight"> <input class="bg-danger left-align" type="submit" name="edit" value="edit"> </form><h1>' + messages.title[i] +'</h1><h5>' + messages.name[i] + '</h5><p class="mx-3">' + messages.content[i] + '</p></div></div><%-include("../partials/footer.ejs")%>'
            fs.writeFile("./views/clientDocs/" + messages.title[i] + ".ejs", data, (err) => {
                if (err) {console.log(err);}
            });
            var title = messages.title[i];
            app.get("/" + messages.title[i], (req, res) => {
                res.render("./clientDocs/" + title + ".ejs");
            });
        }
        i = 0;
    }
    res.redirect("/")
    return messages;
});

app.get("/posts", (req, res) => {
    res.render("post.ejs");
});

app.post("/contact", (req, res) => {
    res.render("contact.ejs", {name: req.body["name"],})
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.get("/delete", (req, res) => {
    const directory = "./views/clientDocs";

    fs.readdir(directory, (err, files) => {
      if (err) throw err;
    
      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    })
    messages.name = [];
    messages.title = [];
    messages.content = [];
    console.log(messages.title.length);
    i = 0;
    i1 = 0;
    res.redirect("/")
});

app.post("/delete/:title", (req, res) => {
    console.log(req.params.title);
    var delTitle = req.params.title;
    var delPos = 0;
    var possibleDelTitle = messages.title[0];
    var directory = "./views/clientDocs";
    fs.unlink(path.join(directory, delTitle + ".ejs"), (err) => {
        if (err) throw err;
    });
    for(delPos=0; delTitle != possibleDelTitle; delPos++) {
        possibleDelTitle = messages.title[delPos];
    }
    messages.title.splice(delPos, 1);
    messages.name.splice(delPos, 1);
    messages.content.splice(delPos, 1);
    res.redirect("/");
    

});



app.listen(port, () => {
    console.log(`Port ${port} is up and running`)
});


