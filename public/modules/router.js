import LoginView from "../views/login.js";
import MainView from "../views/main.js";
import SignupView from "../views/signup.js";
import userStore from "../stores/userStore.js";
import ProfileView from "../views/profile.js";
import writeLetter from "../views/write-letter.js";
import LetterView from "../views/letter.js";
import SentView from "../views/sent.js";
import FolderView from "../views/folder.js";
import DraftView from "../views/draft.js";
import SpamView from "../views/spam.js";

import VkAuthHelperView from "../views/vk-auth-helper.js";


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
        this.#authViews.set('/drafts', DraftView);
        this.#authViews.set('/spam', SpamView);
        this.#authViews.set('/vk-auth-helper', new VkAuthHelperView());



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
        const authCodeRegex = /^\/auth-vk\/auth\?code=[a-zA-Z0-9]+$/;
        const signupRegex = /^\/signup$/;
        const authHelperRegex = /^\/vk-auth-helper$/;

        if (!isAuth) {
            if (signupRegex.test(href)) {
                return href;
            }
            if (authCodeRegex.test(href)) {
                return href;
            }
            if (authHelperRegex.test(href)) {
                return href;
            }
            this.redirectView = href;
            return '/login';

        }
        if (href === '' || href === '/' || href === '/login' || href === '/signup' || authCodeRegex.test(href)) {
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

    openLetter({ id, pushState, folder }) {
        if (this.#currentView) {
            this.#currentView.clear();
        }
        if (!folder) {
            this.#currentView = new LetterView(id);
            this.navigate({ path: `/letter?id=${id}`, state: '', pushState });
        } else {
            this.#currentView = new FolderView(id);
            this.navigate({ path: `/folder?id=${id}`, state: '', pushState });
        }
        this.#currentView.renderPage();
    }

    openVkAuth({ id, pushState }) {
        if (this.#currentView) {
            this.#currentView.clear();
        }
        this.#currentView = new VkAuthHelperView();
        this.navigate({ path: `/auth-vk/auth?code=${id}`, state: '', pushState });
        this.#currentView.renderPage();
    }

    async start() {
        window.addEventListener('popstate', async () => {
            let path = await this.redirect(window.location.pathname + window.location.search);
            if (path.indexOf('/letter?') !== -1) {
                this.openLetter({ id: path.replace('/letter?id=', ''), pushState: false });
            } else if (path.indexOf('/folder?') !== -1) {
                this.openLetter({ id: path.replace('/folder?id=', ''), pushState: false, folder: true });
            } else if (path.indexOf('/auth-vk/auth?') !== -1) {
                this.openVkAuth({ id: href.replace('/auth-vk/auth?code=', ''), pushState: false });
            } else {
                this.open({ path: path, pushState: false });
            }
        });
        let path = await this.redirect(window.location.pathname + window.location.search);
        if (path.indexOf('/letter?') !== -1) {
            this.openLetter({ id: path.replace('/letter?id=', ''), pushState: false });
        } else if (path.indexOf('/folder?') !== -1) {
            this.openLetter({ id: path.replace('/folder?id=', ''), pushState: false, folder: true });
        } else if (path.indexOf('/auth-vk/auth?') !== -1) {
            this.openVkAuth({ id: href.replace('/auth-vk/auth?code=', ''), pushState: false });
        }
        else {
            this.open({ path: path, pushState: false });
        }
    }
}

export default new Router();
