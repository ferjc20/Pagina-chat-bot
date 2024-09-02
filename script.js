// Selección de elementos del DOM
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;
let inactivityTimer = null;
let userName = null; // Variable para almacenar el nombre del usuario
let waitingForName = false; // Flag para verificar si estamos esperando el nombre
let waitingForColor = false; // Flag para verificar si estamos esperando el color
let selectedColor = null; // Variable para almacenar el color seleccionado
let waitingForBrand = false; // Flag para verificar si estamos esperando la marca

// Función para crear un nuevo elemento de chat
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" 
        ? `<p></p>` 
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

// Función para crear un nuevo elemento con botones de opciones y un mensaje informativo
const createOptions = (options, infoMessage) => {
    const optionContainer = document.createElement("div");
    optionContainer.classList.add("options-container");

    // Añadir el mensaje informativo si está disponible
    if (infoMessage) {
        const infoElement = document.createElement("p");
        infoElement.classList.add("info-message");
        infoElement.textContent = infoMessage;
        optionContainer.appendChild(infoElement);
    }

    // Añadir los botones de opción
    options.forEach(option => {
        const optionBtn = document.createElement("button");
        optionBtn.classList.add("option-btn");
        optionBtn.textContent = option;
        optionContainer.appendChild(optionBtn);

        // Evento al hacer clic en una opción
        optionBtn.addEventListener("click", () => {
            handleOptionSelection(option);
        });
    });

    return optionContainer;
}

