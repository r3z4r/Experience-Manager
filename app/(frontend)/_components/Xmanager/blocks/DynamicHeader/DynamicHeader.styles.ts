export const dynamicHeaderStyles = `
.dynamicHeader {
    width: 100%;
    background-color: #1a1a1a;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
}

.headerContent {
    display: flex;
    flex: 1;
    align-items: center;
}

.tecnotreeText {
    font-size: 1.5rem;
    color: #00f0ff;
    font-weight: bold;
}

.loginButton {
    background-color: #00f0ff;
    color: #1a1a1a;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: bold;
    cursor: pointer;
    margin-left: auto;
    transition: background-color 0.3s ease;
}

.loginButton:hover {
    background-color: #00d0e0;
}

.logoImg {
    display: block;
}

/* Responsive styles */
@media (max-width: 1024px) {
    .dynamicHeader {
        padding: 1rem 1.5rem; /* Adjust padding for medium screens */
    }

    .tecnotreeText {
        font-size: 1.4rem; /* Slightly smaller font size for tablets */
    }

    .loginButton {
        padding: 0.4rem 0.8rem; /* Adjust button size */
    }
}

@media (max-width: 768px) {
    .dynamicHeader {
        padding: 1rem; /* More compact padding for smaller screens */
    }

    .headerContent {
        flex-direction: column;
        align-items: flex-start;
    }

    .tecnotreeText {
        font-size: 1.3rem; /* Reduce text size for smaller screens */
    }

    .loginButton {
        padding: 0.3rem 0.7rem; /* Even smaller button for better fit */
    }
}

@media (max-width: 480px) {
    .dynamicHeader {
        padding: 0.75rem; /* Compact padding for mobile */
    }

    .tecnotreeText {
        font-size: 1.2rem; /* Reduce text size further for small mobile screens */
    }

    .loginButton {
        padding: 0.25rem 0.5rem; /* Smaller button for tight space */
    }

    .headerContent {
        width: 100%;
        align-items: center;
        justify-content: space-between; /* Align content properly for mobile */
    }
}
`
