import LoginView from "../views/login.js";
import MainView from "../views/main.js";
import SignupView from "../views/signup.js";
import userStore from "../stores/userStore.js";
import ProfileView from "../views/profile.js";
import writeLetter from "../views/write-letter.js";
import LetterView from "../views/letter.js";
import SentView from "../views/sent.js";

class Router {
    #views
    #authViews
    #currentView
    #redirectView
    #historyNum

    constructor() {
        this.#views = new Map();
        this.#authViews = new Map();

        this.#views.set('/login', LoginView);
        this.#views.set('/signup', SignupView);

        this.#authViews.set('/main', MainView);
        this.#authViews.set('/profile', ProfileView);
        this.#authViews.set('/write_letter', writeLetter);
        this.#authViews.set('/sent', SentView);

        this.#historyNum = 0;
    }

    navigate({ path, state = '', pushState }) {
        this.#historyNum += 1;
        if (pushState) {
            window.history.pushState(state, '', `${path}`)
        } else {
            window.history.replaceState(state, '', `${path}`)
        }
    }

    canGoBack() {
        return this.#historyNum;
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