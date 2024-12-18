export const whyBuyFromStcStyles = `
.whyBuySection {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background-color: #F5F5F5;
}

.contentContainer {
    display: flex;
    flex-direction: row;
    max-width: 1200px;
    width: 100%;
    background-color: #F5F5F5;
    padding: 0rem;
}

.sectionTitle {
    flex: 1;
    font-size: 3.5rem; 
    font-weight: 500;
    color: #1a1a1a;
    padding-left: 2rem;
}

.detailsTitle {
    flex: 1;
    font-size: 1.8rem; 
    font-weight: 500;
    color: #1a1a1a;
}

.detailsContainer {
    flex: 2;
    display: flex;
    flex-direction: column;
    padding: 1rem;
}

.detailItem {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem; 
}

.detailTitle {
    font-size: 1rem;
    font-weight: bold;
    color: #1a1a1a;
}

.detailDescription {
    font-size: 0.9rem;
    color: #555;
    line-height: 1.5;
}

@media (max-width: 1024px) {
    .contentContainer {
        flex-direction: column; 
        padding: 1rem;
    }

    .sectionTitle {
        font-size: 3rem;
        padding-left: 1rem;
        text-align: center;
    }

    .detailsTitle {
        font-size: 1.5rem;
        text-align: center;
    }

    .detailsContainer {
        padding: 0.5rem;
    }
}

@media (max-width: 768px) {
    .sectionTitle {
        font-size: 2.5rem; 
        padding-left: 0.5rem;
        text-align: center;
    }

    .detailsTitle {
        font-size: 1.4rem; 
        text-align: center;
    }

    .detailTitle {
        font-size: 0.95rem;
    }

    .detailDescription {
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .whyBuySection {
        padding: 0.5rem;
        margin-top: 1rem; 
        display: flex;
        flex-direction: column;  
        gap: 1rem;  
    }

    .sectionTitle {
        font-size: 2rem;
        padding-left: 0;
        text-align: center;
         margin-bottom: 1rem; 
    }

    .detailsTitle {
        font-size: 1.2rem; 
        margin-bottom: 1rem;
    }

    .detailsContainer {
        padding: 0.5rem;
    }

    .detailTitle {
        font-size: 0.9rem;
         margin-bottom: 0.5rem;
    }

    .detailDescription {
        font-size: 0.8rem;
           margin-bottom: 0.5rem;
    }
}
`
