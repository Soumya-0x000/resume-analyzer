import React from 'react';
import './loader.css'

export const Loader = () => {
    return (
        <div className="ai-matrix-loader">
            <div className="digit">0</div>
            <div className="digit">1</div>
            <div className="digit">0</div>
            <div className="digit">1</div>
            <div className="digit">1</div>
            <div className="digit">0</div>
            <div className="digit">0</div>
            <div className="digit">1</div>
            <div className="glow" />
        </div>
    );
};
