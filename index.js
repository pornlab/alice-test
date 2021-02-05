// Для асинхронной работы используется пакет micro.
const { json } = require('micro');

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://ca1c5102.en.emqx.cloud", {
    port: 11332,
    username: "zxc",
    password: "zxc"
});

client.on("connect", function () {
    client.publish("smarthome/room1/led", "0");
    client.subscribe("smarthome/room1/led", function (err) {
        if (!err) {
            console.log("err");
        }
    });
});

const checkText = (innerText) => {
    const textRequest = innerText.toLowerCase().replace(/\./g, '');
    if (textRequest === "открыть дверь") return "Дверь открыта";
    if (textRequest === "включи свет") {
        client.publish("smarthome/room1/led", "1");
        return "Сейчас все включу";
    }
    if (textRequest === "выключи свет") {
        client.publish("smarthome/room1/led", "0");
        return "Выключила";
    }
    if (textRequest === "поздоровайся") return "Добро пожаловать!";
    return textRequest || 'Добро пожаловать в Тестовое Кафе. На данный момент доступны такие команды, как "Включи свет.", "Выключи свет.", "Поздоровайся"! \nПриятного использования! :)'
};

// Запуск асинхронного сервиса.
module.exports = async (req, res) => {

    // Из запроса извлекаются свойства request, session и version.
    const { request, session, version } = await json(req);

    // В тело ответа вставляются свойства version и session из запроса.
    // Подробнее о формате запроса и ответа — в разделе Протокол работы навыка.
    res.end(JSON.stringify(
        {
            version,
            session,
            response: {
                // В свойстве response.text возвращается исходная реплика пользователя.
                // Если навык был активирован без дополнительной команды,
                // пользователю нужно сказать "Hello!".
                text: checkText(request.original_utterance),

                // Свойство response.end_session возвращается со значением false,
                // чтобы диалог не завершался.
                end_session: false,
            },
        }
    ));
};

client.on("message", function (topic, message) {
    // message is Buffer
    console.log(message.toString());
});
