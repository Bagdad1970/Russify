import '../assets/styles/components/GridContainer.css';

const GridContainer = ({ children }) => (
    <div className="grid-container-wrapper">
        <div className="grid-container">
            {children}
        </div>
    </div>
);

export default GridContainer;