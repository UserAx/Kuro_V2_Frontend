import React, { useState, useEffect } from 'react';
import {
    startFetchMessages,
    startPostMessage,
    startPostAttachment,
    startFetchAttachment,
    startRemoveMessages
} from '../actions/message';
import { connect } from 'react-redux';
import Avatar from './AvatarComponent';
import { startHasAvatar } from '../actions/user';
import { io } from './Kuro';
import filterByDate from '../utils/filterByDateAndText';


const Room = (props) => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState([]);
    const [error, setError] = useState(undefined);

    const fetchContents = async () => {
        try {
            await props.startFetchMessages(props.token, props.contact.id).then((result) => {
                setMessages(result.data);
            });
            setError(undefined);
        } catch (e) {
            setError("Unable to get previous messages. Please try again.");
        }
    }

    // useEffect(() => {
    //     setMessages(filterByDate(messages));
    // }, [messages]);

    useEffect(() => {
        setMessages([...messages, newMessage]);
    }, [newMessage]);

    useEffect(() => {
        fetchContents();

        io.on("message", (message) => {
            setNewMessage(message);
        });
    }, []);

    const onhandleSend = async () => {
        const messageText = document.getElementById("messagebox__input__message").value;
        const attachment = document.getElementById("messagebox__input__file").files[0];
        const message = { message: messageText, receivers: [props.contact.id], seen: false };
        try {
            if (!messageText && !attachment) {
                setError(undefined);
                return;
            }
            await props.startPostMessage(props.token, message)
                .then(async (result) => {
                    if (attachment) {
                        await props.startPostAttachment(props.token, result.data._id, attachment)
                            .then((result) => {
                                io.emit('sendMessage', result.data, (error) => {
                                    if (error) {
                                        return console.log(error);
                                    }
                                });
                                setMessages([...messages, result.data]);
                            });
                    }
                    io.emit('sendMessage', result.data, (error) => {
                        if (error) {
                            return console.log(error);
                        }
                    });
                    setMessages([...messages, result.data]);
                });
            setError(undefined);
            document.getElementById("messagebox__input__message").value = '';
            setAttachmentTitleOnSpan("");
        } catch (e) {
            setError("Unable to send. Please try again.");
            console.log(e);
        }
    }


    const handleDeleteMessage = async (messageId) => {
        try {
            await props.startRemoveMessages(props.token, messageId).then((result) => {
                const newMessages = messages.map((message) => {
                    if (message._id === result.data._id) {
                        message.message = result.data.message;
                    }
                    return message;
                });
                setMessages(newMessages);
            });
        } catch (e) {
            console.log(e);
        }
    }

    const setAttachmentTitleOnSpan = (title) => {
        const attachmentTitle = document.querySelector('.input__attachment__title');
        attachmentTitle.innerText = title;
    }

    const onhandleAttachment = (e) => {
        setAttachmentTitleOnSpan(e.target.files[0].name);
    }

    return (
        <div className="room">
            <div className="room__container">
                <Avatar
                    username={props.contact.username}
                    displaySmall={false}
                    hasAvatar={props.contact.hasAvatar}
                    contactId={props.contact.id} />
                <span className=" room__contact__username">{props.contact.username}</span>
                <div className="room__chatbox">
                    {filterByDate(messages).map((message) => {
                        if (message.sender === props._id) {
                            return (
                                <div key={message._id} className="chatbox__messagebox message--sentmessage">
                                    {/* {message.attachment && 
                                    <input
                                    className="chatbox__message__input"
                                    type="file"
                                    value={message.attachment.attached.data} />} */}
                                    <span className="chatbox__message">{message.message}</span>
                                    <div className="chatbox__options">
                                        <input type="checkbox" id="chatbox__messagebox__options__checkbox" />
                                        <span className="contact__options__dots">...</span>
                                        <button disabled={(message.sender !== props._id) ? true : false}
                                            className="chatbox__messagebox__option__button"
                                            onClick={() => handleDeleteMessage(message._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <div key={message._id} className="chatbox__messagebox">
                                {/* {message.attachment && <input
                                    className="chatbox__message__input"
                                    type="file"
                                    value={message.attachment} />} */}
                                <span className="chatbox__message">{message.message}</span>
                                <div className="chatbox__options">
                                    <input type="checkbox" id="chatbox__messagebox__options__checkbox" />
                                    <span className="contact__options__dots">...</span>
                                    <button disabled={(message.sender !== props._id) ? true : false}
                                        className="chatbox__messagebox__option__button"
                                        onClick={() => handleDeleteMessage(message._id)}>
                                        Delete
                                </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="chatbox__messgaebox">
                        <span className="error">{error}</span>
                        <span className="input__attachment__title"></span>
                        <div className="messagebox__input__container">
                            <input type="text" id="messagebox__input__message" />
                            <div className="messagebox__input__attachment">
                                <input 
                                type="file"
                                accept="image/*, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, application/pdf"
                                value={undefined}
                                onChange={onhandleAttachment}
                                id="messagebox__input__file" />
                                <img
                                    className="app__buttonlogo"
                                    src="/images/attachment.png" />
                            </div>
                            <button onClick={onhandleSend} className="button__messagebox">Send</button>
                        </div>
                    </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => ({
    startFetchMessages: (token, contactId) => dispatch(startFetchMessages(token, contactId)),
    startPostMessage: (token, message) => dispatch(startPostMessage(token, message)),
    startPostAttachment: (token, messageId, attachment) => dispatch(startPostAttachment(token, messageId, attachment)),
    startFetchAttachment: (token, contactId, messageId) => dispatch(startFetchAttachment(token, contactId, messageId)),
    startHasAvatar: (id) => dispatch(startHasAvatar(id)),
    startRemoveMessages: (token, messageId) => dispatch(startRemoveMessages(token, messageId))
});

const mapStateToProps = (state) => {
    const contact = state.user.contacts.find((contact) => contact.id === state.filter.id);
    return {
        contact,
        username: state.user.username,
        _id: state.user._id
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);