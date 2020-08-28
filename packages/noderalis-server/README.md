# @noderalis/server ("S⋂r" || "nServr")

> _Serve your application with security at scale._

Server uses Firebase to secure your live application with API Limits in mind.

We want to take manual execution out of the hands of the developer and allow nServr to execute it for them, as well as staying on top of dead links (possibly plugin logic).

_**Remember**: we're not building a normal server, we're building a direct graphql server. We'll extrapolate the underlying logic into a server type, or "engine"._

Implementation is currently being planned. The following is not set-in-stone.

- app/controller/\<controller-filename\>.ts
- app/model/\<model-filename\>.ts

```ts
@Controller('/')
class Home {
	@Route.GET()
	getHome() {
		return { hello: 'World!' };
	}
	@Route.POST()
	postHome() {
		Route.redirect('*');
	}
}

@Component(Dashboard) /* Possible React impl. */
@Authenticate({ role: 'admin' })
@Controller('/dashboard')
class Dashboard {
	@Route.GET()
	getDashboard() {
		return render(...opts); /* Possible React impl. */
	}
}

@Controller('/signup')
class SignUp {
	@Route.GET()
	newUser() {
		return; /* React User Page */
	}
}

@Controller('*')
class NotFound {
	@Route.NotFound()
	notFound() {
		return { message: '404: Not Found!' };
	}
}
```

```ts
class UserController extends Controller {}
```

```ts
class UserRoute extends Route {
	@Route.GET('/user/:id')
	getUserFromId() {
		// ...
	}

}
```


```ts
class ApplicationServer extends NoderalisServer {

}

new ApplicationServer(...opts);
```
