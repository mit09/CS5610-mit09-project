/** EXPRESS **/
var express = require('express');
var app = express();

var async = require('async');
/** BODY PARSER AND MULTER **/
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

/** MONGOOSE **/
var mongoose = require('mongoose');
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/project';
mongoose.connect(connectionString);

/*SHA-1*/
var sha1 = require('sha1');

/* TAG SCHEMA*/
var tagSchema = new mongoose.Schema({
    hashtag: String,
    creationDateTime: {type: Date, default: Date.now}
}, { collection: "tag" });

var TagModel = mongoose.model("tag", tagSchema);


/* FORUM SCHEMA*/
var forumSchema = new mongoose.Schema({
    forumName: String,
    creationDateTime: { type: Date, default: Date.now }
}, { collection: "forum" });

var ForumModel = mongoose.model("forum", forumSchema);

/* USER SCHEMA*/
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    creationDateTime: { type: Date, default: Date.now },
    following:[{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tag' }],
    email: String,
    imgUrl: String
}, { collection: "user" });

var UserModel = mongoose.model("user", userSchema);

/* POST SCHEMA*/
var postSchema = new mongoose.Schema({
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title:String,
    createdAt: { type: Date, default: Date.now },
    lastEditedAt: { type: Date, default: Date.now },
    editedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    content: String,
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tag' }], 
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }]

}, { collection: "post" });

var PostModel = mongoose.model("post", postSchema);

/* Comment SCHEMA*/
var commentSchema = new mongoose.Schema({
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    comment: String,
    createdAt: { type: Date, default: Date.now },
    lastEditedAt: { type: Date, default: Date.now },
}, { collection: "comment" });

var commentModel = mongoose.model("comment", commentSchema);

/* Carpool SCHEMA*/
var carpoolSchema = new mongoose.Schema({
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now },
    lastEditedAt: { type: Date, default: Date.now },
    source: String,
    destination: String,
    cost: Number,
    date: Date,
    type: String,
    numberOfPassenger: Number,
    numberOfAvailable: Number,
    memo: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
    isClose: {type: Boolean, default: false}
}, { collection: "carpool" });

var carpoolModel = mongoose.model("carpool", carpoolSchema);


app.use(express.static(__dirname + '/public'));



/* COMMENT THIS LATER**/
app.get('/process', function (req, res) {
    res.json(process.env);
});

/**********Redirect to html pages**********/
var path = require('path');
app.get('/read', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/1.html'));
});

/**********END Of Redirect to html pages**********/

/**********LOGIN**********/
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());