// Función para manejar la selección de una opción
const handleOptionSelection = (selectedOption) => {
    // Crear un mensaje en el chatbox con la opción seleccionada
    chatbox.appendChild(createChatLi(selectedOption, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    if (waitingForColor) {
        selectedColor = selectedOption; // Guardar el color seleccionado
        waitingForColor = false;
        waitingForBrand = true; // Ahora esperamos la selección de la marca

        // Mostrar opciones de marcas
        const brandOptions = ["Marca A", "Marca B", "Marca C", "Marca D"];
        const infoMessage = `Has seleccionado ${selectedOption}. Ahora, elige una marca:`;
        const optionsElement = createOptions(brandOptions, infoMessage);
        chatbox.appendChild(optionsElement);
        return;
    }

    if (waitingForBrand) {
        waitingForBrand = false;

        // Mostrar mensaje de disponibilidad
        const responseMessage = `Si contamos con pintura de color ${selectedColor} de la marca ${selectedOption}. Puede llamar al 2313246 para más detalles.`;
        const responseElement = createChatLi(responseMessage, "incoming");
        chatbox.appendChild(responseElement);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        return;
    }

    // Responder con el mensaje de disponibilidad y número de contacto para otras opciones
    setTimeout(() => {
        const responseMessage = `Si contamos con ${selectedOption.toLowerCase()}. Puede llamar al 2313246 para más detalles.`;
        const responseElement = createChatLi(responseMessage, "incoming");
        chatbox.appendChild(responseElement);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);
}

// Función para obtener la hora actual en formato de 24 horas
const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Función para generar la respuesta del chatbot
const generateResponse = (userMessage) => {
    const normalizedMessage = userMessage.toLowerCase();

    if (waitingForName) {
        if (normalizedMessage.includes("hola") || normalizedMessage.includes("que tal") || normalizedMessage.includes("q onda") || normalizedMessage.includes("hello")) {
            chatbox.appendChild(createChatLi("Hola, ¿cómo te llamas?", "incoming"));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        } else {
            userName = userMessage.trim();
            waitingForName = false;

            const welcomeMessage = `Hola, ${userName}. ¿En qué puedo ayudarte hoy?`;
            chatbox.appendChild(createChatLi(welcomeMessage, "incoming"));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }

        // Reiniciar el temporizador de inactividad
        resetInactivityTimer();
        return;
    }

    // Responder con la hora actual
    if (normalizedMessage.includes("hora") || normalizedMessage.includes("qué hora es")) {
        const currentTime = getCurrentTime();
        const responseMessage = `La hora actual es ${currentTime}.`;
        const responseElement = createChatLi(responseMessage, "incoming");
        chatbox.appendChild(responseElement);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        return;
    }

    // Responder con opciones de tornillos
    if (normalizedMessage.includes("tornillos") || normalizedMessage.includes("tornillo")) {
        const clavoOptions = ["Tornillo de acero", "Tornillo de cemento", "Tornillo de metal", "Tornillo de pan"];
        const infoMessage = "Tenemos estos tipos de tornillos:";
        const optionsElement = createOptions(clavoOptions, infoMessage);
        chatbox.appendChild(optionsElement);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        return;
    }

    // Responder con opciones de clavos
    if (normalizedMessage.includes("clavos") || normalizedMessage.includes("clavo")) {
        const clavoOptions = ["Clavo de acero", "Clavo de cemento", "Clavo de metal", "Clavo de pan"];
        const infoMessage = "Tenemos estos tipos de clavos:";
        const optionsElement = createOptions(clavoOptions, infoMessage);
        chatbox.appendChild(optionsElement);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        return;
    }

    // Responder con opciones de pintura
    if (normalizedMessage.includes("pintura") || normalizedMessage.includes("pinturas")) {
        const colorOptions = ["Rojo", "Azul", "Verde", "Amarillo", "Blanco", "Negro", "Gris", "Naranja", "Rosa", "Violeta", "Marrón", "Cian"];
        const infoMessage = "Tenemos estos colores de pintura:";
        const optionsElement = createOptions(colorOptions, infoMessage);
        chatbox.appendChild(optionsElement);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        waitingForColor = true; // Esperar la selección del color
        return;
    }

    // Responder con la ubicación
    if (normalizedMessage.includes("ubicacion") || normalizedMessage.includes("donde estan")  || normalizedMessage.includes("ubican") || normalizedMessage.includes("dónde se encuentran")) {
        const locationMessage = "Nuestra ubicación es Av. los rosales, arequipa, Peru.";
        const locationElement = createChatLi(locationMessage, "incoming");
        chatbox.appendChild(locationElement);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        return;
    }

    // Mensaje predeterminado si el mensaje no coincide con ningún criterio
    let response = `Lo siento, no entiendo tu mensaje.`;

    // Personalizar la respuesta si el nombre está definido
    if (userName) {
        response = `Lo siento, no entiendo tu mensaje, señor ${userName}.`;
    }

    // Crear un nuevo elemento para la respuesta del chatbot
    const responseElement = createChatLi(response, "incoming");
    chatbox.appendChild(responseElement);
    chatbox.scrollTo(0, chatbox.scrollHeight);
}

// Función para manejar el envío del mensaje
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Crear y añadir el mensaje del usuario al chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Limpiar el área de texto y restaurar su altura
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Reiniciar el temporizador de inactividad
    resetInactivityTimer();

    setTimeout(() => {
        // Actualizar la respuesta después de 600 ms
        generateResponse(userMessage);
    }, 600);
}

// Función para manejar la inactividad del usuario
const resetInactivityTimer = () => {
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(() => {
        let message = "¿Necesitas algo más?";
        if (userName) {
            message = `¿Necesitas algo más, señor ${userName}?`;
        }
        const responseElement = createChatLi(message, "incoming");
        chatbox.appendChild(responseElement);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 9000); // 9 segundos de inactividad
}

// Ajustar la altura del área de texto basada en su contenido
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;

    // Reiniciar el temporizador de inactividad al escribir
    resetInactivityTimer();
});

// Manejar el envío del mensaje con la tecla Enter (sin Shift) y si el ancho de la ventana es mayor a 800px
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

// Manejar el clic en el botón de enviar
sendChatBtn.addEventListener("click", handleChat);

// Manejar el clic en el botón de cerrar
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// Alternar la visibilidad del chatbot al hacer clic en el icono de toggler
chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
    if (!userName) {
        chatbox.appendChild(createChatLi("Hola, ¿cómo te llamas?", "incoming"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        waitingForName = true;
    }
});
