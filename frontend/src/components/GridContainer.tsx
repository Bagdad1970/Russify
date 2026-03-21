import type { ReactNode } from 'react';
import '../assets/styles/components/GridContainer.css';

interface GridContainerProps {
    children: ReactNode;
}

const GridContainer = ({ children }: GridContainerProps) => (
    <div className="grid-container-wrapper">
        <div className="grid-container">
            {children}
        </div>
    </div>
);

export default GridContainer;
