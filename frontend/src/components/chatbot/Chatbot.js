import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaTrash, FaUser, FaArrowLeft } from 'react-icons/fa';
import { sendChatMessage, resetChatHistory } from '../../services/api';
import ProductCard from '../product/ProductCard';
import './Chatbot.css';



function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        // Reset backend conversation history when component mounts
        const initializeChat = async () => {
            try {
                await resetChatHistory();
                console.log('Chat history reset on page load');
            } catch (error) {
                console.error('Error resetting chat on mount:', error);
            }
        };

        initializeChat();
    }, []); // Empty dependency array = runs once on mount

    useEffect(() => {
        // Check if this is a new session
        const isNewSession = !sessionStorage.getItem('chatInitialized');

        if (isNewSession) {
            const initializeChat = async () => {
                try {
                    await resetChatHistory();
                    sessionStorage.setItem('chatInitialized', 'true');
                    console.log('Chat history reset for new session');
                } catch (error) {
                    console.error('Error resetting chat on mount:', error);
                }
            };

            initializeChat();
        }
    }, []);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen && messages.length === 0) {
            setMessages([
                {
                    text: "Hi! I'm Mark, your VisionTech AI Assistant. I can help you find the perfect tech products. What are you looking for today?",
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                }
            ]);
        }
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(inputMessage, true);

            if (response.success) {
                const botMessage = {
                    text: response.response,
                    products: response.products || [],  // ✅ ADD THIS LINE
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, botMessage]);
            }
            else {
                throw new Error('Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                text: "Sorry, I'm having trouble connecting right now. Please try again.",
                sender: 'bot',
                timestamp: new Date().toISOString(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        try {
            await resetChatHistory();
            setMessages([
                {
                    text: "Conversation reset! How can I help you today?",
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                }
            ]);
        } catch (error) {
            console.error('Reset error:', error);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                className={`chat-toggle-button ${isOpen ? 'active' : ''}`}
                onClick={toggleChat}
                aria-label="Toggle chat"
            >
                {isOpen ? <FaTimes size={24} /> : <FaComments size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    {/* Chat Header */}
                    <div className="chat-header">
                        <div className="chat-header-left">
                            <button
                                className="chat-back-button"
                                onClick={closeChat}
                                title="Close chat"
                                type="button"
                            >
                                <FaArrowLeft size={20} />
                            </button>

                            <div className="chat-profile-picture">
                                <div className="profile-avatar">
                                    <img src="/images/chatbot/visiontech-logo.png" />
                                </div>
                                <div className="online-indicator"></div>
                            </div>

                            <div className="chat-header-info">
                                <h6 className="chat-header-title">Mark</h6>
                                <p className="chat-header-status">Online</p>
                            </div>
                        </div>

                        <button
                            className="chat-reset-button"
                            onClick={handleReset}
                            title="Reset conversation"
                            type="button"
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}
                            >
                                <div className="message-avatar">
                                    {message.sender === 'user' ? (
                                        <FaUser size={16} />
                                    ) : (
                                        <span className="bot-avatar-text">M</span>
                                    )}
                                </div>
                                <div className="message-content">
                                    <p className="message-text">{message.text}</p>

                                    {/* ✅ Render compact product cards */}
                                    {message.products && message.products.length > 0 && (
                                        <div style={{ marginTop: '8px' }}>
                                            {message.products.map((product) => (
                                                <ProductCard key={product._id} product={product} compact={true} />
                                            ))}
                                        </div>
                                    )}

                                    <span className="message-time">{formatTime(message.timestamp)}</span>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="chat-message bot-message">
                                <div className="message-avatar">
                                    <span className="bot-avatar-text">M</span>
                                </div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form className="chat-input-form" onSubmit={handleSendMessage}>
                        <input
                            ref={inputRef}
                            type="text"
                            className="chat-input"
                            placeholder="Ask me about products..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="chat-send-button"
                            disabled={!inputMessage.trim() || isLoading}
                        >
                            <FaPaperPlane size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default Chatbot;