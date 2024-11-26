import './style.css'

const TypingIndicator = ({ typing }) => {
    if (!typing) return null;

    return (
        <div className="typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    );
};

export default TypingIndicator