/* Create a local strategy to login user with credentials stored in mongodb*/
passport.use(new LocalStrategy(
function (username, password, done) {

    UserModel.findOne({ username: username, password: password }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
    })
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

/* Login user*/
app.post("/login", passport.authenticate('local'), function (req, res) {
    var user = req.user;
    res.json(user);
});

app.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

/*Logout user*/
app.post('/logout', function (req, res) {
    req.logOut();
    res.send(200);
});

/*Register user*/
app.post('/register', function (req, res) {
    var newUser = req.body;
    newUser.roles = ['student'];
    UserModel.findOne({ username: newUser.username }, function (err, user) {
        if (err) { return next(err); }
        if (user) {
            res.json(null);
            return;
        }
        var newUser = new UserModel(req.body);
        newUser.save(function (err, user) {
            req.login(user, function (err) {
                if (err) { return next(err); }
                res.json(user);
            });
        });
    });
});

var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};

/*
app.get("/rest/user", auth, function (req, res) {
    UserModel.find(function (err, users) {
        res.json(users);
    });
});

app.delete("/rest/user/:id", auth, function (req, res) {
    UserModel.findById(req.params.id, function (err, user) {
        user.remove(function (err, count) {
            UserModel.find(function (err, users) {
                res.json(users);
            });
        });
    });
});

app.put("/rest/user/:id", auth, function (req, res) {
    UserModel.findById(req.params.id, function (err, user) {
        user.update(req.body, function (err, count) {
            UserModel.find(function (err, users) {
                res.json(users);
            });
        });
    });
});

app.post("/rest/user", auth, function (req, res) {
    UserModel.findOne({ username: req.body.username }, function (err, user) {
        if (user == null) {
            user = new UserModel(req.body);
            user.save(function (err, user) {
                UserModel.find(function (err, users) {
                    res.json(users);
                });
            });
        }
        else {
            UserModel.find(function (err, users) {
                res.json(users);
            });
        }
    });
});
*/
/**********END LOGIN**********/


/**********ADMIN**********/
/**********ADMIN/FORUM**********/
app.get("/forum", function (req, res) {
    ForumModel.find(function (err, data) {
        res.json(data);
    });
});

app.get("/forum/:id", function (req, res) {
    ForumModel.findById(req.params.id, function (err, data) {
        res.json(data);
    });
});

app.post("/forum", function (req, res) {
    var newForum = new ForumModel({
        forumName: req.body.forumName
    })

    /*ASYNC 1: save*/
    newForum.save(function (err) {
        if (err) {
            console.log('Forum: ' + req.body.forumName + ' not inserted');
        } else {
            console.log('Forum: ' + req.body.forumName + ' inserted');
        }
        /*ASYNC 2: find all*/
        ForumModel.find(function (err, data) {
            res.json(data);
        });
    });
});


app.delete("/forum/:id", function (req, res) {
    /*ASYNC 1: remove*/
    ForumModel.remove({ '_id': req.params.id }, function (err, numberOfRowsDeleted) {
        if (numberOfRowsDeleted == 1) {
            console.log('Forum id:' + req.params.id + ' deleted')
        } else {
            console.log('Forum id:' + req.params.id + ' not deleted')
        }
        /*Redundant code*/
        /*ASYNC 2: get all*/
        ForumModel.find(function (err, data) {
            res.json(data);
        });
    });
});

app.put("/forum", function (req, res) {

    /*ASYNC 1: get by id*/
    ForumModel.findById(req.body._id, function (err, forum) {
        forum.forumName = req.body.forumName;

        /*ASYNC 2: save*/
        forum.save(function (err) {
            if (err) {
                console.log('Forum: ' + req.body.forumName + ' not updated');
            } else {
                console.log('Forum: ' + req.body.forumName + ' updated');
            }

            /*ASYNC 3: find all*/
            ForumModel.find(function (err, data) {
                res.json(data);
            });
        });
    });
});

/**********END ADMIN/FORUM**********/

/**********ADMIN/TAG**********/

app.get("/tags", function (req, res) {
    TagModel.find(function (err, data) {
        res.json(data);
    });
});

app.get("/tags/:id", function (req, res) {
    TagModel.findById(req.params.id, function (err, data) {
        res.json(data);
    });
});

app.get("/tags/contains/:term", function (req, res) {
    TagModel.find({ hashtag: new RegExp(req.params.term,"i") }, function (err, data) {
        res.json(data)
    });
});


app.delete("/tags/:id", function (req, res) {
    /*ASYNC 1: remove*/
    TagModel.remove({ '_id': req.params.id }, function (err, numberOfRowsDeleted) {
        if (numberOfRowsDeleted == 1) {
            console.log('Tag id:'+req.params.id+' deleted')
        } else {
            console.log('Tag id:' + req.params.id + ' not deleted')
        }
        /*Redundant code*/
        /*ASYNC 2: get all*/
        TagModel.find(function (err, data) {
            res.json(data);
        });
    });
});


app.post("/tags", function (req, res) {
    var newTag = new TagModel({
        hashtag: req.body.hashtag
    })

    /*ASYNC 1: save*/
    newTag.save(function (err) {
        if (err) {
            console.log('Tag: ' + req.body.hashtag + ' not inserted');
        } else {
            console.log('Tag: ' + req.body.hashtag + ' inserted');
        }
        /*ASYNC 2: find all*/
        TagModel.find(function (err, data) {
            res.json(data);
        });
    });
});

app.put("/tags", function (req, res) {
    
    /*ASYNC 1: get by id*/
    TagModel.findById(req.body._id, function (err, tag) {
        tag.hashtag = req.body.hashtag;

        /*ASYNC 2: save*/
        tag.save(function (err) {
            if (err) {
                console.log('Tag id:' + req.body.hashtag + ' not updated');
            } else {
                console.log('Tag id:' + req.body.hashtag + ' updated');
            }

            /*ASYNC 3: find all*/
            TagModel.find(function (err, data) {
                res.json(data);
            });
        });
    });
});
/**********END ADMIN/TAG**********/

/**********ADMIN/   **********/



app.get("/user", function (req, res) {
    UserModel.find(function (err, data) {
        res.json(data);
    });
});

app.get("/user/:id", function (req, res) {
    UserModel.findById(req.params.id, function (err, data) {
        res.json(data);
    });
});

app.get("/user/detail/:id", function (req, res) {
    UserModel.findById(req.params.id).populate('following').populate('follower').populate('favorite').exec( function (err, data) {
        res.json(data);
    });
});

app.delete("/user/:id", function (req, res) {
    /*ASYNC 1: remove*/
    UserModel.remove({ '_id': req.params.id }, function (err, numberOfRowsDeleted) {
        if (numberOfRowsDeleted == 1) {
            console.log('User id:' + req.params.id + ' deleted')
        } else {
            console.log('User id:' + req.params.id + ' not deleted')
        }
        /*Redundant code*/
        /*ASYNC 2: get all*/
        UserModel.find(function (err, data) {
            res.json(data);
        });
    });
});


app.post("/user", function (req, res) {

    if(req.body.email!=null){
        var hashEmail = sha1(req.body.email);
        var emailToImgUrl = 'http://www.gravatar.com/avatar/' + hashEmail + '?d=identicon';
    }
     
    var newUser = new UserModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        imgUrl: emailToImgUrl
    })

    /*ASYNC 1: save*/
    newUser.save(function (err) {
        if (err) {
            console.log('User: ' + req.body.username + ' not inserted');
        } else {
            console.log('User: ' + req.body.username + ' inserted');
        }
        /*ASYNC 2: find all*/
        UserModel.find(function (err, data) {
            res.json(data);
        });
    });
});

