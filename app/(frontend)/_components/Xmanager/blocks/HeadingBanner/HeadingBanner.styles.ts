export const HeadingBannerStyles = `
.mainContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.headerTitle {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
}

.subPart {
    display: flex;
    gap: 2rem;
}

.filter {
    cursor: pointer;
    color: #555;
}

.sort {
    cursor: pointer;
    font-weight: bold;
    color: #000;
}

/* Responsive styles */
@media (max-width: 1024px) {
    .mainContainer {
        padding: 1rem 1.5rem; /* Adjust padding for medium screens */
    }

    .headerTitle {
        font-size: 2rem; /* Reduce title size for tablets */
    }

    .subPart {
        gap: 1.5rem; /* Decrease gap between filter and sort options */
    }
}

@media (max-width: 768px) {
    .mainContainer {
        flex-direction: column; /* Stack content vertically */
        align-items: flex-start;
        padding: 1rem; /* Further reduce padding */
    }

    .headerTitle {
        font-size: 1.8rem; /* Further reduce title size for smaller screens */
        margin-bottom: 1rem; /* Add spacing below the title */
    }

    .subPart {
        gap: 1rem; /* Reduce gap further */
        width: 100%; /* Full width for options */
        justify-content: space-between;
    }
}

@media (max-width: 480px) {
    .mainContainer {
        padding: 0.5rem 1rem; /* Compact padding for mobile */
    }

    .headerTitle {
        font-size: 1.5rem; /* Compact title size */
    }

    .subPart {
        flex-direction: column; /* Stack filter and sort vertically */
        gap: 0.5rem;
    }

    .filter, .sort {
        font-size: 0.9rem; /* Reduce font size for better fit */
    }
}
`
