import LoginView from "../views/login.js";
import MainView from "../views/main.js";
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

        this.#views.set('/login', LoginView)
        this.#views.set('/signup', SignupView)
        
        this.#authViews.set('/main', MainView)
    }

    navigate({path, state='', pushState}) {
        if (pushState) {
            window.history.pushState(state, '', `${window.location.origin}${path}`)
        } 
    }

    async redirect(href) {
        let isAuth = await userStore.verifyAuth();
        if (!isAuth) {
            if (href === '/signup') {
                return href;
            } else {
                this.redirectView = href;
                return '/login';
            }
        }
        if (href==='' || href==='/' || href==='/login' || href==='/signup'){
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

    async start() {
        const path = window.location.pathname;
        const redirectPath = await this.redirect(window.location.pathname);
        this.open({path: redirectPath, state: '', pushState: true})
    }
}

export default new Router();