'use client';

import { useState, useEffect, useRef } from 'react';

// Genereer willekeurige kleuren
const getRandomColor = () => {
    const colors = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

// Genereer willekeurige tekst
const generateRandomText = () => {
    const texts = [
        'Klik hier!', 'Niet hier!', 'Misschien hier?', 'Probeer dit!',
        'Nee, hier!', 'Fout!', 'Bijna!', 'Verkeerd!', 'Probeer opnieuw!',
        'Niet deze!', 'Deze dan?', 'Misschien deze?', 'Fout antwoord!'
    ];
    return texts[Math.floor(Math.random() * texts.length)];
};

const menuItems = Array.from({ length: 50 }, (_, i) => `Optie ${i + 1}`);

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const [showDynamicButtons, setShowDynamicButtons] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const [randomPositions, setRandomPositions] = useState<{ [key: number]: { x: number, y: number, rotate: number } }>({});
    const [buttonSizes, setButtonSizes] = useState<{ [key: number]: { width: string, height: string } }>({});
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [itemColors, setItemColors] = useState<{ [key: number]: string }>({});
    const [itemTexts, setItemTexts] = useState<{ [key: number]: string }>({});
    const [isShaking, setIsShaking] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const shakeIntervalRef = useRef<NodeJS.Timeout>();
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const [buttonColor, setButtonColor] = useState('bg-blue-500');
    const [buttonText, setButtonText] = useState('Open Menu');
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    useEffect(() => {
        // Genereer willekeurige posities en rotaties
        const positions: { [key: number]: { x: number, y: number, rotate: number } } = {};
        const sizes: { [key: number]: { width: string, height: string } } = {};
        const colors: { [key: number]: string } = {};
        const texts: { [key: number]: string } = {};

        menuItems.forEach((_, index) => {
            positions[index] = {
                x: Math.random() * 20 - 10,
                y: Math.random() * 20 - 10,
                rotate: Math.random() * 10 - 5
            };

            // Willekeurige knopgroottes (extreem klein of extreem groot)
            const isLarge = Math.random() > 0.5;
            sizes[index] = {
                width: isLarge ? 'w-40' : 'w-12',
                height: isLarge ? 'h-16' : 'h-4'
            };

            colors[index] = getRandomColor();
            texts[index] = generateRandomText();
        });

        setRandomPositions(positions);
        setButtonSizes(sizes);
        setItemColors(colors);
        setItemTexts(texts);

        // Start periodieke shake animatie
        shakeIntervalRef.current = setInterval(() => {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 200);
        }, 3000);

        // Toon dynamische knoppen na 2 seconden
        const timer = setTimeout(() => {
            setShowDynamicButtons(true);
        }, 2000);

        // Verander de knopkleur elke 2 seconden
        const colorInterval = setInterval(() => {
            setButtonColor(getRandomColor());
        }, 2000);

        // Verander de knoptekst elke 3 seconden
        const textInterval = setInterval(() => {
            const texts = [
                'Open Menu',
                'Klik Hier!',
                'Niet Klikken!',
                'Misschien Hier?',
                'Probeer Dit!',
                'Fout Knop!'
            ];
            setButtonText(texts[Math.floor(Math.random() * texts.length)]);
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearInterval(shakeIntervalRef.current);
            clearInterval(colorInterval);
            clearInterval(textInterval);
        };
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    const handleOptionClick = (option: string, index: number) => {
        // 50% kans dat de selectie wordt genegeerd
        if (Math.random() > 0.5) {
            setSelectedOption(option);
            // Verander de tekst en kleur van het geselecteerde item
            setItemTexts(prev => ({
                ...prev,
                [index]: generateRandomText()
            }));
            setItemColors(prev => ({
                ...prev,
                [index]: getRandomColor()
            }));
        }
    };

    const handleDynamicButtonClick = (action: string) => {
        switch (action) {
            case 'shuffle':
                // Schud de menu items en verander hun posities
                const shuffled = [...menuItems].sort(() => Math.random() - 0.5);
                menuItems.splice(0, menuItems.length, ...shuffled);
                // Genereer nieuwe willekeurige posities
                const newPositions = { ...randomPositions };
                Object.keys(newPositions).forEach(key => {
                    newPositions[Number(key)] = {
                        x: Math.random() * 20 - 10,
                        y: Math.random() * 20 - 10,
                        rotate: Math.random() * 10 - 5
                    };
                });
                setRandomPositions(newPositions);
                break;
            case 'reset':
                setSelectedOption(null);
                // Verander alle teksten en kleuren
                const newTexts = { ...itemTexts };
                const newColors = { ...itemColors };
                Object.keys(newTexts).forEach(key => {
                    newTexts[Number(key)] = generateRandomText();
                    newColors[Number(key)] = getRandomColor();
                });
                setItemTexts(newTexts);
                setItemColors(newColors);
                break;
            case 'toggle':
                setIsOpen(!isOpen);
                break;
        }
    };

    const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isButtonHovered) {
            // 30% kans dat de knop wegschiet
            if (Math.random() < 0.3) {
                setButtonPosition({
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50
                });
            }
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <div
                className={`flex items-center space-x-2 p-2 bg-gray-100 rounded cursor-pointer transition-all duration-300 ${isShaking ? 'animate-shake' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <button
                    className={`px-4 py-2 ${buttonColor} text-white rounded hover:bg-blue-600 transition-all duration-300 ${isButtonHovered ? 'animate-pulse' : ''}`}
                    style={{
                        transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
                        transition: 'transform 0.2s ease-out'
                    }}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => {
                        setIsButtonHovered(false);
                        setButtonPosition({ x: 0, y: 0 });
                    }}
                    onMouseMove={handleButtonMouseMove}
                    onClick={() => {
                        // 20% kans dat de knop niet reageert op klikken
                        if (Math.random() > 0.2) {
                            setIsOpen(!isOpen);
                        }
                    }}
                >
                    {buttonText}
                </button>
                {selectedOption && (
                    <span className="text-sm text-gray-600">
                        Geselecteerd: {selectedOption}
                    </span>
                )}
            </div>

            <div
                className={`absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="max-h-96 overflow-y-auto">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className={`px-4 cursor-pointer transition-all duration-300 ${hoveredItem === index
                                ? 'transform scale-110'
                                : 'hover:bg-gray-200'
                                } ${buttonSizes[index]?.width} ${buttonSizes[index]?.height} ${itemColors[index]}`}
                            style={{
                                transform: `translate(${randomPositions[index]?.x || 0}px, ${randomPositions[index]?.y || 0}px) rotate(${randomPositions[index]?.rotate || 0}deg)`,
                                transitionDelay: `${index * 20}ms`
                            }}
                            onMouseEnter={() => setHoveredItem(index)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => handleOptionClick(item, index)}
                        >
                            {itemTexts[index] || item}
                        </div>
                    ))}
                </div>
            </div>

            {showDynamicButtons && (
                <div className="mt-4 flex space-x-2 animate-fade-in">
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        style={{ animationDelay: '300ms' }}
                        onClick={() => handleDynamicButtonClick('shuffle')}
                    >
                        Schud Items
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        style={{ animationDelay: '600ms' }}
                        onClick={() => handleDynamicButtonClick('reset')}
                    >
                        Reset Selectie
                    </button>
                    <button
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                        style={{ animationDelay: '900ms' }}
                        onClick={() => handleDynamicButtonClick('toggle')}
                    >
                        Toggle Menu
                    </button>
                </div>
            )}
        </div>
    );
} 