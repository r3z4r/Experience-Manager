export const footerBannerStyles = `
.footer {
    background: #1a1a1a;
    color: white;
    padding: 2rem 0;
    font-family: Arial, sans-serif;
    text-align: center;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.social-icon-link {
    font-size: 2rem;
    color: #ffffff;
    text-decoration: none;
    width: 3rem;
    height: 3rem;
    display: flex;
    padding: 1rem;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #ffffff;
    border: 1px solid #333;
}

.social-icons a:hover {
    background-color: #2563eb;
    color: #ffffff;
}

.social-icons {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
}

.contact-details {
    display: flex;
    flex-direction: column;
    justify-content: left;
    color: #ffffff;
    font-size: 14px;
}

.contact-details p {
    margin: 0;
    line-height: 1.5;
}

.footer-contact p:first-child {
    font-weight: bold;
}

.footer-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.footer-contact {
    display: flex;
    align-items: center;
    background-color: #1a1a1a;
    padding: 10px 20px;
    border-radius: 8px;
}

.footer-logo {
    margin-right: 15px;
}

.footer-links {
    margin-left: 2rem;
    display: flex;
    gap: 2rem;
    text-align: center;
}

.quick-link {
    color: white;
    text-decoration: none;
    font-weight: bold;
}

.quick-link:hover {
    color: #00bcd4;
}

.footer-social {
    display: flex;
    gap: 1rem;
}

.social-link {
    font-size: 1.5rem;
    color: white;
    text-decoration: none;
}

.social-link:hover {
    opacity: 0.7;
}

.footer-description {
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #ccc;
}

.footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #333;
    padding-top: 1rem;
    font-size: 0.8rem;
    color: #aaa;
}

.footer-legal {
    display: flex;
    gap: 1rem;
}

.footer-link {
    color: white;
    text-decoration: none;
}

.footer-link:hover {
    color: #00bcd4;
}

/* Responsive styles */
@media (max-width: 1024px) {
    .footer-container {
        padding: 0 2rem;
    }

    .footer-main {
        flex-direction: column;
        text-align: center;
    }

    .footer-links {
        flex-direction: column;
        margin-left: 0;
        gap: 1rem;
    }

    .footer-description {
        font-size: 1rem;
    }

    .footer-bottom {
        flex-direction: column;
        align-items: flex-start;
        padding-top: 1.5rem;
    }
}

@media (max-width: 768px) {
    .footer-main {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .footer-contact {
        flex-direction: column;
        align-items: flex-start;
        padding: 1rem;
        margin-bottom: 1rem;
    }

    .footer-logo {
        margin-right: 0;
    }

    .footer-links {
        flex-direction: column;
        gap: 1rem;
    }

    .footer-social {
        flex-direction: column;
        gap: 0.5rem;
    }

    .footer-bottom {
        flex-direction: column;
        padding-top: 1rem;
        text-align: left;
    }

    .footer-description {
        font-size: 1rem;
        margin-bottom: 1.5rem;
    }
}

@media (max-width: 480px) {
    .footer {
        padding: 1rem 0;
    }

    .footer-container {
        padding: 0 1rem;
    }

    .footer-main {
        flex-direction: column;
        align-items: flex-start;
    }

    .footer-description {
        font-size: 0.85rem;
        margin-bottom: 1rem;
    }

    .footer-bottom {
        flex-direction: column;
        align-items: flex-start;
        padding-top: 1rem;
        text-align: left;
    }

    .footer-logo {
        margin-bottom: 1rem;
    }

    .footer-links {
        margin-top: 1rem;
        gap: 1.5rem;
    }

    .footer-social {
        gap: 0.5rem;
    }

    .social-icon-link {
        width: 2.5rem;
        height: 2.5rem;
    }

    .footer-contact {
        flex-direction: column;
        align-items: flex-start;
    }
}
`
