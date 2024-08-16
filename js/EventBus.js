class EventBus {
    /** @type {{[eventName: string]: {(data: any): void;}[]}} */
    events;

    /**
     * 생성자
     */
    constructor() {
        this.events = {};
    }

    /**
     * Sub
     * @param eventName {string}
     * @param handler {{(data: any): void;}}
     */
    subscribe(eventName, handler) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(handler);
    }

    /**
     * Pub
     * @param eventName {string}
     * @param data {any}
     */
    publish(eventName, data) {
        if (!this.events[eventName]) {
            return;
        }

        for (const handler of this.events[eventName]) {
            handler(data);
        }
    }
}

export default new EventBus();