app.put("/user", function (req, res) {

    /*ASYNC 1: get by id*/
    UserModel.findById(req.body._id, function (err, user) {
        user.username = req.body.username;
        user.password = req.body.password;
        
        /*ASYNC 2: save*/
        user.save(function (err) {
            if (err) {
                console.log('User id:' + req.body.username + ' not updated');
            } else {
                console.log('User id:' + req.body.username + ' updated');
            }

            /*ASYNC 3: find all*/
            UserModel.find(function (err, data) {
                res.json(data);
            });
        });
    });
});

app.put("/user/one", function (req, res) {

    /*ASYNC 1: get by id*/
    UserModel.findById(req.body._id, function (err, user) {
        user.following = req.body.following;
        user.follower = req.body.follower;
        user.favorite = req.body.favorite;
        

        /*ASYNC 2: save*/
        user.save(function (err) {

            if (err) {
                console.log('User id:' + req.body.username + ' not updated');
            } else {
                console.log('User id:' + req.body.username + ' is updated.');
            }

            /*ASYNC 3: find by id*/
            UserModel.findById(req.body._id, function (err, data) {
                res.json(data);
            });
        });
    });
});




/**********END ADMIN/USER**********/
/**********END ADMIN**********/

/**********POSTS**********/

app.get('/post', function (req, res) {
    PostModel.find().populate('postedBy').populate('editedBy').populate('tags').exec(function (err, data) {
        res.json(data);
    });
});

app.get('/post/:id', function (req, res) {
    PostModel.findById(req.params.id, function (err, data) {
        res.json(data);
    });
});

app.get('/post/detail/:id', function (req, res) {
    PostModel.findOne({ _id: req.params.id }).populate('postedBy').populate('editedBy').populate('tags').populate('comments').exec(function (err, data) {
        var options = {
            path: 'comments.commentedBy',
            model: 'user'
        };

        PostModel.populate(data, options, function (err, data_inner) {
            res.json(data_inner);
        })
    });
});

app.get('/post/tag/:tagId', function (req, res) {
    PostModel.find({ tags: req.params.tagId }).populate('postedBy').populate('editedBy').populate('tags').populate('comments').exec(function (err, tagData) {
        res.json(tagData);
    });
});

app.get('/post/user/:userId', function (req, res) {
    PostModel.find({ postedBy: req.params.userId }).populate('postedBy').populate('editedBy').populate('tags').populate('comments').exec(function (err, tagData) {
        res.json(tagData);
    });
});


var getTagObjects = function (tags) {
    console.log(tags);
    tags.forEach(function (entry) {
        TagModel.find({ hashtag: entry.text }, function (err, tagData) {
            tags.push(tagData);
        });
    });
};
    

app.post('/post', function (req, res) {

    /*var tags = getTagObjects(req.body.tags);*/
    

    var newPost = new PostModel({
        postedBy: req.body.postedBy,
        title: req.body.title,
        editedBy: req.body.editedBy,
        content: req.body.content,
        tags: req.body.tags
    });

    newPost.save(function (err) {
        if (err) {
            console.log('Post with title: ' + req.body.title + ' not inserted. Error'+err);
        } else {
            console.log('Post with title: ' + req.body.title + ' inserted');
        }
    });
    //post.push(req.body);
    res.json();
});

