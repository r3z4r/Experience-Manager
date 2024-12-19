export const technicalSpecsCard = `
.techContainer {
  display: flex;
  justify-content: center;
  padding: 1rem 1rem;
  background-color: #FFFFFF;
}

.techContentContainer {
  display: flex;
  flex-direction: row;
  max-width: 1200px;
  width: 100%;
  background-color: #FFFFFF;
  padding: 1rem;
}

.techSectionTitle {
  flex: 1;
  font-size: 3.5rem; 
  font-weight: 500;
  color: #1a1a1a;
  padding-left: 2rem;
}

.detailsContainer {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.headerCell {
  font-size: 1.2rem;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  padding: 1rem;
  text-align: left;
}

.row {
  border-bottom: 1px solid #ddd;
}

.cell {
  padding: 1rem;
  vertical-align: top;
}

.list {
  margin: 0;
  padding-left: 1.5rem;
}

@media (max-width: 1024px) {
  .techContentContainer {
    flex-direction: column; 
    padding: 1rem 0.5rem;
  }

  .techSectionTitle {
    font-size: 2.5rem; 
    padding-left: 1rem;
  }

  .detailsContainer {
    margin-top: 1rem;
  }

  .headerCell, .cell {
    font-size: 1.1rem; 
    padding: 0.8rem;
  }
}

@media (max-width: 768px) {
  .techSectionTitle {
    font-size: 2rem; 
    padding-left: 0.5rem;
    text-align: center; 

  .detailsContainer {
    margin-top: 0.5rem;
    padding: 0 0.5rem;
  } 

  .headerCell, .cell {
    font-size: 1rem;
    padding: 0.7rem;
  }

  .list {
    padding-left: 1rem;
  }
}

@media (max-width: 480px) {
  .techContentContainer {
    flex-direction: column; 
    padding: 1rem 0.5rem;
    position: relative;
  z-index: 1;
  }

  .techSectionTitle {
    font-size: 1.5rem; 
    padding-left: 0.5rem;
  }

  .detailsContainer {
    margin-top: 0.5rem;
  }

  .headerCell, .cell {
    font-size: 0.9rem; 
    padding: 0.8rem;
  }
}
`
