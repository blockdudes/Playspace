import './Square.css';
const hoverEffect = '/Sound/hover.wav';
const DiamondEffect = '/Sound/gold.wav';
const goldIcon = '/assets/gold.png';
const bombIcon = '/assets/bomb.png';
import { useEffect, useState } from 'react';

function Square({ mine, setGameOver, gameOver, setScore, disabled }: { mine: boolean, setGameOver: (value: boolean) => void, gameOver: boolean, setScore: any, disabled: boolean }) {

    let [image, setImage] = useState<any>(null);

    useEffect(() => {
        if(disabled) return;
        if (gameOver) {
            if (mine) {
                setImage(bombIcon);
            }
            else {
                setImage(goldIcon);
            }
        }
    }, [gameOver, mine])

    function mouseEnterHandle() {
        if(disabled) return;
        if (!image) {
            console.log('sound played')
            const sound = new Audio(hoverEffect);
            sound.play();
        }
    }

    function clickHandler() {

        if(gameOver || disabled) return;

        if (!mine) {
            setScore((prevValue: any) => {
                return prevValue * 2;
            });
            setImage(goldIcon);
            console.log('sound played')
            const sound = new Audio(DiamondEffect);
            sound.play();
        } else {
            alert("You Loose The Game");
            setGameOver(true);
        }
    }

    return <>
        <div
            className='square-item'
            onMouseEnter={mouseEnterHandle}
            onClick={clickHandler}
        >
            {image && <img height={90} width={90} src={image} />}
        </div>
    </>
}

export default Square;