app.delete("/post/:id", function (req, res) {
    /*ASYNC 1: remove*/
    PostModel.remove({ '_id': req.params.id }, function (err, numberOfRowsDeleted) {
        if (numberOfRowsDeleted == 1) {
            console.log('Post id:' + req.params.id + ' deleted')
        } else {
            console.log('Post id:' + req.params.id + ' not deleted')
        }
        
        /*ASYNC 2: get all*/
        PostModel.find(function (err, data) {
            res.json(data);
        });
    });
});

app.put("/post/one", function (req, res) {

    /*ASYNC 1: get by id*/
    PostModel.findById(req.body._id, function (err, post) {
        post.title = req.body.title;
        post.content = req.body.content;
        post.comments = req.body.comments;

        /*ASYNC 2: save*/
        post.save(function (err) {

            if (err) {
                console.log('Post with title:' + req.body.title + ' not updated');
            } else {
                console.log('Post with title:' + req.body.title + ' is updated.');
            }

            /*ASYNC 3: find by id*/
            PostModel.findById(req.body._id, function (err, data) {
                res.json(data);
            });
        });
    });
});


/**********END POSTS**********/


/**********COMMENTS**********/
app.post('/comment', function (req, res) {

    /*var tags = getTagObjects(req.body.tags);*/


    var newComment = new commentModel({
        commentedBy: req.body.commentedBy,
        comment: req.body.comment
    });

    newComment.save(function (err, newcomment) {
        if (err) {
            console.log('Comment: ' + req.body.comment + ' not inserted. Error' + err);
        } else {
            console.log('Comment: ' + req.body.comment + ' inserted');
        }
        res.json(newcomment);
    });
    
    
});
/**********END COMMENTS**********/

/**********CARPOOL**********/

app.get('/carpool', function (req, res) {
    carpoolModel.find().populate('postedBy').exec(function (err, data) {
        res.json(data);
    });
});


app.get('/carpool/:id', function (req, res) {
    carpoolModel.findById(req.params.id, function (err, data) {
        res.json(data);
    });
});



app.get('/carpool/detail/:id', function (req, res) {
    carpoolModel.findById(req.params.id).populate('postedBy').populate('comments').exec(function (err, data) {
        var options = {
            path: 'comments.commentedBy',
            model: 'user'
        };

        carpoolModel.populate(data, options, function (err, data_inner) {
            res.json(data_inner);
        })
    });
});


app.get('/carpool/user/:userId', function (req, res) {
    carpoolModel.find({ postedBy: req.params.userId }).populate('postedBy').populate('comments').exec(function (err, carpoolData) {
        res.json(carpoolData);
    });
});

app.post('/carpool', function (req, res) {

    var newCarpool = new carpoolModel({
        postedBy: req.body.postedBy,
        source: req.body.source,
        destination: req.body.destination,
        cost: req.body.cost,
        type: req.body.type,
        numberOfPassenger: req.body.numberOfPassenger,
        memo: req.body.memo,
        date: req.body.date
    });

    newCarpool.save(function (err) {
        if (err) {
            console.log('Carpool Post with source: ' + req.body.source + ' not inserted. Error' + err);
        } else {
            console.log('Carpool Post with source: ' + req.body.source + ' inserted');
        }
    });
    
    //BLANK RESPONSE
    res.json();
});

app.delete("/carpool/:id", function (req, res) {
    /*ASYNC 1: remove*/
    carpoolModel.remove({ '_id': req.params.id }, function (err, numberOfRowsDeleted) {
        if (numberOfRowsDeleted == 1) {
            console.log('Carpool id:' + req.params.id + ' deleted')
        } else {
            console.log('Carpool id:' + req.params.id + ' not deleted')
        }

        /*ASYNC 2: get all*/
        carpoolModel.find(function (err, data) {
            res.json(data);
        });
    });
});

app.put("/carpool/one", function (req, res) {

    /*ASYNC 1: get by id*/
    carpoolModel.findById(req.body._id, function (err, post) {

        post.comments = req.body.comments;
        post.isClose = req.body.isClose;

        /*ASYNC 2: save*/
        post.save(function (err) {

            if (err) {
                console.log('Carpool Post with source: ' + req.body.source + ' not updated');
            } else {
                console.log('Carpool Post with source: ' + req.body.source + ' is updated.');
            }

            /*ASYNC 3: find by id*/
            carpoolModel.findById(req.body._id, function (err, data) {
                res.json(data);
            });
        });
    });
});


/**********END CARPOOL**********/



var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);
