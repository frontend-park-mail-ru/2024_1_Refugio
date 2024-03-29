import loginView from "../views/login.js";
import mainView from "../views/main.js";
import SignupView from "../views/signup.js";
import userStore from "../stores/userStore.js";

class Router {
    #views
    #authViews
    #currentView
    #redirectView

    constructor() {
        this.#views = new Map();
        this.#authViews = new Map();

        this.#views.set('/login', loginView)
        this.#views.set('/signup', new SignupView())
        
        this.#authViews.set('/main', mainView)
    }

    navigate({path, state='', pushState}) {
        if (pushState) {
            window.history.pushState(state, '', `${window.location.origin}${path}`)
        } else {
            window.history.replaceState(state, '', `${window.location.origin}${path}`)
        }
    }

    redirect(href) {
        const isAuth = userStore.verifyAuth()
        if (!isAuth) {
            if (href === '/signup') {
                return href;
            } else {
                this.redirectView = href;
                return '/signin';
            }
        }
        if (href==='' || href==='/' || href==='/signin' || href==='/signup'){
            return '/main';
        } else {
            if (this.#redirectView) {
                const redirectedView = this.#redirectView;
                this.#redirectView = undefined;
                return redirectedView;
            } else {
                return href;
            }
        }
    }

    open({path, state='', pushState}) {
        this.#currentView = this.#views.get(path) || this.#authViews.get(path);
        this.navigate(path, state, pushState);
        this.#currentView.renderPage();
    }
}

export default new Router();