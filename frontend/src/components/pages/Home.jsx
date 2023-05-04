import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Home.css";
import "../../App.css";

function App() {
    const [message, setMessage] = useState('');
    const [inputText, setInputText] = useState('');
    const [history, setHistory] = useState([]);
    
    const URL = "http://127.0.0.1:8000";

    useEffect(() => {
        axios.get(`${URL}/`)
            .then(response => {
                setMessage(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        axios.get(`${URL}/history`)
            .then(response => {
                setHistory(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the chat history on update
        const chatHistory = document.getElementById('chathistory');
        chatHistory.scrollTop = chatHistory.scrollHeight;
      }, [history]);


    const handleSubmit = e => {
        e.preventDefault();

        if (inputText.toLowerCase() === 'bye') {
            axios.post(`${URL}/post`, { text: inputText })
                .then(response => {
                    setMessage("Goodbye!");
                    setHistory([]);
                    setInputText('');
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            axios.post(`${URL}/post`, { text: inputText })
                .then(response => {
                    setMessage(response.data);
                    setHistory([...history, { input: inputText, response: response.data }]);
                    setInputText('');
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    return (

        <div className="page home-page">
            <div className="head">
                <div>
                    <li className="header">Welcome to Chitti </li>
                    <li className="tagline">The Ramen Expert</li>
                </div>
                <img
                    className="panda"
                    src="https://www.freepnglogos.com/uploads/panda-png/panda-clip-art-clkerm-vector-clip-art-online-27.png"
                ></img>
            </div>

            <div className="section">
                <img
                    className="ramen-img"
                    src="https://img.freepik.com/premium-vector/hand-drawn-cute-ramen-noodle-illustration-design-vector_90573-539.jpg?w=2000"
                ></img>
                <div className="chat-container">
                    <div className="message-history-container" id="chathistory">

                        <ul>
                            <li>
                                <strong>Chitti:</strong> Hi! I'm Chitti. Ask me anything about Ramen. Type 'bye' at any point to end and clear the chat.
                            </li>
                            {history.map((item, index) => (
                                <li key={index}>
                                    <strong>Me: </strong> {item.input}
                                    <br />
                                    <strong>Chitti: </strong> {item.response}
                                </li>
                            ))}
                        </ul>

                    </div>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={inputText}
                            className="new-message-window"
                            onChange={e => setInputText(e.target.value)}
                        ></input>
                        <button type="submit" className="buttons">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
}

export default App;
