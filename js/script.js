import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

const $ = el => document.querySelector(el);

// Asignando los elementos del DOM a una constante
const $form = $('form');
const $input = $('input');
const $template = $('#message-template');
const $messages = $('ul');
const $container = $('main');
const $button = $('button');

let messages = [];

const SWLECTED_MODEL = 'gemma-2b-it-q4f32_1-MLC';

const engine = await CreateMLCEngine(SWLECTED_MODEL,
    {
        initProgressCallback: (info) => {
            console.log('initProgressCallback', info);
            if (info.progress === 1) {
                $button.removeAttribute('disabled')
            }
        }
    }
);

$form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const messageText = $input.value.trim();

    if (messageText !== '') {

        $input.value = '';
    }

    addMessage(messageText, 'user');
    $button.setAttribute('disabled', true);

    const response = await engine.chat.completions.create({
        messages: [
            ...messages,
            {
                role: 'user',
                content: messageText
            }
        ]
    });
    
    })

function addMessage(text, sender) {
    // Clonamos el template
    const clone = $template.content.cloneNode(true);
    const $newMessage = clone.querySelector('.message');

    const $who = $newMessage.querySelector('span');
    const $text = $newMessage.querySelector('p');

    $text.textContent = text;
    $who.textContent = sender === 'bot' ? 'GPT' : 'Tú';
    $newMessage.classList.add(sender);

    // Actualizamos el scroll
    $messages.appendChild($newMessage);
    $container.scrollTop = $container.scrollHeight;
}
