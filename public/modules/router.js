import LoginView from "../views/login.js";
import MainView from "../views/main.js";
import SignupView from "../views/signup.js";
import userStore from "../stores/userStore.js";
import ProfileView from "../views/profile.js";
import WriteLetterView from "../views/write-letter.js";
import LetterView from "../views/letter.js";
import SentView from "../views/sent.js";
import FolderView from "../views/folder.js";
import DraftView from "../views/draft.js";
import SpamView from "../views/spam.js";
import VkSignupHelperView from "../views/vk-signup-helper.js";
import VkLoginHelperView from "../views/vk-login-helper.js";
import dispathcher from "./dispathcher.js";
import Websocket from "./websocket.js";


/**
 * Класс роутера
 * @class
 */

class Router {
    #views
    #authViews
    #currentView
    #redirectView
    historyNum
    isLoading = false

    /**
     * Конструктор класса
     * @constructor
     */
    constructor() {
        this.#views = new Map();
        this.#authViews = new Map();

        this.#views.set('/login', LoginView);
        this.#views.set('/signup', SignupView);

        this.#authViews.set('/main', MainView);
        this.#authViews.set('/profile', ProfileView);
        this.#authViews.set('/write_letter', WriteLetterView);
        this.#authViews.set('/sent', SentView);
        this.#authViews.set('/drafts', DraftView);
        this.#authViews.set('/spam', SpamView);
        this.#authViews.set('/vk-signup-helper', new VkSignupHelperView());
        this.#authViews.set('/vk-login-helper', new VkLoginHelperView());
        this.historyNum = 0;
    }

    /**
     * Функция записи путей в историю браузера
     */
    navigate({ path, state = '', pushState }) {
        this.historyNum += 1;
        if (pushState) {
            window.history.pushState(state, '', `${path}`)
        } else {
            window.history.replaceState(state, '', `${path}`)
        }
    }

    /**
     * Функция проверки прдыдущей записи в истории
     */
    canGoBack() {
        return this.historyNum;
    }

    /**
     * Функция формирования пути
     */
    async redirect(href) {
        let isAuth = await userStore.verifyAuth();
        const authCodeRegex = /^\/auth-vk\/auth\?code=[a-zA-Z0-9]+$/;
        const authLoginCodeRegex = /^\/auth-vk\/loginVK\?code=[a-zA-Z0-9]+$/;
        const signupRegex = /^\/signup$/;

        if (!isAuth) {
            if (signupRegex.test(href)) {
                return href;
            }
            if (authCodeRegex.test(href)) {
                return href;
            }
            if (authLoginCodeRegex.test(href)) {
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

    /**
     * Функция перехода на другой адрес
     */
    open({ path, state = '', pushState, data }) {
        if (!this.isLoading) {
            this.isLoading = true;
            this.#currentView?.clear();
            this.#currentView = this.#views.get(path) || this.#authViews.get(path);
            this.navigate({ path, state, pushState });
            this.#currentView.renderPage(data);
        }

    }

    openWriteLetter({ pushState, data }) {
        if (!this.isLoading) {
            this.isLoading = true;
            this.#currentView?.clear();

            this.#currentView = WriteLetterView;
            this.navigate({ path: `/write-letter`, state: '', pushState });
            this.#currentView.renderPage(data);
        }
    }

    /**
     * Функция перехода на адрес письма
     */
    openLetter({ id, pushState, folder }) {
        
        if (!this.isLoading) {
            this.isLoading = true;
            this.#currentView?.clear();
            if (!folder) {
                this.#currentView = new LetterView(id);
                this.navigate({ path: `/letter?id=${id}`, state: '', pushState });
            } else {
                this.#currentView = new FolderView(id);
                this.navigate({ path: `/folder?id=${id}`, state: '', pushState });
            }
            this.#currentView.renderPage();
        }

    }

    /**
     * Функция старта приложения
     */
    openVkAuth({ id, pushState }) {
        if (!this.isLoading) {
            this.isLoading = true;
            this.#currentView?.clear();
            this.#currentView = new VkSignupHelperView();
            this.navigate({ path: `/auth-vk/auth?code=${id}`, state: '', pushState });
            this.#currentView.renderPage();
        }
    }

    openVkLogin({ id, pushState }) {
        if (!this.isLoading) {
            this.isLoading = true;
            this.#currentView?.clear();
            this.#currentView = new VkLoginHelperView();
            this.navigate({ path: `/auth-vk/loginVK?code=${id}`, state: '', pushState });
            this.#currentView.renderPage();
        }
    }

    async start() {
        window.addEventListener('popstate', async () => {
            let path = await this.redirect(window.location.pathname + window.location.search);
            if (path.indexOf('/letter?') !== -1) {
                this.openLetter({ id: path.replace('/letter?id=', ''), pushState: false });
            } else if (path.indexOf('/folder?') !== -1) {
                this.openLetter({ id: path.replace('/folder?id=', ''), pushState: false, folder: true });
            } else if (path.indexOf('/auth-vk/auth?') !== -1) {
                this.openVkAuth({ id: path.replace('/auth-vk/auth?code=', ''), pushState: false });
            } else if (path.indexOf('/auth-vk/loginVK?') !== -1) {
                this.openVkLogin({ id: path.replace('/auth-vk/loginVK?code=', ''), pushState: false });
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
            this.openVkAuth({ id: path.replace('/auth-vk/auth?code=', ''), pushState: false });
        } else if (path.indexOf('/auth-vk/loginVK?') !== -1) {
            this.openVkLogin({ id: path.replace('/auth-vk/loginVK?code=', ''), pushState: false });
        } else {
            this.open({ path: path, pushState: false });
        }
    }
}

export default new Router();
