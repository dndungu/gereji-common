"use strict";
module.exports = {
	"get": function(context, then){
		try{
			var sandbox = { context : context };
			sandbox.operation = "find";
			var model = new (require(__dirname + "/lib/model.js"));
			model.init(sandbox);
            if(!model.allow)
                sandbox.context.statusCode(401);
			if(!model.allow)
				throw new Error("You are not allowed access to this resource.");
			if(sandbox._id)
				model.query._id = sandbox._id;
			model.collection.find(model.query).sort({creation_time: -1}).toArray(then);
		}catch(error){
			then(error, null);
			context.log(1, error.stack);
		}
	},
	"post": function(sandbox){
		try{
			var sandbox = {context : context};
			var model = new (require(__dirname + "/model.js"));
			model.init(sandbox);
            if(!model.allow)
                sandbox.context.statusCode(401);
            if(!model.allow)
                throw new Error("User is not allowed write access to this resource.");
            if(sandbox._id)
                model.query._id = sandbox._id;
			model[sandbox.operation](function(error, items){
				if(error)
					throw new Error(error);
				return sandbox.data(items).end();
			});
		}catch(error){
			sandbox.context.log(2, error.toString());
			sandbox.context.statusCode(503);
			sandbox.data({error: error.toString()});
			sandbox.end();
		}
	},
	"delete": function(sandbox){
		try{
			var sandbox = {context : context};
			sandbox.operation = "remove";
			var model = new (require(__dirname + "/model.js"));
			model.init(sandbox);
            if(!model.allow)
                sandbox.context.statusCode(401);
            if(!model.allow)
                throw new Error("You are not allowed to delete this resource.");
            if(sandbox._id)
                model.query._id = sandbox._id;
			model.collection.remove(query, function(error, items){
				if(!error)
					return sandbox.data(items).end();
				sandbox.context.statusCode(503);
				return sandbox.data({error: error.toString()}).end();
			});
		}catch(error){
			sandbox.context.log(2, error.toString());
			sandbox.data({error: error.toString()});
			sandbox.end();
		}
	},
	"put": function(sandbox){
		//TODO
	}
};
