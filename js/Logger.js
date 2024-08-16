const getPadded = (num) => (num < 10 ? "0" : "") + num;
const getTimestamp = (date) => `${getPadded(date.getHours())}:${getPadded(date.getMinutes())}:${getPadded(date.getSeconds())}`;

class Logger {
    /** @type {HTMLTextAreaElement} */
    $element;

    /**
     * 생성자
     * @param $element {HTMLTextAreaElement}
     */
    constructor($element) {
        this.$element = $element;
    }

    /**
     * 로그 출력
     * @param message {string}
     */
    log(message) {
        const timestamp = getTimestamp(new Date());
        const newLine = this.$element.value ? "\n" : "";
        const formattedMessage = `${newLine}[${timestamp}] ${message}`;

        this.$element.value = this.$element.value + formattedMessage;
        this.$element.scrollTo(0, this.$element.scrollHeight);
    }
}

export default Logger;
