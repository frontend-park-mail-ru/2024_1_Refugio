import LoginView from "../views/login.js";
import MainView from "../views/main.js";
import SignupView from "../views/signup.js";
import userStore from "../stores/userStore.js";
import ProfileView from "../views/profile.js";
import writeLetter from "../views/write-letter.js";
import LetterView from "../views/letter.js";
import SentView from "../views/sent.js";
import SurveyView from "../views/survey.js";
import StatView from "../views/stat.js";
import FolderView from "../views/folder.js";
import DraftView from "../views/draft.js";
import SpamView from "../views/spam.js";

/**
 * Класс роутера
 * @class
 */
class Router {
    #views
    #authViews
    #currentView
    #redirectView
    #historyNum

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
        this.#authViews.set('/write_letter', writeLetter);
        this.#authViews.set('/sent', SentView);
        this.#authViews.set('/survey', SurveyView);
        this.#authViews.set('/stat', StatView);
        this.#authViews.set('/drafts', DraftView);
        this.#authViews.set('/spam', SpamView);


        this.#historyNum = 0;
    }

    /**
     * Функция записи путей в историю браузера
     */
    navigate({ path, state = '', pushState }) {
        this.#historyNum += 1;
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
        return this.#historyNum;
    }

    /**
     * Функция формирования пути
     */
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

    /**
     * Функция перехода на другой адрес
     */
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

    /**
     * Функция перехода на адрес письма
     */
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

    /**
     * Функция старта приложения
     */
    async start() {
        window.addEventListener('popstate', async () => {
            let path = await this.redirect(window.location.pathname + window.location.search);
            if (path.indexOf('/letter?') !== -1) {
                this.openLetter({ id: path.replace('/letter?id=', ''), pushState: false });
            } else if (path.indexOf('/folder?') !== -1) {
                this.openLetter({ id: path.replace('/folder?id=', ''), pushState: false, folder: true });
            } else {
                this.open({ path: path, pushState: false });
            }
        });
        let path = await this.redirect(window.location.pathname + window.location.search);
        if (path.indexOf('/letter?') !== -1) {
            this.openLetter({ id: path.replace('/letter?id=', ''), pushState: false });
        } else if (path.indexOf('/folder?') !== -1) {
            this.openLetter({ id: path.replace('/folder?id=', ''), pushState: false, folder: true });
        } else {
            this.open({ path: path, pushState: false });
        }
    }
}

export default new Router();
