import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import FarmScene from '../phaser/FarmScene.js';

export default function FarmGame({ onFarmCellClick }) {
    const gameContainer = useRef(null);
    const gameInstance = useRef(null);

    useEffect(() => {
        if (!gameInstance.current) {
            const config = {
                type: Phaser.AUTO,
                parent: gameContainer.current,
                width: '100%',
                height: '100%',
                transparent: true,
                scale: {
                    mode: Phaser.Scale.RESIZE,
                    autoCenter: Phaser.Scale.CENTER_BOTH
                },
                scene: [FarmScene]
            };
            
            gameInstance.current = new Phaser.Game(config);
        }

        // Listen for events from Phaser
        const handleFarmCellClick = (e) => {
            if (onFarmCellClick) {
                onFarmCellClick(e.detail);
            }
        };
        
        window.addEventListener('farmCellClick', handleFarmCellClick);

        return () => {
            window.removeEventListener('farmCellClick', handleFarmCellClick);
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
                gameInstance.current = null;
            }
        };
    }, [onFarmCellClick]);

    return (
        <div 
            ref={gameContainer} 
            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        />
    );
}
