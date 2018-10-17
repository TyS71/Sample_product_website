econst bodyParser = require('body-parser'),
      mongoose = require('mongoose'), 
      methodOverride = require('method-override'),
      express = require('express'),
      request = require('request'),
      app = express(),
      Place = require('./models/place.js'),
      Comment = require('./models/comment.js'),
      User = require('./models/user.js');


const LocalStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      expressSession = require('express-session'),
      passport = require('passport');


mongoose.connect('mongodb://localhost/project1');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(expressSession({
    secret: 'fajkdjaoshgaousnavkasdgjpsdogrpgnqvneqivbhjkfdsahjdfsjfjlljkaslalfadsjldfsajkldfdfjklfjkldfsjkldfsjkldfsjkldfsjlbhipbfdv48340230fj20vn9',
    resave: false, 
    saveUninitialized: false
}));

// app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, resp, next){
    resp.locals.currentUser = req.user;
    next();
});

app.get('/', function(req, resp){
	resp.render('home');
});

app.get('/secondpage', function(req, resp){
	Place.find({}, function(err, foundPlace){
		if(err){
			console.log(err);
		}else{
			resp.render('secondpage', {places: foundPlace, currentUser: req.user});
		}
	})
});

app.get('/secondpage/new', function(req, resp){
	resp.render('new');
});

app.post('/secondpage', function(req, resp){
	Place.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    },function(err, place){
        if(err){
            console.log(err);
        }
        else{
        	resp.redirect('/secondpage'); 
        }
    });
});

app.get('/secondpage/:id', function(req, resp){
	Place.findById(req.params.id).populate('comments').exec(function(err, foundPlace){
		if(err){
			console.log(err);
		}
		else{
			resp.render('show', {place: foundPlace});
		}
	});
});

app.get('/secondpage/:id/edit', function(req, resp){
	Place.findById(req.params.id, function(err, foundPlace){
		if(err){
			console.log(err);
		}
		else{
			resp.render('edit', {place: foundPlace});
		}
	})
});

app.put('/secondpage/:id', function(req, resp){
	Place.findByIdAndUpdate(req.params.id, req.body.place, function(err, updatedPlace){
		if(err){
			console.log(err);
		}
		else{
			resp.redirect("/secondpage/" + req.params.id);
		}
	})
});

app.delete('/secondpage/:id', function(req, resp){
	Place.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err)
		}
		resp.redirect('/secondpage');
	})
});

app.get('/secondpage/:id/comments/new', function(req,resp){
	Place.findById(req.params.id, function(err, foundPlace){
		if(err){
			console.log(err);
		}
		else{
			resp.render('newComment', {place: foundPlace});
		}
	})
});

app.post('/secondpage/:id/comments', function(req, resp){
	Place.findById(req.params.id, function(err, foundPlace){
		if(err){
			console.log(err); 
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				console.log(req.body.comment);
				if(err){
					console.log(err);
				}
				else{
					comment.author.id = req.user._id; 
          comment.author.username = req.user.username;
	        comment.save();
	        foundPlace.comments.push(comment);
          foundPlace.save();
	        resp.redirect('/secondpage/' + req.params.id);
				}
			})
		}
	})
});

app.get('/register', function(req, resp){
	resp.render('register');
});

app.post('/register', function(req, resp){
	console.log(req.body.password);
	User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, user){
    if(err){
        return resp.render("register");
    }
    passport.authenticate("local")(req, resp, function(){
        return resp.redirect('/');
    });
  })
});

app.get('/login', function(req, resp){
	resp.render('login');
});

app.post('/login', 
	passport.authenticate('local', {
	successRedirect:'/secondpage',
	failureRedirect:'/login'
	}),function(req, resp){

});


app.listen(8000, function(){
   console.log('project1 server running...'); 
});