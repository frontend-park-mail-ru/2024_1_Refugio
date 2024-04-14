import "../views/login.js";
import "../views/main.js";
import "../views/signup.js";
import "../stores/userStore.js";
import "../views/profile.js";
import "../views/write-letter.js";
import "../views/letter.js";
import "../views/sent.js";

class Router {
    #views
    #authViews
    #currentView
    #redirectView

    constructor() {
        this.#views = new Map();
        this.#authViews = new Map();

        this.#views.set('/login', LoginView);
        this.#views.set('/signup', SignupView);

        this.#authViews.set('/main', MainView);
        this.#authViews.set('/profile', ProfileView);
        this.#authViews.set('/write_letter', writeLetter);
        this.#authViews.set('/sent', SentView);
    }

    navigate({ path, state = '', pushState }) {
        if (pushState) {
            window.history.pushState(state, '', `${path}`)
        } else {
            window.history.replaceState(state, '', `${path}`)
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
        if (href === '' || href === '/' || href === '/login' || href === '/signup') {
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

    open({ path, state = '', pushState, data }) {
        if (this.#currentView) {
            this.#currentView.clear();
        }
        this.#currentView = this.#views.get(path) || this.#authViews.get(path);
        this.navigate({ path, state, pushState });
        if (data) {
            this.#currentView.renderPage(data);
        } else {
            this.#currentView.renderPage();
        }
    }

    openLetter({ id, pushState }) {
        if (this.#currentView) {
            this.#currentView.clear();
        }
        this.#currentView = new LetterView(id);
        this.navigate({ path: `/letter?id=${id}`, state: '', pushState });
        this.#currentView.renderPage();
    }

    async start() {
        window.addEventListener('popstate', async () => {
            let path = await this.redirect(window.location.pathname + window.location.search);
            if (path.indexOf('/letter?') !== -1) {
                this.openLetter({ id: path.replace('/letter?id=', ''), pushState: false });
            } else {
                this.open({ path: path, pushState: false });
            }
        });
        let path = await this.redirect(window.location.pathname + window.location.search);
        if (path.indexOf('/letter?') !== -1) {
            this.openLetter({ id: path.replace('/letter?id=', ''), pushState: false });
        } else {
            this.open({ path: path, pushState: false });
        }
    }
}

export default new Router();