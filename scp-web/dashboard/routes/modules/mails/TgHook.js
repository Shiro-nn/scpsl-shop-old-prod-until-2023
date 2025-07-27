module.exports = async(text) => {
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: JSON.stringify({
            text: text,
            //parse_mode: 'Markdown',
            disable_web_page_preview: true,
            disable_notification: false,
            reply_to_message_id: null,
            chat_id: '-934074586'
        })
    };
    await fetch('https://api.telegram.org//sendMessage', options);
};